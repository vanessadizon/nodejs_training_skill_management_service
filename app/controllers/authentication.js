const express = require('express')
const app = express()

app.use(express.json());
const users = [];

app.get('/api-docs/users', (req, res) => {
    res.json(users);
})

app.post('/api-docs/users', (req, res) => {
    const user = { 
        user: req.body.username,
        password: req.body.password
    }
    user.push(user)
    res.status(201).send()
})

app.listen(3001);