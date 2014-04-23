path = require 'path'
config =
  run_port:3232
  mysql_table:"f2e"
  mysql_username:"root" #数据库用户名
  mysql_password:"123" #数据库密码
  mysql_host:"115.29.10.121"
  upload_path:__dirname+"/uploads/"
  assets_path:path.join __dirname,'./../../assets/'
  demo_path:path.join __dirname,'./../../demo/'
  base_path:__dirname
  script_ext:".coffee"
  base_host:"http://f2e.souche.com"
module.exports = config