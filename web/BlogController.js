var app = require("../express");
var multiparty = require("multiparty");
var url = require("url");
var blogDao = require("../dao/BlogDao");
var tagsDao = require("../dao/TagsDao");
var blogTagsMappingDao = require("../dao/BlogTagsMappingDao");
var timeUtil = require("../util/TimeUtil");

app.get("/blog/addBlog", function (request, response) {
    var params = url.parse(request.url, true).query;
    console.log(params);
    blogDao.insertBlog(params.title, params.author, params.content, 0, timeUtil.getNow(), function (blogResult) {
        let tags = params.tags.split(",");
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
        response.end("ok");
    });
});