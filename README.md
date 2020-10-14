## 安装 node.js
官网：http://nodejs.cn/
## 配置好环境变量
bin 目录
## 在项目根目录输入如下命令，安装依赖（时间略长）
```
npm install
```
## 命令
所有的命令都在 package.json 中
```
"scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "deploy:dev": "npm run build && cross-env NODE_ENV=dev node ./deploy",
    "deploy:prod": "npm run build && cross-env NODE_ENV=prod node ./deploy"
  },
```
用法：npm run <目标>，对应上面的

如：
```
npm run serve
npm run build
npm deploy:dev
npm deploy:prod
```

## 一般用法
本地启动前端服务器，npm run serve

本地打包成静态资源（index.html CSS JS 什么的），npm run build

部署到服务器，需要配置 /deploy/index.js ，npm deploy:dev

## 部署服务器脚本 /deploy/index.js
下面两个 js 对象的 key - value，都改成一样的，防止出错。

主要改一下 hostname（ip），port 应该是 FTP 端口

username 和 password 登陆服务器密码

path 是 Nginx 部署路径，根据公司的改

```javascript
const SERVER_LIST = {
    'development': {
        hostname: '112.124.1.100',// ip
        port: 22,// 端口
        username: 'root', // 登录服务器的账号
        password: 'xxx',// 登录服务器的账号
        path: '/opt/www'// 发布至静态服务器的项目路径
    },
    'production': {
        hostname: '112.124.1.100',// ip
        port: 22,// 端口
        username: 'root', // 登录服务器的账号
        password: 'xxx',// 登录服务器的账号
        path: '/opt/www'// 发布至静态服务器的项目路径
    },
};
```

## 如何修改转流的 WebSocket
找到 /src/App.vue，（Find）查找这一行，把IP和端口改了
```javascript
url: `ws://localhost:8888/rtsp/${item.id}/?url=${item.rtsp}`
```
## 如何修改中间视频流检测的 WebSocket
找到 /src/App.vue，（Find）查找这一行，把IP和端口改了
```javascript
this.websocket = new WebSocket('ws://221.226.81.54:30009');
```