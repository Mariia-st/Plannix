// Telegraf para iniciar el bot , Markup para botones de telegram, Scenes y session para guardar datos que va pedir el bot
const { Telegraf, Markup, Scenes, session } = require("telegraf");
//taskService para ejecutar bbdd desde bot
const taskService = require("../controlllers/service/taskService");
//bbdd
const prisma = require("../db");
//carga datos de .env
require("dotenv").config();

// lanzamos el bot
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

//el calendar de telegram
const Calendar = require("telegraf-calendar-telegram");
const calendar = new Calendar(bot);

//wizard  para pedir y guardar datos para creación de tarea
const taskWizard = new Scenes.WizardScene(
  "CREAR_TASK",
  // 1 el titulo de tarea
  (ctx) => {
    //inicializamos nuestra data
    ctx.wizard.state.data = {};
    //pedimos escribir el titulo
    ctx.reply("Escribe el título de tu nueva tarea:");
    //pasamos al siguente
    return ctx.wizard.next();
  },

  //guardamos el titulo y pedimos siguente dato  
  (ctx) => {
    //proccesamos descripcion
    ctx.wizard.state.data.title = ctx.message.text;
    ctx.reply("Ahora escribe la descripción:");
    return ctx.wizard.next();
  },
 
  (ctx) => {
    ctx.wizard.state.data.description = ctx.message.text;
    const keyboard = Markup.inlineKeyboard([
      [Markup.button.callback("Pendiente", "status_pendiente")],
      [Markup.button.callback("En curso", "status_en_curso")],
      [Markup.button.callback("Completada", "status_completada")],
    ]);
    ctx.reply("Elige el status de la tarea:", keyboard);
    return ctx.wizard.next();
  },

  (ctx) => {
    //si el user no ha pinchado el boton 
    if (!ctx.callbackQuery) return ctx.reply("Por favor, usa los botones.");
    //guarda el status
    ctx.wizard.state.data.status = ctx.callbackQuery.data.replace("status_", "");
    ctx.answerCbQuery("¡Status guardado!"); // envia a telegram 
    
    
    const kb = Markup.inlineKeyboard([
      [Markup.button.callback("Baja", "prio_baja")],
      [Markup.button.callback("Media", "prio_media")],
      [Markup.button.callback("Alta", "prio_alta")],
      [Markup.button.callback("Urgente", "prio_urgente")],
    ]);
    ctx.editMessageText("Ahora elige la prioridad:", kb);
    return ctx.wizard.next(); 
  },

  (ctx) => {
    if (!ctx.callbackQuery) return ctx.reply("Por favor, usa los botones.");

    ctx.wizard.state.data.priority = ctx.callbackQuery.data.replace("prio_", "");
    ctx.answerCbQuery("Prioridad guardada.");
    
    ctx.editMessageText("Elige el deadline:", calendar.getCalendar()); // aparece el calendario para elegir la fecha
 
    return ctx.wizard.next();
  },
  // creamos la tarea
  async (ctx) => {
    if (!ctx.callbackQuery || !ctx.callbackQuery.data.includes("calendar-telegram-date-")) {
      // Si no es fecha ignoramos
      // No llamamos a next() ni a leave() para que el usuario pueda volver a intentar
      return ctx.answerCbQuery("Por favor, selecciona una fecha válida en el calendario.");
    }
  
      const date =  ctx.callbackQuery.data.replace("calendar-telegram-date-", "");
      
      //formateamos la fecha con tiempo 
      const deadlineDate = date ? new Date(date) : new Date();
      ctx.wizard.state.data.deadline = deadlineDate; // seteamos la fecha


      const timeKeyboard = Markup.inlineKeyboard([
        [Markup.button.callback("09:00", "time_09:00"), Markup.button.callback("12:00", "time_12:00")],
        [Markup.button.callback("15:00", "time_15:00"), Markup.button.callback("18:00", "time_18:00")],
        [Markup.button.callback("21:00", "time_21:00")]
      ]);
  
      ctx.editMessageText("📅 Fecha seleccionada. Ahora elige la hora:", timeKeyboard);
      return ctx.wizard.next(); // Pasamos al último paso
    },


    async (ctx) => {
      if (!ctx.callbackQuery || !ctx.callbackQuery.data.startsWith("time_")) {
        return ctx.answerCbQuery("Por favor, selecciona una hora.");
      }
  
      const time = ctx.callbackQuery.data.replace("time_", ""); // "15:00"
      const [hours, minutes] = time.split(":");
  
      // Actualizamos el objeto Date que ya teníamos
      const finalDate = new Date(ctx.wizard.state.data.deadline);
      finalDate.setHours(parseInt(hours), parseInt(minutes));
      
      ctx.wizard.state.data.deadline = finalDate;
  
      // Crear tarea en BBDD
      const user = await prisma.user.findFirst({ where: { telegramId: ctx.from.id.toString() } });
      await taskService.createTasks({ ...ctx.wizard.state.data, userId: user.id });
  
      ctx.editMessageText("✅ ¡Tarea creada con éxito con fecha y hora!");
      menu(ctx);
      return ctx.scene.leave();
  },

);

//wizard 
const stage = new Scenes.Stage([taskWizard]);
bot.use(session());
bot.use(stage.middleware());


//bot start
bot.start(async (ctx) => {
  await ctx.reply("Soy PlannixBot, te ayudo manejar tus tareas :)");
  await ctx.reply("Para empezar pon /code y tu codigo");
});

