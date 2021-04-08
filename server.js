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

const jwt = require('jsonwebtoken');

// The port of communication with the application:
var port = (process.env.APP_PORT || config.port);
app.set('port', port);

// Listen on provided port, on all network interfaces.
app.listen(port, () => {
    logger.getLogger('system').info('API running on localhost:' + port);
});

// const posts = [
//     {
//         username: 'Kyle',
//         title: 'post 1'
//     },
//     {
//         username: 'Jill',
//         title: 'post 2'
//     }
// ]

// app.get('/posts', authenticateToken, (req,res) => {
//     posts.filter(post => post.username === req.user.name)
// })

app.get('/login', authenticateToken, (req,res) => {
    //Authenticate User
    const username = req.body.username
    const user = {name : username}
    const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET)
    res.json({ accessToken: accessToken})
})

function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null){
        return res.sendStatus(401)
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err){
            return res.sendStatus(403)
        }
        req.user = user
        next()
    })
}

module.exports = app;