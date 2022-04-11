---
title: "粗看Linux中的CPU调度"
subtitle: "intel_pstate 驱动"
date: 2022-04-12T04:38:12+08:00
lastmod: 2022-04-12T04:38:12+08:00

tags:
  - PVE
  - Linux
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

我好像被网上的”教程“误导了好多，还是要自己实践啊~这块完全是我知识的盲区~太误导了

## 背景

想着物理黑裙切PVE了，估计PVE没啥优化，毕竟是生产软件，肯定性能优先。在网上找了一圈中文资料基本就是

### 先介绍了动态调度的五种模式
<!--more-->
1. performance: 顾名思义只注重效率，将 CPU 频率固定工作在其支持的最高运行频率上，而不动态调节。
Userspace: 最早的 cpufreq 子系统通过 userspace governor 为用户提供了这种灵活性。系统将变频策略的决策权交给了用户态应用程序，并提供了相应的接口供用户态应用程序调节 CPU 运行频率使用。也就是长期以来都在用的那个模式。可以通过手动编辑配置文件进行配置
1. powersave: 将 CPU 频率设置为最低的所谓 “省电” 模式，CPU 会固定工作在其支持的最低运行频率上。因此这两种 governors 都属于静态 governor，即在使用它们时 CPU 的运行频率不会根据系统运行时负载的变化动态作出调整。这两种 
1. governors 对应的是两种极端的应用场景，使用 performance governor 是对系统高性能的最大追求，而使用 powersave governor 则是对系统低功耗的最大追求。
1. ondemand: 按需快速动态调整 CPU 频率， 一有 cpu 计算量的任务，就会立即达到最大频率运行，等执行完毕就立即回到最低频率；ondemand：userspace 是内核态的检测，用户态调整，效率低。而 ondemand 正是人们长期以来希望看到的一个完全在内核态下工作并且能够以更加细粒度的时间间隔对系统负载情况进行采样分析的 governor。 在 ondemand governor 监测到系统负载超过 up_threshold 所设定的百分比时，说明用户当前需要 CPU 提供更强大的处理能力，因此ondemand governor 会将 CPU 设置在最高频率上运行。但是当 ondemand governor 监测到系统负载下降，可以降低 CPU 的运行频率时，到底应该降低到哪个频率呢？ ondemand governor 的最初实现是在可选的频率范围内调低至下一个可用频率，例如 CPU 支持三个可选频率，分别为 1.67GHz、1.33GHz 和 1GHz ，如果 CPU 运行在 1.67GHz 时 ondemand governor 发现可以降低运行频率，那么 1.33GHz 将被选作降频的目标频率。
1. conservative: 与 ondemand 不同，平滑地调整 CPU 频率，频率的升降是渐变式的, 会自动在频率上下限调整，和 ondemand 的区别在于它会按需分配频率，而不是一味追求最高频率；

### 接下来的优化手段

1. 安装`cpufrequtils`
1. 配置`intel_pstate=disable`

### 太雾了

默认情况下，各个发行版的最新的内核基本都是使用的`intel_pstate`驱动，这驱动只有两个模式`performance`和`powersave`，惯性的理解`powersave`会被**固定**在最低运行频率上。

啊？这？那就只有关闭`intel_pstate`了？用`acpi-cpufreq`这玩意都废弃了呀~

最后试了一下`intel_pstate`的`powersave`。

并没有被**固定**在`800Mhz`,最高能到`3400Mhz`左右~看起来应该是睿频没了，

也可能是我的测试不科学，毕竟我就在`shell`里面算了一下Π~

整个小机柜的功耗从`85w`下降到`74w`简直惊喜到了有没有~

## 最终配置

1. 安装`cpupower`,因为安装`cpufrequtils`的时候发现这东西已经太久没维护了！
1. `cpupower frequency-set --governor powersave`
