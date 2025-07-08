import express, { json } from 'express'
import morgan from 'morgan';
import authRoute from './routes/auth.route.js';
import userRoute from './routes/user.route.js';
import dotenv from 'dotenv'

dotenv.config()

const app = express();

app.use(express.json())
app.use(morgan('dev'));


app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)
app.use("/api/flashcards", (req, res)=>{
  res.send("FLASHCARD")
})



const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server is running on  http://localhost:${PORT}`));