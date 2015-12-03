/**
 * @file component注册中心，提供注册和验证
 *
 * @author Leo Wang(wangkemiao@baidu.com)
 */

define(function (require) {
    var _ = require('underscore');
    var fc = require('fc-core');
    var config = require('./config');

    /**
     * 私有化已注册的Components
     */
    var registered = {};

    /**
     * component注册中心，提供注册和验证
     */
    var registry = {
        /**
         * 注册处理
         * @param {HtmlElement} target DOM节点或者HTML片段
         */
        register: function (target) {
            fc.assert.has(target, '注册Component必须指定target！');

            fc.assert.has(target.getAttribute,
                '注册component实用的target必须是DOM！');

            var nodeName = target.nodeName;
            fc.assert.equals(
                nodeName === config.ELEMENT_MARK.toUpperCase(),
                true,
                '注册component实用的target必须是正确的注册DOM！'
            );

            var name = target.getAttribute('name');  // new nodeName
            fc.assert.has(name, '注册Component使用的target必须声明name属性！');

            var path = name.replace(/-/g, '/');
            if (registered[name]
                // [esl-hot-update] 重新加载需要覆盖
                && !(window.EHU_HOT_UPDATE_OPTIONS && window.EHU_HOT_UPDATE_OPTIONS.component.isOverride)) {
                // 如果已经注册了怎么办？
                if (config.MULTI_REGISTER === 'ignore') {
                    // 忽略本次注册
                    return;
                }
                else if (config.MULTI_REGISTER === 'throw') {
                    // 抛出一个异常
                    throw new Error('尝试注册Component时发生了错误，Component：'
                        + name + '已经被注册！');
                }
                // 否则覆盖
            }
            var registryData = {
                name: name,
                path: path,
                template: target.querySelector('template').innerHTML,
                action: target.getAttribute('action')
            };

            document.createElement(name);

            registryData.renderer = fc.tpl.compile(
                registryData.template
            );

            registered[name] = registryData;
        },

        registerFromHtml: function (html) {
            var newDom = document.createElement('div');
            newDom.innerHTML = html;

            var toRegister = newDom.querySelectorAll(config.ELEMENT_MARK);
            _.each(toRegister, function (item) {
                registry.register(item);
            });

            newDom.innerHTML = '';
            newDom = null;
        },

        /**
         * 获取某个注册了的component的信息
         * @param {string} name component的名字
         * @return {Component}
         */
        getComponent: function (name) {
            return registered[name];
        },

        /**
         * 获取注册了的所有语义化标签
         * @return {Array.<string>} 注册了的所有语义化标签
         */
        getRegisteredNames: function () {
            return _.keys(registered);
        }
    };

    return registry;
});
