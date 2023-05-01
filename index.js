// Libraries
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

// Local routes, vars and utils
import usersRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';
import { USER, PASSWORD, DBNAME } from './config/config.js';

const app = express();
const PORT = 6660;
export const DB = `mongodb+srv://${USER}:${PASSWORD}@${DBNAME}.hv1gxxc.mongodb.net/?retryWrites=true&w=majority`;

//APP lvl setting
app.use(bodyParser.json());
app.use("/users", usersRoutes);
app.use('/user', authRoutes);

app.get("/", (req, res) => {
    res.send("HomePage");
});

//PORT lvl setting
app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`));

//DB lvl setting
console.log(DB);
mongoose.connect(DB,
    { useNewUrlParser: true, useUnifiedTopology: true }
)
    .then(() => console.log('Connected to DB.'))
    .catch(e => console.log('Error in DB connection:', e));