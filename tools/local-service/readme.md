###

本地服务，用于开发者本地使用环境开发。

本地开发时，占用3232端口，需绑定host：f2e.souche.com到本地127.0.0.1 并且在本机nginx上指定端口转发

####nginx配置：

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

####本地启动

 * 首先，安装forever。npm install -g forever
 * 然后进入此文件夹
 * 执行npm install
 * 安装完成后执行node server.js看是否报错
 * 如果没有报错，执行forever start server.js即可启动服务。

####本地测试

 * 将assets文件放在assets目录里相应的位置。
 * 然后用host工具，将 f2e.souche.com 绑定到 127.0.0.1 。
 * 用f2e.souche.com/assets 即可访问到assets文件。
 * 用f2e.souche.com/demo/*** 即可访问到本地的demo目录下的文件

####测试环境

 * 如果不绑定host，f2e.souche.com 会访问到115.29.10.121这台测试机器上。可以访问到这台机器上的内容。路径：/home/souche/souche-f2e
 * 当你向github的主干提交代码的时候，测试机会定时拉取主干代码，大概几分钟，所以你提交的代码都会自动生效无需手动操作。


####引用规则。

在java中，兼容老的本地开发方式。

如果要引用新的assets，请使用如下方式：<sc:res value="/assets/js/common.js" />

以/assets/开头的资源在测试环境的时候会请求到f2e.souche.com/assets 上面，线上请求地址一样。

####发布方式

发布是在一台线上机器上完成的，ssh souche@112.124.33.146


```
ssh souche@112.124.33.146
密码：!Z@X3c4v
cd /home/souche/dev/souche-f2e;
git pull;
tools.sh resourceUpload /home/souche/dev/souche-f2e/assets/css ~/dev/souche-trunk/souche-web/config/resource.properties
tools.sh resourceUpload /home/souche/dev/souche-f2e/assets/images ~/dev/souche-trunk/souche-web/config/resource.properties
tools.sh resourceUpload /home/souche/dev/souche-f2e/assets/js ~/dev/souche-trunk/souche-web/config/resource.properties
```


