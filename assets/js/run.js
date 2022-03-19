
window.addEventListener('load', () => {
  var articleElem = document.getElementsByTagName('article');
  if (articleElem.length && articleElem[0].className === 'page single') {
    var metaElem = document.getElementsByClassName('post-meta-line');
    if (metaElem.length === 2) {
      var visitor = "<i  class=\"far fa-eye fa-fw\"></i> &nbsp;阅读量 <span id=\"" + window.location.pathname + "\" class=\"waline-visitor-count\" >1</span> 次&nbsp;"
      metaElem[1].innerHTML=metaElem[1].innerHTML + visitor
    } else {
      console.warn('页面结构变更，定位meta失败', metaElem)
    }
    var waline = document.createElement("div");
    waline.id = 'waline';
    articleElem[0].appendChild(waline);

    Waline({
      el: "#waline",
      serverURL: "https://waline.tossp.com:2087",
      visitor: true,
      requiredMeta: ['nick', 'mail'],
      copyright: false,
      dark: 'body[theme="dark"]',
      path:window.location.pathname.replace(/\/$/,''),
      emoji: [
        'https://cdn.jsdelivr.net/gh/walinejs/emojis@1.0.0/weibo',
        'https://cdn.jsdelivr.net/gh/walinejs/emojis@1.0.0/bilibili',
      ],
    });
  };
});
