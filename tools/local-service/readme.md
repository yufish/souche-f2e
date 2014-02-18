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

####引用规则。

/home/souche/souche-f2e

在java中，兼容老的本地开发方式。

如果要引用新的assets，请使用如下方式：<sc:res value="/assets/js/common.js" />

以/assets/开头的资源在测试环境的时候会请求到f2e.souche.com/assets 上面

####发布方式

```
cd /home/souche/dev/souche-trunk/souche-web/script
./tools.sh resourceUpload /home/souche/souche-f2e/assets ~/dev/souche-trunk/souche-web/config/resource.properties
```
####自动更新。

代码提交到github上的主干后，过一会就会自动同步到测试服务器上，并且重新启动相关服务。

