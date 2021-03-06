
window.addEventListener('load', () => {
  var articleElem = document.getElementsByTagName('article');
  if (articleElem.length && articleElem[0].className === 'page single') {
    var pathID=window.location.pathname.replace(/\/$/,'')||'i.TossP'
    var metaElem = document.getElementsByClassName('post-meta-line');
    if (metaElem.length === 2) {
      var visitor = "<i  class=\"far fa-eye fa-fw\"></i> &nbsp;阅读量 <span id=\"" + pathID + "\" class=\"waline-visitor-count\" >1</span> 次&nbsp;"
      metaElem[1].innerHTML=metaElem[1].innerHTML + visitor
    } else {
      console.warn('页面结构变更，定位meta失败', metaElem)
    }
    var commentElem = document.createElement("div");
    commentElem.id = 'comments';
    commentElem.innerHTML='<div id="waline"></div>'
    articleElem[0].appendChild(commentElem);

    Waline({
      el: "#waline",
      serverURL: "https://waline.tossp.com:2087",
      visitor: true,
      requiredMeta: ['nick', 'mail'],
      copyright: false,
      dark: 'body[theme="dark"]',
      path:pathID,
      emoji: [
        'https://cdn.jsdelivr.net/gh/walinejs/emojis@1.0.0/alus',
        'https://cdn.jsdelivr.net/gh/walinejs/emojis@1.0.0/qq',
      ],
    });
  };
});
