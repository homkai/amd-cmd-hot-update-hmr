/**
 * @file EHU B端核心文件
 * @author Homkai Wong(wanghongkai@baidu.com)
 */

/**
 * document ready
 *
 * @param callback
 */
function docReady(callback){
    var readyRE = /complete|loaded|interactive/;
    readyRE.test(document.readyState) && document.body ? callback()
        : document.addEventListener('DOMContentLoaded', callback, false);
}

docReady(function () {
    /**
     * 配置文件
     *
     * @type {{styleTypeList: string[], tplTypeList: string[], componentType: string, updateLimit: number,
      * etpl: {isOverride: boolean}, component: {isOverride: boolean}}}
     */
    var options = window.EHU_HOT_UPDATE_OPTIONS = {
        styleTypeList: ['css', 'less'],
        tplTypeList: ['tpl', 'etpl', 'etpl/tpl'],
        componentType: 'fc-component-ria/component',
        updateLimit: 100,
        etpl: {
            isOverride: false
        },
        component: {
            isOverride: false
        }
    };

    var socket = io('http://127.0.0.1:8844');

    function log() {
        if(!window.console) return;
        return console.log.apply(console, arguments);
    }

    /**
     * 判断资源类型
     *
     * @param moduleId
     * @param cmp
     * @returns {*|boolean}
     */
    function isRes(moduleId, cmp) {
        var arr = moduleId.split('!');
        !Array.isArray(cmp) && (cmp = [cmp]);
        return arr[1] && cmp.indexOf(arr[0]) > -1;
    }

    /**
     * 热更新实现方法
     *
     * @param moduleId
     * @param round
     * @param cb
     * @returns {*}
     */
    function hotUpdate(moduleId, round, cb) {
        var host = [];
        round = round || 0;
        // 判断module是否加载
        if (!moduleId || !window.EHU_MOD_MODULES[moduleId]) {
            return false;
        }
        // 删除ESL缓存
        delete window.EHU_MOD_MODULES[moduleId];
        delete window.EHU_LOADING_MODULES[moduleId];
        window.EHU_REQUIRED_CACHE.forEach(function (item, index) {
            item[moduleId] && (delete window.EHU_REQUIRED_CACHE[index][moduleId]);
        });
        // 递归删除ESL依赖宿主缓存
        round--;
        if (round > -1 && window.EHU_DEP_MODULES[moduleId]) {
            window.EHU_DEP_MODULES[moduleId].forEach(function (item) {
                host.push(item);
                var ret = hotUpdate(item, round, cb);
                ret && (host = host.concat(ret));
            });
        }
        // 重新加载最外层宿主module
        else {
            window.require([moduleId], cb);
        }
        return host;
    }

    /**
     * 日志信息统一前缀
     *
     * @returns {string}
     */
    function getLogMsgPrefix() {
        return '[EHU] ' + (new Date()).toLocaleString() + ' ';
    }
    
    function init() {
        // 建立连接
        socket.on('hello', function () {
            log(getLogMsgPrefix(), 'HotUpdate已启动！');
        });
        // 检测到文件改动
        socket.on('hotUpdate', function (file) {
            // log(getLogMsgPrefix(), '检测到文件改动', file);
            var moduleId = window.EHU_URL_MODULE_ID_MAP[file];
            if (!moduleId) {
                return;
            }
            var updateLimit = options.updateLimit;
            var cb = function () {};
            // 样式
            if (isRes(moduleId, options.styleTypeList)) {
                updateLimit = 0;
            }
            // 模板
            if (isRes(moduleId, options.tplTypeList)) {
                updateLimit = 1;
                options.etpl.isOverride = true;
                cb = function () {
                    options.etpl.isOverride = false;
                };
            }
            // Component
            if (isRes(moduleId, options.componentType)) {
                updateLimit = 1;
                options.component.isOverride = true;
                cb = function () {
                    options.component.isOverride = false;
                };
            }
            var msg = '';
            var ret = hotUpdate(moduleId, updateLimit, cb);
            if (ret) {
                msg = [
                    getLogMsgPrefix(),
                    '检测到ESL Module改动：',
                    '`' + file + '`',
                    ' 已重新加载该文件及其宿主文件'
                ].join('');
                log(msg, ret);
            }
        });
    }
    
    init();
});
	