const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;

const users = [
    {
        email: "user1@example.com",
        password: "user1"
    },
    {
        email: "user2@example.com",
        password: "user2"
    },
    {
        email: "user3@example.com",
        password: "user3"
    }
];

app.use(bodyParser.json());

function verifyUser(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) return res.status(401).send('Token is required');

    try {
        const user = jwt.verify(token, 'secret123');

        if (user) {
            req.user = user;
            return next();
        }
    } catch (error) {
        return res.status(401).send(error);
    }
}

app.get(
    '/protected',
    verifyUser,
    (req, res) => {
        const user = req.user;
        return res.json(user);
    }
);

app.post(
    '/login',
    (req, res) => {
        const { email, password } = req.body;

        if (!email && !password) return res.status(504).send('Missing required fields');

        const user = users.find(u => u.email === email && u.password === password);
        if (!user) {
            return res.status(404).send('User does not exsit');
        }

        const token = jwt.sign({ email }, 'secret123');
        return res.send(token);
    }
)


app.listen(port, () => console.log(`App listening on port ${port}`))