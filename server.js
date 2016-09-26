var http = require("http");
var fs = require("fs");
var resume = require("resume-schema").resumeJson;
var res = require('./resume.json');
var theme = require("./index.js");

http.createServer(function(req, res) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(render());
}).listen(process.env.PORT || 5000);

function render() {
    try {
        return theme.render(res);
    } catch (e) {
        console.log("Error: " + e.message);
        return "";
    }
}
