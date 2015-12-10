/**
 * @file EHU S端核心文件
 * @author Homkai Wong(wanghongkai@baidu.com)
 */
var express = require('express');
var watch = require('watch');
var path = require('path');
var async = require('async');

var SUPPORT_RE = /\.(js|html|tpl|css|less)$/;

var config = {};
var io = {};

/**
 * 是否支持hot update
 *
 * @param file
 * @returns {boolean}
 */
function isSupport(file) {
    return SUPPORT_RE.test(file);
}

/**
 * 启动监视文件
 */
function initWatch() {
    var fullDirs = [];
    var watchDirs = Array.isArray(config.watchDirs) ? config.watchDirs : config.watchDirs.split(',');
    watchDirs.forEach(function (item) {
        fullDirs.push(path.resolve(config.cwdBaseDir , item));
    });
    fullDirs.forEach(function (item) {
        watch.createMonitor(item.trim(), function (monitor) {
            setMonitor(monitor);
        });
    });
}

/**
 * 监视文件自服务
 *
 * @param monitor
 */
function setMonitor(monitor) {
    monitor.files['.zshrc'];
    monitor.on('changed', function (file, curr, prev) {
        if (!isSupport(file)) {
            return;
        }
        console.log(getLogMsgPrefix(), 'File changed:' + file);
        file = file.replace(config.cwdBaseDir, '').replace(/\\/g, '/').replace(/^\/(.*)/, '$1');
        io.emit('hotUpdate', file);
    });
}

var isServerStarted = false;

/**
 * 启动默认web server
 *
 * @param {string} defaultServerCLI 启动命令
 * @param {Function} cb 启动成功的callback
 */
function bootDefaultServer(defaultServerCLI, cb) {
    var child = require('child_process').spawn('/bin/sh', ['-c', defaultServerCLI], {
        cwd: null,
        env: null,
        windowsVerbatimArguments: false
    });
    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', function (log) {
        !isServerStarted && (cb(null, log));
        isServerStarted && console.log(log);
    });
    child.stdout.on('exit', function (err) {
        console.error(err);
    });
    child.on('error', function (err) {
        console.error(err);
    });
}

/**
 * 日志信息统一前缀
 *
 * @returns {string}
 */
function getLogMsgPrefix() {
    return '[EHU] ' + (new Date()).toLocaleString() + ' ';
}
/**
 * 初始化
 *
 * @param {Object} conf 参见lib/config
 * @returns {Object} app express的app
 */
exports.init = function (conf) {
    console.log(getLogMsgPrefix(), 'Waiting!');
    config = conf;
    var app = express();
    app.use(express.static(path.resolve(__dirname, '../public')));
    var server = require('http').createServer(app);
    // 启动socket.io服务
    io = require('socket.io')(server);
    io.on('connection', function (socket) {
        socket.emit('hello');
    });
    // 监视文件改动
    initWatch();
    // 启动web server
    async.series([function (done) {
        // 启动默认服务器
        config.defaultServerCLI ? bootDefaultServer(config.defaultServerCLI, done)
            : done(null, 'Please start your default web server manually!');
    }, function (done) {
        // 启动EHU务器
        server.listen(config.port, function () {
            done(null, '');
        });
    }], function (err, result) {
        isServerStarted = true;
        console.log(result[0]);
        var msg = [
            '======================\n',
            '[EHU] Server started at http://127.0.0.1:%d\n',
            '[EHU] Enjoy it!\n',
            '======================\n'
        ].join('');
        console.log(msg, config.port);
    });
    return app;
};

