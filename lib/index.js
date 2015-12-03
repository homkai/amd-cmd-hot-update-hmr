var _ = require('lodash');
var fs = require("fs");
var core = require('./core');
var path = require('path');
var router = require('./router');

var CONFIG_FILE = 'ehu.config';

var config = {};

function setConfig(options) {
    _.extend(config, options);
}

function initConfig() {
    var defaultConfig = require('./config');
    var cwd = process.cwd();
    var configPath = path.resolve(cwd.replace(defaultConfig.baseDir, ''), CONFIG_FILE);
    var data = fs.existsSync(configPath) && fs.readFileSync(configPath, "utf-8");
    var userConfig = (data && JSON.parse(data)) || {};
    var conf = _.extend({}, defaultConfig, userConfig);
    conf.cwd = cwd.replace(conf.baseDir, '');
    conf.cwdBaseDir = path.resolve(conf.cwd, conf.baseDir);
    setConfig(conf);
}

function init(conf) {
    initConfig();
    setConfig(conf);
    var app = core.init(config);
    router.init(app, config);
}

module.exports = {
    config: setConfig,
    init: init
};