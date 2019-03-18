const express = require('express');
const app = express();

const PORT = 3001;

app.all('*', (req, res) => {
    console.log(PORT);
    res.send(`<h1>${req.path}</h1>`);
})

app.listen(PORT, () => {
    console.log(`Server started ${PORT}.`);
})