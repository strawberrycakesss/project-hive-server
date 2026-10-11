import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import api from './routes/api.js';
import {logger,notFound,errorHandler} from './middleware/index.js';
dotenv.config({path:fileURLToPath(new URL('.env',import.meta.url))});
const app=express();
app.use(cors({origin:process.env.CLIENT_URL||'http://localhost:5173'}));
app.use(express.json());
app.use(logger);
app.get('/',(req,res)=>res.json({message:'Project Hive API',health:'/api/health'}));
app.get('/api/health',(req,res)=>{const connected=mongoose.connection.readyState===1;res.status(connected?200:503).json({status:connected?'ok':'unavailable',database:connected?'connected':'disconnected'});});
app.use(api);
app.use(notFound);
app.use(errorHandler);
const port=process.env.PORT||5000;
const mongoUri=process.env.MONGO_URI||process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('MongoDB connection string is missing. Check MONGO_URI or MONGODB_URI in your .env file.');
  process.exit(1);
}
mongoose.connect(mongoUri).then(()=>app.listen(port,()=>console.log(`API running on http://localhost:${port}`))).catch(err=>{console.error('MongoDB connection failed',err);process.exit(1)});
