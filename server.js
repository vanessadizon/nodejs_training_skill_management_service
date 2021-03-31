'use strict';
require('dotenv').config();

// Import library
const path = require('path');
const logger = require(path.resolve('middleware/logging/logger'));

// Set the 'NODE_ENV' variable
process.env.NODE_ENV = process.env.NODE_ENV || 'local-dev';
//process.env.NODE_ENV = 'production';
//process.env.NODE_ENV = 'development';
//process.env.NODE_ENV = 'test';

// Load the module dependencies
const configureExpress = require(path.resolve('middleware/express/express'));
const config = require(path.resolve('middleware/config/config'));
// Create a new Express application instance
const app = configureExpress();

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.use(express.json());

const users = []
const posts = [
    {
        userName: 'Ivan',
        title: 'Post 1'
    },
    {
        userName: 'Ed',
        title: 'Post 2'
    }
]

app.get('/users', authenticateToken, (req, res) => {
    res.json(posts.filter(post => post.userName === req.users.name));
})

app.post('/users', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const user = {
            name: req.body.name,
            password: hashedPassword
        }
        users.push(user);
        res.status(200).send('Success adding user.');
    } catch {
        res.status(500).send('System error.');
    }
});

app.post('/users/login', async (req, res) => {
    const user = users.find(user => user.name === req.body.name);
    if (user == null) {
        return res.status(401).send('Cannot find user.');
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
            res.json({accessToken: accessToken});
            //res.status(200).send('Success');
        } else {
            res.status(403).send('Not allowed.')
        }
    } catch {
        res.status(500).send('System error.');
    }
})

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, users) => {
        if(err) return res.sendStatus(403);
        req.users = users;
        next();
    })
}

// The port of communication with the application:
var port = (process.env.APP_PORT || config.port);
app.set('port', port);

// Listen on provided port, on all network interfaces.
app.listen(port, () => {
    logger.getLogger('system').info('API running on localhost:' + port);
});

module.exports = app;