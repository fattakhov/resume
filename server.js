var http = require("http");
var fs = require("fs");
var resume = require("resume-schema").resumeJson;
var res = require('./resume.json');
var theme = require("./index.js");

fs.writeFile('resume.html', theme.render(res));

var port = 8080;
http.createServer(function(req, res) {
	res.writeHead(200, {"Content-Type": "text/html"});
	res.end(render());
}).listen(port);

console.log("Serving theme");
console.log("Preview: http://localhost:8080/");

function render() {
	try {
		return theme.render(res);
	} catch(e) {
		console.log("Error: " + e.message);
		return "";
	}
}
