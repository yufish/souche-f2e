###

本地服务，用于开发者本地使用环境开发。

本地开发时，占用3232端口，需绑定host：assets-test.souche.com到本地127.0.0.1 并且在本机nginx上指定端口转发

nginx配置：

```
server {
        listen       80;
        server_name assets-test.souche.com;
        location / {
          proxy_set_header Host $host;
          proxy_set_header X-Forwarded-For $remote_addr;
          proxy_pass http://127.0.0.1:3232;
        }
}
```
