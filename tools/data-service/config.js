path = require("path");

var config;

config = {
    run_port: 3232,


    base_path: __dirname, //应用根路径，程序中常用
    script_ext: ".js", //编程用的脚本后缀
    assets_head: "/assets",
    session_secret: "1234567", //session
    assets_path: path.join(__dirname, './../../assets/'),
    demo_path: path.join(__dirname, './../../demo/'),
    resource_path: "/home/souche/dev/souche-trunk/souche-web/config/resource.properties",
    f2e_path: path.join(__dirname, './../../'),
    base_host: "http://f2e.souche.com",
    //rainbow的配置
    rainbow: {
        controllers: '/controllers/',
        filters: '/filters/',
        template: '/views/'
    },
    mysql_config: {
        database: "souchecar",
        username: "souche",
        password: "souchewang010",
        host: "soucherds.mysql.rds.aliyuncs.com"
        // database: "souchecar",
        // username: "souche",
        // password: "souche2013",
        // host: "115.29.10.121"
    },
    mongo_config: {
        db: {
            native_parser: true
        },
        server: {
            poolSize: 5
        },
        user: 'souche',
        pass: 'souche2014',
        host: "121.199.46.167",
        port: "27017",
        database: "souche"
    }
};

module.exports = config;