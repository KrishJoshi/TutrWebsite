/*!
 * modernizr v3.3.1
 * Build http://modernizr.com/download?-pointerevents-target-touchevents-setclasses-dontmin-cssclassprefix:supports-
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
!function(e,t,n){function o(e,t){return typeof e===t}function s(){var e,t,n,s,r,a,i;for(var l in f)if(f.hasOwnProperty(l)){if(e=[],t=f[l],t.name&&(e.push(t.name.toLowerCase()),t.options&&t.options.aliases&&t.options.aliases.length))for(n=0;n<t.options.aliases.length;n++)e.push(t.options.aliases[n].toLowerCase());for(s=o(t.fn,"function")?t.fn():t.fn,r=0;r<e.length;r++)a=e[r],i=a.split("."),1===i.length?c[i[0]]=s:(!c[i[0]]||c[i[0]]instanceof Boolean||(c[i[0]]=new Boolean(c[i[0]])),c[i[0]][i[1]]=s),d.push((s?"":"no-")+i.join("-"))}}function r(e){var t=p.className,n=c._config.classPrefix||"";if(v&&(t=t.baseVal),c._config.enableJSClass){var o=new RegExp("(^|\\s)"+n+"no-js(\\s|$)");t=t.replace(o,"$1"+n+"js$2")}c._config.enableClasses&&(t+=" "+n+e.join(" "+n),v?p.className.baseVal=t:p.className=t)}function a(){return"function"!=typeof t.createElement?t.createElement(arguments[0]):v?t.createElementNS.call(t,"http://www.w3.org/2000/svg",arguments[0]):t.createElement.apply(t,arguments)}function i(){var e=t.body;return e||(e=a(v?"svg":"body"),e.fake=!0),e}function l(e,n,o,s){var r,l,f,u,c="modernizr",d=a("div"),v=i();if(parseInt(o,10))for(;o--;)f=a("div"),f.id=s?s[o]:c+(o+1),d.appendChild(f);return r=a("style"),r.type="text/css",r.id="s"+c,(v.fake?v:d).appendChild(r),v.appendChild(d),r.styleSheet?r.styleSheet.cssText=e:r.appendChild(t.createTextNode(e)),d.id=c,v.fake&&(v.style.background="",v.style.overflow="hidden",u=p.style.overflow,p.style.overflow="hidden",p.appendChild(v)),l=n(d,e),v.fake?(v.parentNode.removeChild(v),p.style.overflow=u,p.offsetHeight):d.parentNode.removeChild(d),!!l}var f=[],u={_version:"3.3.1",_config:{classPrefix:"supports-",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,t){var n=this;setTimeout(function(){t(n[e])},0)},addTest:function(e,t,n){f.push({name:e,fn:t,options:n})},addAsyncTest:function(e){f.push({name:null,fn:e})}},c=function(){};c.prototype=u,c=new c;var d=[],p=t.documentElement,v="svg"===p.nodeName.toLowerCase(),h="Moz O ms Webkit",m=u._config.usePrefixes?h.toLowerCase().split(" "):[];u._domPrefixes=m;var g=function(){function e(e,t){var s;return e?(t&&"string"!=typeof t||(t=a(t||"div")),e="on"+e,s=e in t,!s&&o&&(t.setAttribute||(t=a("div")),t.setAttribute(e,""),s="function"==typeof t[e],t[e]!==n&&(t[e]=n),t.removeAttribute(e)),s):!1}var o=!("onblur"in t.documentElement);return e}();u.hasEvent=g,/*!
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
c.addTest("pointerevents",function(){var e=!1,t=m.length;for(e=c.hasEvent("pointerdown");t--&&!e;)g(m[t]+"pointerdown")&&(e=!0);return e});var y=u._config.usePrefixes?" -webkit- -moz- -o- -ms- ".split(" "):[];u._prefixes=y;var w=u.testStyles=l;/*!
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
c.addTest("touchevents",function(){var n;if("ontouchstart"in e||e.DocumentTouch&&t instanceof DocumentTouch)n=!0;else{var o=["@media (",y.join("touch-enabled),("),"heartz",")","{#modernizr{top:9px;position:absolute}}"].join("");w(o,function(e){n=9===e.offsetTop})}return n}),/*!
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
c.addTest("target",function(){var t=e.document;if(!("querySelectorAll"in t))return!1;try{return t.querySelectorAll(":target"),!0}catch(n){return!1}}),s(),r(d),delete u.addTest,delete u.addAsyncTest;for(var b=0;b<c._q.length;b++)c._q[b]();e.Modernizr=c}(window,document);
//# sourceMappingURL=../maps/scripts/modernizr-673878ee12.js.map
