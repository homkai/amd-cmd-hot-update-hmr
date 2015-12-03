/**
 * @file EHU S端路由
 * @author Homkai Wong(wanghongkai@baidu.com)
 */
var express = require('express');
var path = require('path');
var httpProxy = require('express-http-proxy');
var URL = require('url');
var fs = require('fs');

var config = {};
/**
 * 注入的JS
 *
 * @type {string[]}
 */
var INJECT_JS_LIST = ['socket.io.js', 'esl-ehu.js', 'hot-update.js'];

/**
 * 路由规则
 *
 * @type {Array}
 */
var ruleList = [];

/**
 * 生成路由规则
 *
 * @returns {*[]}
 */
function getRuleList() {
    var list =  [{
        reg: new RegExp('/' + config.indexHTML.replace('.', '\\.')),
        fn: getIndexHTML
    },{
        reg: /dep\/etpl\/[^\/]*\/src\/main\.js/,
        file: 'etpl/src/main.js'
    },{
        reg: /dep\/fc-component-ria\/[^\/]*\/src\/registry\.js/,
        file: 'fc-component-ria/src/registry.js'
    }];
    return list;
}

/**
 * 修改入口文件，将ESL的位置，注入INJECT_JS_LIST
 *
 * @param req
 * @param res
 */
function getIndexHTML(req, res){
    var indexHTML = path.resolve(config.cwdBaseDir, config.indexHTML);
    var content = fs.readFileSync(indexHTML) + '';
    var inject = [];
    INJECT_JS_LIST.forEach(function (item) {
        inject.push( '<script src="/' + item + '"></script>');
    });
    content = content.replace(/<script.*?src=".*\/esl\.js".*?><\/script>/, inject.join(''));
    res.send(content);
}

/**
 * 按规则路由转发
 *
 * @param req
 * @param res
 * @returns {boolean}
 */
function ruleRoute(req, res) {
    var isMatch = false;
    ruleList.forEach(function (item) {
        if (isMatch) {
            return;
        }
        if(item.reg.test(req.url)) {
            if (item.file) {
                // 重定向到public文件夹
                res.redirect('/' + item.file);
            }
            if (item.fn) {
                item.fn(req, res);
            }
            isMatch = true;
        }
    });
    return isMatch;
}

/**
 * 初始化
 *
 * @param app
 * @param conf
 */
exports.init = function(app, conf) {
    config = conf;
    ruleList = getRuleList();
    var mid = express();
    mid.all('*', httpProxy(config.defaultServer, {
        // 先走特殊规则，否则就代理到默认web server
        filter: function(req, res) {
            return !ruleRoute(req, res);
        },
        forwardPath: function(req, res) {
            return URL.parse(req.url).path;
        }
    }));
    // 由express-http-proxy托管路由
    app.use('/', mid);
};