const app = require('./server.js');
const port = 8002;
app.listen(port, () => {
    console.log(`CovidScreeningApp running on port ${port}`)
});