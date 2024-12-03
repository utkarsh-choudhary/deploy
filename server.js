import app from './app.js';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';  


const PORT = process.env.PORT || 9000;

app.listen(PORT, () => 
    console.log(`Server running on port ${PORT}`)
);


app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));
