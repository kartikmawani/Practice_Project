import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import {router} from './Router/router.ts'
const app=express();
app.use(express.json());
app.use(cors())
app.use('/api',router);
const PORT=4000;
app.listen(PORT,()=>{
        console.log(`Server is running on ${PORT}`);
})