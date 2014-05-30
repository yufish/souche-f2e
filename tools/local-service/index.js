var app, config, express, http, less, lessmiddle, log4js, path, rainbow;

express = require('express');

http = require('http');

path = require('path');

config = require('./config.js');

rainbow = require('./lib/rainbow.js');

lessmiddle = require('less-middleware');

less = require('less');

log4js = require('log4js');
fs = require("fs")
module.exports = app = express();

app.configure(function() {
    var logger;
    app.set('port', config.run_port);
    //模板所在路径
    app.set("views", config.demo_path);
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.charset = 'utf-8';
    //日志支持
    log4js.configure({
        appenders: [{
            type: 'console'
        }]
    });
    logger = log4js.getLogger('normal');
    logger.setLevel('INFO');
    app.use(log4js.connectLogger(logger, {
        level: log4js.levels.INFO
    }));
    //静态文件访问支持，less实时编译
    app.use("/assets", lessmiddle({
        src: config.assets_path,
        compress: false,
        force: true
    }));
    app.use("/assets", express["static"](config.assets_path));

    app.locals.pretty = true;
    app.get(/^\/demo\/(.*)$/, function(req, res, next) {
        var _path;
        console.log(req.params[0]);
        res.locals.query = req.query;
        _path = path.join(config.demo_path, req.params[0] + ".jade");
        console.log(_path)
        if (fs.existsSync(_path)) {
            return res.render(_path, {
                pretty: true
            });
        } else {
            return fs.readFile(path.join(config.demo_path, req.params[0]), 'utf-8', function(error, content) {
                if (error) {
                    return next(error);
                } else {
                    return res.send(content);
                }
            });
        }
    });
    //cookie session postbody支持
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.cookieSession({
        secret: config.session_secret
    }));
    app.use(express.methodOverride());

    //rainbow配置
    rainbow.route(app, config.rainbow);
    //404处理
    app.all('*', function(req, res, next) {
        return res.render('404.jade');
    });
    //所有错误的集中处理，在任何route中调用next(error)即可进入此逻辑
    app.use(function(err, req, res, next) {
        console.trace(err);
        res.send(err)
    });
    //给模板引擎设置默认函数，例如时间显示moment
    app.locals.moment = require('moment');
    app.locals.moment.lang('zh-cn');
    //静态资源头，本地开发用本地，线上可以用cdn
    app.locals.assets_head = config.assets_head;
});

app.configure('development', function() {
    app.use(express.errorHandler());
    app.use(express.logger('dev'));
});