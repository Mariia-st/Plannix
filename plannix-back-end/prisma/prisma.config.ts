import { defineConfig } from 'prisma/config';
//Archivo de configuración con prisma 
//conecta a nuestra bbdd usando variable de entorno 
export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});