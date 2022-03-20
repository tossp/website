---
title: "运维常用调试命令"
subtitle: "运维时用过的一些命令"
date: 2022-03-20T20:40:12+08:00
lastmod: 2022-03-20T20:40:12+08:00

tags:
  - curl
  - docker
categories:
  - 配置技巧

resources:
  - name: "featured-image"
    src: "featured-image.png"

toc:
  enable: true
math:
  enable: false
lightgallery: false


code:
  maxShownLines: 50
---

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
