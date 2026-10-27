// app.js start and creating a port for listening

// require app.js file as constant "app"
const app = require('./app');

const PORT = process.env.PORT || 3500; // port express serwer

// starting the server listening on PORT
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));