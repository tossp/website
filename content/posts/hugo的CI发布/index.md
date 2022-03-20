---
title: "hugo的CI发布"
subtitle: "基于 GitHub Actions 和 Gitlab CI 自动发布"
date: 2022-03-20T12:49:12+08:00
lastmod: 2022-03-20T12:49:12+08:00

tags: 
  - github
  - gitlab
  - hugo
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

制作基于 GitHub Actions 和 Gitlab CI 的工作流文件

<!--more-->

## GitHub Actions 配置

创建文件`.github\workflows\gh-pages.yml`

```yml
name: Github pages 发布

on:
  push:
    branches:
      - main  # 设置默认发布分支
  pull_request:
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: 检出代码
        uses: actions/checkout@v3
        with:
          submodules: recursive  # 获取 Hugo 主题，也可以使用 true
          fetch-depth: 0    # 为 .GitInfo and .Lastmod 取得所有提交历史记录

      - name: 安装Hugo
        uses: peaceiris/actions-hugo@v2
        with:
          hugo-version: 'latest'
          extended: true

      - name: 构建
        run: hugo --gc --minify --enableGitInfo

      - name: 发布
        uses: peaceiris/actions-gh-pages@v3
        if: github.ref == 'refs/heads/main'
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
          cname: i.tossp.com
          publish_branch: gh
          force_orphan: true

      - name: 清理工作流
        uses: Mattraks/delete-workflow-runs@v2
```

## Gitlab CI 配置

创建文件`.gitlab-ci.yml`

其中`pages`过程名称不可自定义，`tags`标记必须和执行器的标记匹配，用于选定`runner`.

```yml
image: registry.gitlab.com/pages/hugo/hugo_extended:latest

variables:
  GIT_SUBMODULE_STRATEGY: recursive
  GIT_DEPTH: 1

测试构建:
  script:
    - hugo
  except:
    - main

pages:
  tags:
    - tsn
  script:
    - git fetch
    - hugo --gc --minify --enableGitInfo
  artifacts:
    paths:
    - public
  only:
  - main
```
