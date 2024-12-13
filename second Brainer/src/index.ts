import express from 'express';
import connectDb from './db/config';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();

//routes import
import userRoutes from './routes/userRoutes';
import contentRoutes from './routes/contentRoutes';
import linkRoutes from './routes/linkRoutes';
import tagRoutes from './routes/TagRoutes';

//middlewares
app.use(express.json());
app.use(cors({
    origin:['http://localhost:5173'],
    credentials:true
}));
app.use('/api/v1/users',userRoutes);
app.use('/api/v1/content',contentRoutes);
app.use('/api/v1/link',linkRoutes);
app.use('/api/v1/tag',tagRoutes);

const PORT = process.env.PORT || 3000;

//connect to db
connectDb();

//connect to server
app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`);
});