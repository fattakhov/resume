var http = require("http");
var fs = require("fs");
var resume = require("resume-schema").resumeJson;
var res = require('./resume.json');
var theme = require("./index.js");

fs.writeFile('resume.html', theme.render(res));

console.log("Wrote.");

function render() {
	try {
		return theme.render(res);
	} catch(e) {
		console.log("Error: " + e.message);
		return "";
	}
}
