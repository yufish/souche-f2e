argv = require('optimist').argv
childProcess = require('child_process')
childProcess.exec "scp "+argv.resource+" www2.souche:/opt/tomcat6/webapps/ROOT/WEB-INF/classes/resource.properties",(err, stdout, stderr)->
  console.log err
  console.log stdout
  console.log stderr
childProcess.exec "scp "+argv.resource+" www1.souche:/opt/tomcat6/webapps/ROOT/WEB-INF/classes/resource.properties",(err, stdout, stderr)->
  console.log err
  console.log stdout
  console.log stderr