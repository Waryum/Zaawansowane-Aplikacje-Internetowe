const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3500; // port express serwer

// https method
app.get('/', (req, res) => {
    res.send('Hello World!');
});

//uruchomienie nasluchu serwera
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));

