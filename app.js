const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3500; // port express serwer

// everything works in waterfall --> chained

// built-in middleware to handle urlencoded data, i.e. form data
app.use(express.urlencoded({extended: false}));

// built-in middleware for json:
app.use(express.json());

// built-in middleware for static files:
app.use(express.static(path.join(__dirname, '/public')));

// middleware setting header to application/json
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
})


// https method
app.get('/api/health', (req, res) => {
    //res.send('Hello World!');
    res.status(200).json({string: 'ok'});
});

//uruchomienie nasluchu serwera
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));

