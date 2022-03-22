---
title: "seafile 数据迁移"
subtitle: "使用 rsync 迁移 seafile 数据"
date: 2022-03-21T14:49:12+08:00
lastmod: 2022-03-21T14:49:12+08:00

tags: 
  - rsync
  - seafile
  - linux
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
---

这次要把公司用了五年的 seafile 做一次硬盘迁移，原来是放在6块2T硬盘组成的raid5上的，要迁移到新补入了一块16T的硬盘去。

服务器只有6个盘位，也考虑过拔掉一块硬盘，毕竟是2015年就脱保的老机器了，担心做到一半 raid5 挂了，也没有更多盘位的机器，所以`块复制`就不考虑了。
<!--more-->

## 准备

seafile 这种文件存储最恼火的就是有大量的小文件，使用块复制是最好的方案。但是，这次的环境显然不满足，就只能考虑文件复制了。

复制的话，我能想到的就`cp`和`rsync`，

`cp`还有有风险，服务器上看了一下，大概有5T的数据量，又是小文件，还得上有文件校验和断点续传的东西，那就`rsync`了，

耗资源一点，毕竟要求稳嘛。

## 动手

### 基本操作

找一台工作机，接上新硬盘，开始内网复制。

`192.168.0.240`是服务器的内网IP，其他的几个参数

- `-a`参数可以替代`-r`，除了可以递归同步以外，还可以同步元信息（比如修改时间、权限等）。由于 rsync 默认使用文件大小和修改时间决定文件是否需要更新，所以`-a`比`-r`更有用
- `-v`参数表示输出细节。`-vv`表示输出更详细的信息，`-vvv`表示输出最详细的信息。
- `-z`参数指定同步时压缩数据。
- `-h`参数表示以人类可读的格式输出。
- `-P`参数是`--progress`和`--partial`这两个参数的结合，`--progress`参数表示显示进展，`--partial`参数允许恢复中断的传输。

```shell
rsync -avzhP root@192.168.0.240:/work /backup/
```

以为这样就结束了？让设备跑了一个通宵~还是没跑完，进去看了一些速度大概10M/s，嗯，，，特别棒，感觉这个月的KPI都在这上面了。

### 并行加速

肯定不能够让`rsync`慢慢来，IO 明显没满，接下来就考虑并行了。

seafile 的数据主要在`seafile-data`在文件夹里面，分布式存储嘛，就分的文件夹特别多。

工作机是4C8G的配置,服务器16C32G的配置，那就做8个并发！

```shell
# 可以合并为一条命令
ssh root@192.168.0.240 '/bin/ls /work/seafile-server/seafile-data/storage/blocks/' > ts.list
cat ts.list | xargs -n1 -P8 -I% rsync -avzhP root@192.168.0.240:/work/seafile-server/seafile-data/storage/blocks/% /backup/work/seafile-server/seafile-data/storage/blocks/
```

看了一下成果，服务器 CPU 大概 60% 左右，工作机 CPU 负载 20% 左右，磁盘 IO 70% 左右。

毕竟现在写入 90M/s 左右的速度了差不多了已经八倍的快乐了，万事留一线。还干别的事儿呢，就这差不多吧，应该今天下班之前能搞完吧？
