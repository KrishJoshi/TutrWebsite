/*!
 * modernizr v3.3.1
 * Build http://modernizr.com/download?-backgroundcliptext-input-placeholder-pointerevents-supports-target-touchevents-setclasses-dontmin-cssclassprefix:supports-
 *
 * Copyright (c)
 *  Faruk Ates
 *  Paul Irish
 *  Alex Sexton
 *  Ryan Seddon
 *  Patrick Kettner
 *  Stu Cox
 *  Richard Herrera

 * MIT License
 */
!function(e,t,n){function r(e,t){return typeof e===t}function o(){var e,t,n,o,i,s,a;for(var u in g)if(g.hasOwnProperty(u)){if(e=[],t=g[u],t.name&&(e.push(t.name.toLowerCase()),t.options&&t.options.aliases&&t.options.aliases.length))for(n=0;n<t.options.aliases.length;n++)e.push(t.options.aliases[n].toLowerCase());for(o=r(t.fn,"function")?t.fn():t.fn,i=0;i<e.length;i++)s=e[i],a=s.split("."),1===a.length?S[a[0]]=o:(!S[a[0]]||S[a[0]]instanceof Boolean||(S[a[0]]=new Boolean(S[a[0]])),S[a[0]][a[1]]=o),w.push((o?"":"no-")+a.join("-"))}}function i(e){var t=b.className,n=S._config.classPrefix||"";if(x&&(t=t.baseVal),S._config.enableJSClass){var r=new RegExp("(^|\\s)"+n+"no-js(\\s|$)");t=t.replace(r,"$1"+n+"js$2")}S._config.enableClasses&&(t+=" "+n+e.join(" "+n),x?b.className.baseVal=t:b.className=t)}function s(){return"function"!=typeof t.createElement?t.createElement(arguments[0]):x?t.createElementNS.call(t,"http://www.w3.org/2000/svg",arguments[0]):t.createElement.apply(t,arguments)}function a(){var e=t.body;return e||(e=s(x?"svg":"body"),e.fake=!0),e}function u(e,n,r,o){var i,u,l,f,p="modernizr",c=s("div"),d=a();if(parseInt(r,10))for(;r--;)l=s("div"),l.id=o?o[r]:p+(r+1),c.appendChild(l);return i=s("style"),i.type="text/css",i.id="s"+p,(d.fake?d:c).appendChild(i),d.appendChild(c),i.styleSheet?i.styleSheet.cssText=e:i.appendChild(t.createTextNode(e)),c.id=p,d.fake&&(d.style.background="",d.style.overflow="hidden",f=b.style.overflow,b.style.overflow="hidden",b.appendChild(d)),u=n(c,e),d.fake?(d.parentNode.removeChild(d),b.style.overflow=f,b.offsetHeight):c.parentNode.removeChild(c),!!u}function l(e,t){return!!~(""+e).indexOf(t)}function f(e){return e.replace(/([A-Z])/g,function(e,t){return"-"+t.toLowerCase()}).replace(/^ms-/,"-ms-")}function p(t,r){var o=t.length;if("CSS"in e&&"supports"in e.CSS){for(;o--;)if(e.CSS.supports(f(t[o]),r))return!0;return!1}if("CSSSupportsRule"in e){for(var i=[];o--;)i.push("("+f(t[o])+":"+r+")");return i=i.join(" or "),u("@supports ("+i+") { #modernizr { position: absolute; } }",function(e){return"absolute"==getComputedStyle(e,null).position})}return n}function c(e){return e.replace(/([a-z])-([a-z])/g,function(e,t,n){return t+n.toUpperCase()}).replace(/^-/,"")}function d(e,t,o,i){function a(){f&&(delete M.style,delete M.modElem)}if(i=r(i,"undefined")?!1:i,!r(o,"undefined")){var u=p(e,o);if(!r(u,"undefined"))return u}for(var f,d,m,v,h,y=["modernizr","tspan"];!M.style;)f=!0,M.modElem=s(y.shift()),M.style=M.modElem.style;for(m=e.length,d=0;m>d;d++)if(v=e[d],h=M.style[v],l(v,"-")&&(v=c(v)),M.style[v]!==n){if(i||r(o,"undefined"))return a(),"pfx"==t?v:!0;try{M.style[v]=o}catch(g){}if(M.style[v]!=h)return a(),"pfx"==t?v:!0}return a(),!1}function m(e,t){return function(){return e.apply(t,arguments)}}function v(e,t,n){var o;for(var i in e)if(e[i]in t)return n===!1?e[i]:(o=t[e[i]],r(o,"function")?m(o,n||t):o);return!1}function h(e,t,n,o,i){var s=e.charAt(0).toUpperCase()+e.slice(1),a=(e+" "+L.join(s+" ")+s).split(" ");return r(t,"string")||r(t,"undefined")?d(a,t,o,i):(a=(e+" "+A.join(s+" ")+s).split(" "),v(a,t,n))}function y(e,t,r){return h(e,n,n,t,r)}var g=[],C={_version:"3.3.1",_config:{classPrefix:"supports-",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,t){var n=this;setTimeout(function(){t(n[e])},0)},addTest:function(e,t,n){g.push({name:e,fn:t,options:n})},addAsyncTest:function(e){g.push({name:null,fn:e})}},S=function(){};S.prototype=C,S=new S;var w=[],b=t.documentElement,x="svg"===b.nodeName.toLowerCase(),T=s("input"),_="autocomplete autofocus list placeholder max min multiple pattern required step".split(" "),E={};S.input=function(t){for(var n=0,r=t.length;r>n;n++)E[t[n]]=!!(t[n]in T);return E.list&&(E.list=!(!s("datalist")||!e.HTMLDataListElement)),E}(_);var z="Moz O ms Webkit",A=C._config.usePrefixes?z.toLowerCase().split(" "):[];C._domPrefixes=A;var P=function(){function e(e,t){var o;return e?(t&&"string"!=typeof t||(t=s(t||"div")),e="on"+e,o=e in t,!o&&r&&(t.setAttribute||(t=s("div")),t.setAttribute(e,""),o="function"==typeof t[e],t[e]!==n&&(t[e]=n),t.removeAttribute(e)),o):!1}var r=!("onblur"in t.documentElement);return e}();C.hasEvent=P,/*!
{
  "name": "DOM Pointer Events API",
  "property": "pointerevents",
  "tags": ["input"],
  "authors": ["Stu Cox"],
  "notes": [
    {
      "name": "W3C spec",
      "href": "https://www.w3.org/TR/pointerevents/"
    }
  ],
  "warnings": ["This property name now refers to W3C DOM PointerEvents: https://github.com/Modernizr/Modernizr/issues/548#issuecomment-12812099"],
  "polyfills": ["handjs"]
}
!*/
S.addTest("pointerevents",function(){var e=!1,t=A.length;for(e=S.hasEvent("pointerdown");t--&&!e;)P(A[t]+"pointerdown")&&(e=!0);return e});/*!
{
  "name": "CSS Supports",
  "property": "supports",
  "caniuse": "css-featurequeries",
  "tags": ["css"],
  "builderAliases": ["css_supports"],
  "notes": [{
    "name": "W3 Spec",
    "href": "http://dev.w3.org/csswg/css3-conditional/#at-supports"
  },{
    "name": "Related Github Issue",
    "href": "github.com/Modernizr/Modernizr/issues/648"
  },{
    "name": "W3 Info",
    "href": "http://dev.w3.org/csswg/css3-conditional/#the-csssupportsrule-interface"
  }]
}
!*/
var j="CSS"in e&&"supports"in e.CSS,k="supportsCSS"in e;S.addTest("supports",j||k),/*!
{
  "name": "placeholder attribute",
  "property": "placeholder",
  "tags": ["forms", "attribute"],
  "builderAliases": ["forms_placeholder"]
}
!*/
S.addTest("placeholder","placeholder"in s("input")&&"placeholder"in s("textarea"));var q=C._config.usePrefixes?" -webkit- -moz- -o- -ms- ".split(" "):[];C._prefixes=q;var N=C.testStyles=u;/*!
{
  "name": "Touch Events",
  "property": "touchevents",
  "caniuse" : "touch",
  "tags": ["media", "attribute"],
  "notes": [{
    "name": "Touch Events spec",
    "href": "https://www.w3.org/TR/2013/WD-touch-events-20130124/"
  }],
  "warnings": [
    "Indicates if the browser supports the Touch Events spec, and does not necessarily reflect a touchscreen device"
  ],
  "knownBugs": [
    "False-positive on some configurations of Nokia N900",
    "False-positive on some BlackBerry 6.0 builds – https://github.com/Modernizr/Modernizr/issues/372#issuecomment-3112695"
  ]
}
!*/
S.addTest("touchevents",function(){var n;if("ontouchstart"in e||e.DocumentTouch&&t instanceof DocumentTouch)n=!0;else{var r=["@media (",q.join("touch-enabled),("),"heartz",")","{#modernizr{top:9px;position:absolute}}"].join("");N(r,function(e){n=9===e.offsetTop})}return n}),/*!
{
  "name": "CSS :target pseudo-class",
  "caniuse": "css-sel3",
  "property": "target",
  "tags": ["css"],
  "notes": [{
    "name": "MDN documentation",
    "href": "https://developer.mozilla.org/en-US/docs/Web/CSS/:target"
  }],
  "authors": ["@zachleat"],
  "warnings": ["Opera Mini supports :target but doesn't update the hash for anchor links."]
}
!*/
S.addTest("target",function(){var t=e.document;if(!("querySelectorAll"in t))return!1;try{return t.querySelectorAll(":target"),!0}catch(n){return!1}});var L=C._config.usePrefixes?z.split(" "):[];C._cssomPrefixes=L;var D={elem:s("modernizr")};S._q.push(function(){delete D.elem});var M={style:D.elem.style};S._q.unshift(function(){delete M.style}),C.testAllProps=h,C.testAllProps=y,/*!
{
  "name": "CSS Background Clip Text",
  "property": "backgroundcliptext",
  "authors": ["ausi"],
  "tags": ["css"],
  "notes": [
    {
      "name": "CSS Tricks Article",
      "href": "https://css-tricks.com/image-under-text/"
    },
    {
      "name": "MDN Docs",
      "href": "https://developer.mozilla.org/en-US/docs/Web/CSS/background-clip"
    },
    {
      "name": "Related Github Issue",
      "href": "https://github.com/Modernizr/Modernizr/issues/199"
    }
  ]
}
!*/
S.addTest("backgroundcliptext",function(){return y("backgroundClip","text")}),o(),i(w),delete C.addTest,delete C.addAsyncTest;for(var O=0;O<S._q.length;O++)S._q[O]();e.Modernizr=S}(window,document);
//# sourceMappingURL=../maps/scripts/modernizr-b5159ee128.js.map
