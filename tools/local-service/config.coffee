path = require 'path'
config =
  run_port:3232
  mysql_table:"htmljs"
  mysql_username:"root" #数据库用户名
  mysql_password:"" #数据库密码
  mysql_host:"127.0.0.1"
  upload_path:__dirname+"/uploads/"
  assets_path:path.join __dirname,'./../../assets/'
  demo_path:path.join __dirname,'./../../demo/'
<<<<<<< HEAD
module.exports = config
=======
module.exports = config
>>>>>>> 70150487c8d16be48e969bb485ab5784c681529b
