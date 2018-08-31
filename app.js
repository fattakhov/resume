const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, 'build')));
app.use(express.static(path.join(__dirname, '/')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build/index.html'));
});
app.get('/resume.pdf', (req, res) => {
    res.sendFile(path.join(__dirname, 'build/pdf.pdf'));
})
app.listen(port, () => console.log('Resune listening on port ' + port));