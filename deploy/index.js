const scpClient = require('scp2');
const ora = require('ora');
const chalk = require('chalk');
const spinner = ora('正在发布到 ' + process.env.NODE_ENV + ' 服务器...\n');
spinner.start();

const SERVER_LIST = {
    'development': {
        hostname: '112.124.1.100',// ip
        port: 22,// 端口
        username: 'root', // 登录服务器的账号
        password: 'JINGjiuBUchi7486',// 登录服务器的账号
        path: '/www/abnomal-detection'// 发布至静态服务器的项目路径
    },
    'production': {
        hostname: '221.226.81.54',// ip
        port: 65022,// 端口
        username: 'yuanbao', // 登录服务器的账号
        password: 'root1234',// 登录服务器的账号
        path: '/www/server/tomcat/webapps/abnomal-detection'// 发布至静态服务器的项目路径
    },
};

const server = SERVER_LIST[process.env.NODE_ENV];

scpClient.scp(
    'dist/',
    {
        host: server.hostname,
        port: server.port,
        username: server.username,
        password: server.password,
        path: server.path
    },
    function (err) {
        spinner.stop();
        if (err) {
            console.log(chalk.red('发布失败.\n'));
            throw err;
        } else {
            console.log(chalk.green('Success! 成功发布到' + process.env.NODE_ENV + '服务器! \n'));
        }
    }
);


