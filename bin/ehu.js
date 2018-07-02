#!/usr/bin/env node
'use strict';
var program = require('commander');
var hopUpdate = require('../lib/index');

var config = {};

function setPort(num) {
    config.port = num;
}

function noServerCLI() {
    config.defaultServerCLI = '';
}

// 命令行参数支持
program
    .version('0.0.8')
    .usage('[options]')
    .option('-p, --port <n>', 'Set the port(diffrent from edb-webserver) to start server', setPort)
    .option('-n, --noServerCLI', 'Not set the defaultServerCLI. Start default web server manually', noServerCLI)
    .parse(process.argv);


hopUpdate.init(config);