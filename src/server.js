import express from 'express'
import morgan from 'morgan';
import dotenv from 'dotenv'
import authRoute from './routes/auth.route.js';
import userRoute from './routes/user.route.js';
import tagRoute from "./routes/tag.route.js";
import flashcardRoute from './routes/flashcard.route.js';
import deckRoute from './routes/deck.route.js';
import adminRoute from './routes/admin.route.js';
import './utils/deckSoftDeleteCleanup.js'
import globalError from './utils/globalError.js';
import notFound from './utils/notFound.js';
import cors from 'cors';

dotenv.config()

const app = express();

app.use(cors());
app.use(express.json())
app.use(morgan('dev'));

app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)
app.use("/api/flashcards", flashcardRoute)
app.use("/api/tags", tagRoute);
app.use("/api/decks", deckRoute);
app.use('/api/admin', adminRoute);


app.use(globalError)
app.use(notFound)


const PORT = process.env.PORT || 8899;

app.listen(PORT, () => console.log(`Server is running on  http://localhost:${PORT}`));