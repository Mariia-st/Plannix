const express = require("express");
const {PrismaClient}=require('@prisma/client');

const prisma = new PrismaClient();

const app = express();

const PORT = 3000;

app.get('/',(req,res)=>{
    res.send('Servidor funciona')
})

app.listen(PORT,()=>{
    console.log(`Servidor funciona en https://localhost${PORT}`)
})