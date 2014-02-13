###

本地服务，用于开发者本地使用环境开发。

本地开发时，占用3232端口，需绑定host：f2e.souche.com到本地127.0.0.1 并且在本机nginx上指定端口转发

nginx配置：

```
server {
        listen       80;
        server_name f2e.souche.com;
        location / {
          proxy_set_header Host $host;
          proxy_set_header X-Forwarded-For $remote_addr;
          proxy_pass http://127.0.0.1:3232;
        }
}
```

其中assets的访问路径  http://f2e.souche.com/assets/...

其中demo的访问路径  http://f2e.souche.com/demo/名字拼音/...

其中assets中有 js,css,images 

demo中则可以新建子文件夹，可以放jade，可以放html和其他文件。

####测试方式。

####自动更新。

代码提交到github上的主干后，过一会就会自动同步到测试服务器上，并且重新启动。

testtest