const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3500; // port express serwer

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

