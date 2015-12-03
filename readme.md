# EHU(esl-hot-update)

- esl-hot-update
- 对esl模块，做热更新加载，极大方便调试！
- 完美兼容edp、edp-webserver，使用方便

# 安装

> npm install ehu -g
> cd yourProjectDir
> cd ehu [-port][-noServerCLI]

# 配置

- yourProjectDir/ehu.config（JSON格式）
- 配置参考
```js
    {
        // 默认的web server地址
        "defaultServer": "http://127.0.0.1:8848",
        // 默认的web server启动命令
        "defaultServerCLI": "edp webserver start",
        // 从服务器根目录到需要监控的文件夹中间path
        "baseDir": "nirvana-workspace",
        // hot update 需要watch的文件夹（不包括baseDir）
        "watchDirs": "src,dep",
        // 入口文件（不包括baseDir）
        "indexHTML": "main.html",
        // ehu启动端口号（不可与默认的服务器端口号冲突）
        "port": 8844
    }
```