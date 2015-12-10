/**
 * @file EHU默认配置文件
 * @author Homkai Wong(wanghongkai@baidu.com)
 */
module.exports = {
    // 默认的服务器
    defaultServer: 'http://127.0.0.1:8848',
    // 默认的服务器启动命令
    defaultServerCLI: 'edp webserver start',
    // 从服务器根目录到需要监控的文件夹中间path
    baseDir: 'nirvana-workspace',
    // hot update 需要watch的文件夹（不包括baseDir）
    watchDirs: 'src',
    // 入口文件（不包括baseDir）
    indexHTML: 'main.html',
    // ehu启动端口号（不可与默认的服务器端口号冲突）
    port: 8844
};