//bot incia el user
bot.command("code", async (context) => {
  //sacamos el codigo
  const inputCode = context.message.text.split(" ")[1];
  if (!inputCode) {
    return context.reply("Por favor, introduce el código así: /code 1234");
  }

  try {
    // buscamos el user que tiene este codigo y no esta caducado
    const user = await prisma.user.findFirst({
      where: { telegramCode: inputCode, codeExpiresAt: { gt: new Date() } },
    });

    
    if (!user) {
      return context.reply(
        "El código es incorrecto o ha expirado. Genera uno nuevo en tu perfil.",
      );
      
    }

    //quitamos datos viejos y dejanos solo id de telegram para no entrar cada vez de nuevo 
    await prisma.user.update({
      where: { id: user.id },
      data: {
        //aqui el id
        telegramId: context.from.id.toString(),
        telegramCode: null,
        codeExpiresAt: null,
      },
    });

    context.reply(
      "¡Cuenta vinculada correctamente! Ahora puedes gestionar tus tareas.",
    );
    menu(context);
  } catch (error) {
    console.error("Error en /code:", error);
    context.reply("Hubo un error interno. Inténtalo de nuevo más tarde.");
  }
});

//comanda menu para llamar al menu
bot.command("menu", async(ctx)=>{

  await menu(ctx)
})


// el menu de nuestro bot
function menu(ctx) {
  const keybord = Markup.inlineKeyboard([
    [Markup.button.callback("📋 Listar Tareas", "list_tasks")],
    [Markup.button.callback("➕ Nueva Tarea", "add_task")],
  ]);

  ctx.reply("¡Hola! Soy PlannixBot. ¿Qué quieres hacer hoy?", keybord);
}


bot.action("menu", async(ctx)=>{
  menu(ctx)
})

// responde al callback de boton del menu
bot.action("list_tasks", async (ctx) => {

  //evita el efecto de la crga en telegram 
  try {
    //con mensaje de listar tareas
    await ctx.answerCbQuery("Listar tareas");
} catch (e) { }


// buscamos el user por id de telegram que hemos asignado al entrar con /code 
  const user = await prisma.user.findFirst({
    where: { telegramId: ctx.from.id.toString() },
  });

  if (!user) {
    ctx.reply("Primero debes vincular tu cuenta con /code");
    return;
  }
// con taskservice manejamos el bbdd
  const tasks = await taskService.getTasks(user.id);

  if (tasks.length === 0) {
    return ctx.reply("📭 No tienes tareas.");
  }

  //sacamos las tareas primero como botones 
  const task_botons= tasks.map((t,index)=>[
    Markup.button.callback(`${formatearFecha(t.deadline)} ${t.title}`,`list_${t.id}`)
  ])

  const kbt= Markup.inlineKeyboard(task_botons)

 await ctx.editMessageText("📋 Lista de tareas, pincha en cualquier tarea para ver sus detalles",{...kbt, parse_mode:"Markdown"})

});

//responde al callback de tarea elegida pide info de una tarea en concreto
bot.action(/^list_(.+)$/, async(ctx)=>{

  try{
    ctx.answerCbQuery(`Tarea elegida`)
    
  }catch(e){}
  

  const user = await prisma.user.findUnique({where:{telegramId: ctx.from.id.toString()}})
  
  if(!user){
    ctx.reply("Primero debes vincular tu cuenta con /code")
    return
  }
  
  const idTask=ctx.match[1] // id de nuestra tarea que viene desde callback de boton list_(id)
  const task= await taskService.getTaskbyId(user.id,idTask)

  const message = `📋 *Tarea:* ${task.title}\n\n` +
  `📝 *Descripción:* ${task.description}\n` +
  `📊 *Status:* ${task.status}\n` +
  `🔥 *Priority:* ${task.priority}\n` +
  `📅 *Deadline:* ${formatearFecha(task.deadline)}`;

  //buton para eliminar este tarea
  const kb= Markup.inlineKeyboard([[Markup.button.callback("Eliminar tarea",`delete_${task.id}`), Markup.button.callback("Menu", `menu`)]])


  ctx.editMessageText(`${message}`,{...kb, parse_mode:"HTML"})
})


//confirmación de eliminar tarea
bot.action(/^delete_(.+)$/, async (ctx) => {
  await ctx.answerCbQuery("Eliminar tarea?");

  const taskId = ctx.match[1];

  const kb = Markup.inlineKeyboard([
    [
      Markup.button.callback("✅ Sí, eliminar", `confirm_delete_${taskId}`),
      Markup.button.callback("❌ Cancelar", `cancel_delete`)
    ]
  ]);
//editamos mensaje 
  await ctx.editMessageText(
    "⚠️ ¿Estás seguro de que quieres eliminar esta tarea?",
    {
      ...kb,
      parse_mode: "Markdown"
    }
  );
});

//confirmado el delete (eliminamos la tarea)
bot.action(/^confirm_delete_(.+)$/, async (ctx) => {
  await ctx.answerCbQuery("Eliminar tarea");

  const user = await prisma.user.findUnique({
    where: { telegramId: ctx.from.id.toString() }
  });

  if (!user) {
    return ctx.reply("Primero debes vincular tu cuenta con /code");

  }

  const taskId = ctx.match[1];

  await taskService.deleteTask(user.id, taskId);

  await ctx.editMessageText("✅ Tarea eliminada correctamente.");
  menu(ctx)
});

//cancel de eliminar tarea
bot.action("cancel_delete", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.editMessageText("❎ Eliminación cancelada.");
  menu(ctx)
});


//añadir tarea con wizard
bot.action("add_task", async (ctx) => {
  ctx.answerCbQuery("Añadir tarea");
//entramos al wizard
  return ctx.scene.enter("CREAR_TASK");
});


//formatear la fecha 
function formatearFecha(fechaISO) {
  if (!fechaISO) return "Sin fecha";
  return new Date(fechaISO).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",   
    minute: "2-digit",
  });
}

module.exports = bot;
