const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'ABCDE';

app.use(bodyParser.json());

// Mock user for demonstration purpose
const mockUser = {
    id: 1,
    username: 'sanket',
    password: 'Pass'
};

// Login route to authenticate user and issue JWT token
app.post('/login', (req, res) => {
    const {username, password} = req.body;
    if(username === mockUser.username && password === mockUser.password) {
        const token = jwt.sign({ userId: mockUser.id, username: mockUser.username }, SECRET_KEY, { expiresIn: '1h'});
        res.json({token});
    } else {
        res.status(401).json({ msg: 'Invalid Credentials'});
    }
});


// Middleware to protect routes
const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if(token) {
        jwt.verify(token, SECRET_KEY, (err, user) => {
            if(err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};


// Protected route
app.get('/api', authenticateJWT, (req, res) => {
    res.json({ msg: "This is a protected route ", user: req.user})
})


app.listen(PORT, () => {
    console.log(`your server is  up on http://localhost:${PORT}`);
})

