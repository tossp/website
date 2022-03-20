---
title: "GIT命令整理"
# subtitle: "不太常用，但有需要"
date: 2022-03-20T22:42:12+08:00
lastmod: 2022-03-20T22:42:12+08:00

tags:
  - git
categories:
  - 配置技巧

resources:
  - name: "featured-image"
    src: "featured-image.jpg"

toc:
  enable: true
math:
  enable: false
lightgallery: false


code:
  maxShownLines: 50
---

GIT官方有完整文档，但每次梳理一遍还是太麻烦，还是记录一下一些平时会用到的命令

<!--more-->

## 维护相关

### `.git`文件夹过大的问题

```shell
git gc --prune=now
```
