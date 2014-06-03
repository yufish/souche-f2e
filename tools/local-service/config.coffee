path = require 'path'
config =
  run_port:3232
  mysql_table:"souchecar"
  mysql_username:"souche" #数据库用户名
  mysql_password:"souchewang010" #数据库密码
  mysql_host:"soucherds.mysql.rds.aliyuncs.com"
  upload_path:__dirname+"/uploads/"
  assets_path:path.join __dirname,'./../../assets/'
  f2e_path:path.join __dirname,'./../../'
  demo_path:path.join __dirname,'./../../demo/'
  base_path:__dirname
  script_ext:".coffee"
  base_host:"http://f2e.souche.com"
  resource_path:"/home/souche/dev/souche-trunk/souche-web/config/resource.properties"
module.exports = config
