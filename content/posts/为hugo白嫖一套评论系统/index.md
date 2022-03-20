---
title: "为hugo白嫖一套评论系统"
subtitle: "基于 GitHub Actions 和 Gitlab CI 自动发布"
date: 2022-03-20T13:33:12+08:00
lastmod: 2022-03-20T12:49:12+08:00

tags:
  - hugo
  - waline
  - javascript
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

考虑到我有主题变更狂想症，所以只尝试在不变更主题布局文件的基础上动态的引入 Waline 评论系统。

<!--more-->

## 0. 准备

白嫖方案并不是本文主要，且个运营商不断在调整计费访问，[Waline](https://waline.js.org/) 的官方文档有详细的白嫖教程我这就不重复了。

关注白嫖方案，可以查看[这套文档](https://waline.js.org/guide/server/databases.html)，提供了各种白嫖案例。

需要参考官方文档，部署完成 [Waline](https://waline.js.org/) 后继续操作。

## 1. 集成评论系统

每个主题的引入细节，需要参考页面的DOM结构做调整，但总体思路不变

1. 引用 Waline 的客户端
2. 在合适的位置插入标记点并启动客户端

### 1.1 引入 Waline 客户端

这一步各个主题都差不多，就是导入一个js。

编辑`config.toml`在合适的位置放入客户端的脚本`https://cdn.jsdelivr.net/npm/@waline/client`,我当前使用的`LoveIt`，关键配置就一行

```toml
...
  [params.page]
    [params.page.library]
      #  第三方库配置
      [params.page.library.js]
        # {{< version 1.1 >}} 加载客户端
        walineClientJavascript= "https://cdn.jsdelivr.net/npm/@waline/client"
...
```

### 1.2 引入 Waline 客户端

上面只是引入了客户端，但客户端并没有真正的开始工作，需要做一个启动脚本。

因为 waline 本身也是动态载入的，为了[优雅的添加 waline 集成]^(特别懒的没有做适配PR)，所以用查找定位元素的方式去插入必要的标记。

创建文件`assets\js\comments.js`

```js
// {{< version 0 >}} 完成所有js加载后执行过程
window.addEventListener('load', () => {
  var articleElem = document.getElementsByTagName('article');
  // {{< version 0 >}} 定位到文章页面
  if (articleElem.length && articleElem[0].className === 'page single') {
    
    // {{< version 0 >}} 统一查询ID
    var pathID=window.location.pathname.replace(/\/$/,'')||'i.TossP'

    // {{< version 0 >}} 添加文章阅读量信息
    var metaElem = document.getElementsByClassName('post-meta-line');
    if (metaElem.length === 2) {

      // {{< version 0 >}} `waline-visitor-count` 是 waline 已经预定义好的。其他的按样式匹配编写就好
      var visitor = "<i  class=\"far fa-eye fa-fw\"></i> &nbsp;阅读量 <span id=\"" + pathID + "\" class=\"waline-visitor-count\" >1</span> 次&nbsp;"
      metaElem[1].innerHTML=metaElem[1].innerHTML + visitor
    } else {
      console.warn('页面结构变更，定位meta失败', metaElem)
    }

    // {{< version 0 >}} 添加评论区
    var commentElem = document.createElement("div");
    // {{< version 0 >}} 这里的 id 是主题定义的
    commentElem.id = 'comments';
    // {{< version 0 >}} 这里的 id 必须和下面的 el 参数一致
    commentElem.innerHTML='<div id="waline"></div>'
    articleElem[0].appendChild(commentElem);

    // {{< version 0 >}} 启动 waline 的客户端，具体参数见说明
    Waline({
      el: "#waline",
      serverURL: "https://waline.tossp.com",
      visitor: true,
      requiredMeta: ['nick', 'mail'],
      dark: 'body[theme="dark"]',
      path:pathID,
      emoji: [
        'https://cdn.jsdelivr.net/gh/walinejs/emojis@1.0.0/weibo',
        'https://cdn.jsdelivr.net/gh/walinejs/emojis@1.0.0/bilibili',
      ],
    });
  };
});
```

这里的[官方文档](https://waline.js.org/reference/client.html)有完整的客户端参数说明。

{{< admonition type=tip title="dark 模式适配每个主题都可能不一样" >}}
一般都是在`html`或者`body`元素上。

把页面调为`dark`模式，看看最顶级的哪个元素上有`theme`属性或者`dark`,写入选择器就行。
{{< /admonition >}}

最后在`config.toml`中引入这个js脚本

```toml
...
  [params.page]
    [params.page.library]
      #  第三方库配置
      [params.page.library.js]
        # {{< version 1.1 >}} 加载客户端
        walineClientJavascript= "https://cdn.jsdelivr.net/npm/@waline/client"
        # {{< version 1.2 >}} 加载启动脚本
        commentsJavascript= "js/comments.js"
...
```
