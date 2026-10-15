const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3500; // port express serwer

// everything works in waterfall --> chained

// built-in middleware to handle urlencoded data, i.e. form data
app.use(express.urlencoded({extended: false}));

// built-in middleware for json:
app.use(express.json());

//built-in middleware for static files:
app.use(express.static(path.join(__dirname, '/public')));


// https method
app.get(/^\/(?:index(?:\.html)?)?$/, (req, res) => {
    //res.send('Hello World!');
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/new-page.html', (req, res) => {
    res.send('Hello World!');
    // res.sendFile(path.join(__dirname, 'views', 'new-page.html'));
});

//uruchomienie nasluchu serwera
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));

