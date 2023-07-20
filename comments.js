// Create web server
// Run: node comments.js
// View: http://localhost:3000

const express = require('express');
const app = express();
const port = 3000;

// Set up handlebars view engine
const handlebars = require('express-handlebars')
    .create({defaultLayout:'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// Use body-parser to handle POST requests
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set up the database
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/comments');

// Define a model
const Comment = mongoose.model('Comment', {
    name: String,
    comment: String
});

// Set up the routes
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/comments', (req, res) => {
    Comment.find((err, comments) => {
        if (err) {
            res.render('error', {message: 'Error retrieving comments'});
        } else {
            res.render('comments', {comments: comments});
        }
    });
});

app.post('/comments', (req, res) => {
    const comment = new Comment({
        name: req.body.name,
        comment: req.body.comment
    });
    comment.save((err) => {
        if (err) {
            res.render('error', {message: 'Error adding comment'});
        } else {
            res.redirect('/comments');
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Express started on http://localhost:${port}`);
});