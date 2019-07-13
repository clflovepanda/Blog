var app = require("../express");
var url = require("url");
var blogDao = require("../dao/BlogDao");
var tagsDao = require("../dao/TagsDao");
var blogTagsMappingDao = require("../dao/BlogTagsMappingDao");
var timeUtil = require("../util/TimeUtil");
var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: true });
var jsonParser = bodyParser.json();

app.post("/blog/addBlog", jsonParser, function (request, response) {
    console.log(request.body);
    blogDao.insertBlog(request.body.title, request.body.author, request.body.content, 0, timeUtil.getNow(), function (blogResult) {
        let tags = request.body.tags.split(",");
        for (let i = 0 ; i < tags.length ; i ++) {
            tagsDao.queryTags(tags[i], function (tagsResult) {
               if (tagsResult.length > 0) {//有这个标签，
                    blogTagsMappingDao.insertBlogTagsMapping(blogResult.insertId, tagsResult[0].id, function (result) {});
               } else {//没有这个标签，创建标签
                    tagsDao.insertTags(tags[i], function (newTagsResult) {
                        blogTagsMappingDao.insertBlogTagsMapping(blogResult.insertId, newTagsResult.insertId, function (result) {});
                    });
               }
            });
        }
        response.writeHead(200);
        response.end(JSON.stringify({status: 1, msg: "ok"}));
    });
});

app.get("/getHotBlog", function (request, response) {
    blogDao.queryBlogByViews(function (result) {
       response.writeHead(200);
       response.end(JSON.stringify(result));
    });
});