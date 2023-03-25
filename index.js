// Libraries
import express from 'express';
import bodyParser from 'body-parser';
import CryptoJS from 'crypto-js';
// Routes and utils
import usersRoutes from './routes/users.js';
// Vars and Cons
const app = express();
const PORT = 6660;
// TODO - add hashing for passwords
app.use(bodyParser.json());

app.use("/users", usersRoutes);

app.get("/", (req, res) => {
    res.send("HomePage")
});

app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`));