# 运维常用调试命令


需要用到又不一定能背下了的小命令

<!--more-->

## Web服务

### 自定义的HTTP头

```shell
curl -H 'Host:i.tossp.com' http://av8d.app.tossp.com
```

### 重载nginx配置

```shell
docker exec nginx /bin/sh -c 'nginx -c /conf/nginx.conf -t && nginx -c /conf/nginx.conf -s reload'
```

