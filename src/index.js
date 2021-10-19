const app = require('./server.js');
const cronmail = require('./cronmail');
const port = 8000;
app.listen(port, () => {
    console.log(`CovidScreeningApp running on port ${port}`)
    cronmail();
});