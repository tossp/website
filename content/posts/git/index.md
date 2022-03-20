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

仓库用久了，特别时和别人合用的仓库，总是会莫名其妙的变特别大，特别是存过大文件以后。用这个命令可以清理一下。`gc`使用`--prune`参数来清理特定时期的对象，默认情况下为2周，指定`now`将删除所有这些对象而没有时期限制。

```shell
git gc --prune=now
```

### 清除 git 所有历史提交记录

各种原因需要重置仓库，比如不小心加入了敏感信息，或者一直在ci(fix),ci(fix),ci(fix),或者就是单纯的洁癖。那就假装做一个分支吧

```shell
# 在当前副本创建清洁的新分支
git checkout --orphan latest_branch
# 添加所有文件
git add -A
# 提交修改
git commit -m "init"
# 删除原来的分支
git branch -D mian
# 把当前分支重命名为 mian
git branch -m mian
# 强制推送本地分支到远程
git push -f origin mian
echo "查看新仓库信息："
git log --pretty=oneline
git branch -a
git tag
git ls-remote --tags
```
