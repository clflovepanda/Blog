var app = require("../express");

app.post("/blog/addBlog", function (request, response) {
    console.log(request.body);
    response.writeHead(200);
    response.end("ok");
});