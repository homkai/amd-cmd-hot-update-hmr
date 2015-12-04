# EHU(esl-hot-update)

- esl-hot-update
- 对esl模块，做热更新加载，极大方便调试！
- 完美兼容edp、edp-webserver，使用方便
- 全面支持支持MVC、Component、monitor、模板文件、LESS等等

## 快速使用（FCFE同学参考）
* /nirvana-workspace *

> npm install -g ehu（mac下需要sudo，windows下需要管理员权限）

> 在原来执行edp webserver start命令的路径 执行 ehu（不再需要执行 edp webserver start）

> 原来端口号8848修改为8844（原8848依旧可以使用，但不支持热更新）

* /chunhua-workspace及其他项目 参考配置 *


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
        "watchDirs": "src,dep",
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