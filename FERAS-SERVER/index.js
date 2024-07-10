import express from 'express'
import db from './config/Database.js';
import router from './routes/route.js';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bonjour from 'bonjour';
dotenv.config()
const app = express()

try {
    await db.authenticate()
    console.log('Connection has been established successfully.')
} catch (error) {
    console.error(error)
}

app.use(cors({credentials:true, origin: true}))
app.use(cookieParser())
app.use(express.json())
app.use(router)

app.listen(8000, '0.0.0.0', () => {
    console.log('Server is running on http://localhost:8000')
})