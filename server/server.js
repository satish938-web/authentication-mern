import express from 'express'
import cors from 'cors'
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import { mongoDB } from './config/mongodb.js';
import { authrouter } from './routes/authroutes.js';
import userRouter from './routes/userRoutes.js';

mongoDB();
const app = express();
const port = process.env.PORT||4000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173", // FRONTEND URL
    credentials: true
  }));
app.use('/api/auth',authrouter)
app.use('/api/user',userRouter)

app.get("/",(req,res)=>{
    res.send("working..")
})

app.listen(port,()=>{
console.log(`server is runing at ${port}`);
})
