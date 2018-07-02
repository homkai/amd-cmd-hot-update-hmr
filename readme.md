# EHU(esl-hot-update)

- 与默认的web server完美解耦，可以支持http-server、edp webserver start等原来的启动逻辑
- 对esl模块，做热更新加载，极大方便调试！
- 完美兼容edp、edp-webserver，使用方便
- 全面支持支持MVC、Component、monitor、模板文件、LESS等等

# 高级使用

## 安装

> npm install -g ehu（mac下需要sudo，windows下需要管理员权限）

## 配置

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
        "watchDirs": "src",
        // 入口文件（不包括baseDir）
        "indexHTML": "main.html",
        // ehu启动端口号（不可与默认的服务器端口号冲突）
        "port": 8844
    }
```

## 启动

> cd yourProjectDir

> ehu [-p(--port)]

> 访问新的地址 http://127.0.0.1:8844（默认端口号8844）

*特别说明：启动ehu后，原来的服务完全不受影响，如原来是8848端口，现在仍旧可以正常访问。*

### 手动启动默认web server

> cd yourProjectDir

> edp webserver start

> ehu -n(--noServerCLI)

或者先配置defaultServerCLI为""

> ehu

# FAQ

1、web server挂掉如何解决？

- 先按原来的方式启动默认web server，如edp webserver start
- 再在启动web server的路径，重开一个命令行窗口启动ehu，并加参数-n，即ehu -n
