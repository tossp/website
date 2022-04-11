# Hugo使用


安装Hugo并部署发布

<!--more-->

## 准备

日常很多记录做的很零散，也就导致了事后不想整理，也就更导致了零散~兜兜转转最后选择了`Hugo`.

由于 Hugo 提供的便利性, [Hugo](https://gohugo.io/) 本身就是唯一的依赖.

直接安装满足你操作系统 (**Windows**, **Linux**, **macOS**) 的最新版本 [:(far fa-file-archive fa-fw): Hugo (> 0.62.0)](https://gohugo.io/getting-started/installing/).

{{< admonition tip "推荐使用 Hugo extended 版本" >}}
Hugo **extended** 版本带有 :(fab fa-sass fa-fw): SCSS 转换为 :(fab fa-css3 fa-fw): CSS。
{{< /admonition >}}

## 搭建

1. 下载或者安装`Hugo`的可执行程序。

1. 使用命令创建并进入站点目录

    ```shell
    ./hugo new site website # 创建名为website的站点
    cd website # 进去站点目录
    ```

1. 初始化站点仓库

    ```shell
    git init
    ```

1. 添加一个自己喜欢的主题，并在阅读主题的说明后，参考说明编辑`config.toml`文件

    ```shell
    git submodule add https://github.com/dillonzq/LoveIt.git themes/LoveIt
    ```

1. 添加`.gitignore`文件，可以参考这个[示例](https://github.com/github/gitignore/blob/main/community/Golang/Hugo.gitignore)

1. 自定义网站图标, 浏览器配置, 网站清单

    * apple-touch-icon.png (180x180)
    * favicon-32x32.png (32x32)
    * favicon-16x16.png (16x16)
    * mstile-150x150.png (150x150)
    * android-chrome-192x192.png (192x192)
    * android-chrome-512x512.png (512x512)

    放在 `/static` 目录. 利用 [https://realfavicongenerator.net/](https://realfavicongenerator.net/) 可以很容易地生成这些文件.

    可以自定义 `browserconfig.xml` 和 `site.webmanifest` 文件来设置 theme-color 和 background-color.

1. 配置 `.github\workflows\gh-pages.yml` 文件自动集成

1. 推送代码，并配置自定义域名

## 使用

使用以下命令启动网站:

```bash
hugo serve --disableFastRender -D
```

构建网站

当你准备好部署你的网站时, 运行以下命令:

```bash
hugo --gc --minify
```

会生成一个 `public` 目录, 其中包含你网站的所有静态内容和资源. 现在可以将其部署在任何 Web 服务器上.

{{< admonition tip >}}
网站内容可以通过 [Netlify](https://www.netlify.com/) 自动发布和托管 (了解有关[通过 Netlify 进行 HUGO 自动化部署](https://www.netlify.com/blog/2015/07/30/hosting-hugo-on-netlifyinsanely-fast-deploys/) 的更多信息).
或者, 您可以使用 [AWS Amplify](https://gohugo.io/hosting-and-deployment/hosting-on-aws-amplify/), [Github pages](https://gohugo.io/hosting-and-deployment/hosting-on-github/), [Render](https://gohugo.io/hosting-and-deployment/hosting-on-render/) 以及更多...
{{< /admonition >}}

