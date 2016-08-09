!function(){"use strict";angular.module("lhr70",["ngAnimate","ngCookies","ngTouch","ngSanitize","ngMessages","ngAria","ngResource","ui.router","toastr"])}(),function(){"use strict";function e(e,t){var o=this,r=t.id;o.story=e.getStoryById(r)}e.$inject=["story","$stateParams"],angular.module("lhr70").controller("StoryController",e)}(),function(){"use strict";function e(){var e=this;e.cards=[];for(var t=[{"float":"left",items:["lg","sm","sq"]},{"float":"right",items:["lg","sm","sq"]},{"float":"right",items:["sq","sm"]},{"float":"left",items:["lg","sm","sq"]},{"float":"right",items:["lg","sm","sq"]}],o=0;o<t.length;o++){for(var r=t[o].items,n=[],a=0;a<r.length;a++){var i=r[a],s="https://unsplash.it/600?image="+Math.floor(100*Math.random()+1);"sq"==i&&(s="");var l={id:o,className:i,image:s};n.push(l)}var c={items:n,"float":t[o]["float"]};e.cards.push(c)}}angular.module("lhr70").controller("MainController",e)}(),function(){"use strict";function e(){function e(){return t}var t=[{title:"AngularJS",url:"https://angularjs.org/",description:"HTML enhanced for web apps!",logo:"angular.png"},{title:"BrowserSync",url:"http://browsersync.io/",description:"Time-saving synchronised browser testing.",logo:"browsersync.png"},{title:"GulpJS",url:"http://gulpjs.com/",description:"The streaming build system.",logo:"gulp.png"},{title:"Jasmine",url:"http://jasmine.github.io/",description:"Behavior-Driven JavaScript.",logo:"jasmine.png"},{title:"Karma",url:"http://karma-runner.github.io/",description:"Spectacular Test Runner for JavaScript.",logo:"karma.png"},{title:"Protractor",url:"https://github.com/angular/protractor",description:"End to end test framework for AngularJS applications built on top of WebDriverJS.",logo:"protractor.png"},{title:"Sass (Node)",url:"https://github.com/sass/node-sass",description:"Node.js binding to libsass, the C version of the popular stylesheet preprocessor, Sass.",logo:"node-sass.png"}];this.getTec=e}angular.module("lhr70").service("webDevTec",e)}(),function(){"use strict";function e(){function e(){}var t={restrict:"EA",templateUrl:"app/components/story/story.directive.html",scope:{story:"="},controller:e,controllerAs:"vm",bindToController:!0};return t}angular.module("lhr70").directive("storyBlock",e)}(),function(){"use strict";function e(){function e(){for(var e=this,t=0;t<e.cards.length;t++)for(var o=e.cards[t].items,r=0;r<o.length;r++){var n=o[r];"sq"==n.className?n.background="":n.background={"background-image":"url("+n.image+")"}}}var t={restrict:"EA",templateUrl:"app/components/stories/stories.directive.html",scope:{cards:"="},controller:e,controllerAs:"vm",bindToController:!0};return t}angular.module("lhr70").directive("storiesBlock",e)}(),function(){"use strict";function e(){function e(){}var t={restrict:"EA",templateUrl:"app/components/quote/quote.directive.html",scope:{quote:"="},controller:e,controllerAs:"vm",bindToController:!0};return t}angular.module("lhr70").directive("quoteBlock",e)}(),angular.module("lhr70").directive("cardParallax",["$window","$document","$timeout",function(e,t,o){return function(r,n){var a=[],i=Math.max(t[0].documentElement.clientHeight,e.innerHeight),s=function(e){var t=e.getBoundingClientRect(),o=t.top/i*60;e.style.backgroundPosition="50% "+o+"%"},l=function(e){for(var t=0;t<e.length;t++){var o=e[t];s(o)}};o(function(){for(var e=angular.element(n).find(".card"),o=0;o<e.length;o++){var r=e[o];angular.element(r).on("inview",function(e,t){t?a.push(e.currentTarget):a.splice(a.indexOf(e.currentTarget),1)})}t.bind("scroll",function(){a.length&&l(a)})},0)}}]),function(){"use strict";function e(){function e(e){var t=this;t.relativeDate=e(t.creationDate).fromNow()}e.$inject=["moment"];var t={restrict:"E",templateUrl:"app/components/navbar/navbar.html",scope:{creationDate:"="},controller:e,controllerAs:"vm",bindToController:!0};return t}angular.module("lhr70").directive("navbar",e)}(),angular.module("lhr70").directive("masonaryGrid",["$log","$timeout",function(e,t){return function(e,o){var r=!1,n=function(){r||(r=!0,t(function(){for(var e=angular.element(".card"),t=0;t<e.length;t++){var o=angular.element(e[t]),r=450;o.hasClass("lg")&&(r=100),o.position().left>r?o.addClass("right"):o.addClass("left"),0===t||t&&!(t%2)?o.addClass("top"):o.addClass("bottom")}},50))};t(function(){angular.element(o).mason({itemSelector:".card",ratio:1,promoted:[["lg",6.9,6],["md",5.5,4],["sm",5,4],["sq",4,4]],columns:[[0,767,1],[768,1680,12]],filler:{itemSelector:".filler",filler_class:"mason-filler"},gutter:5,layout:"fluid"},n)},0)}}]),angular.module("lhr70").directive("imageCropper",["$window","$document","$timeout","$media",function(e,t,o,r){return{restrict:"A",link:function(t,n){var a=function(e,t){var o;return t=t||600,function(){var r=this,n=arguments;clearTimeout(o),o=setTimeout(function(){e.apply(r,Array.prototype.slice.call(n))},t)}},i=function(){var e=angular.element(n),o=e.find(".story--copy"),a=angular.element("<canvas></canvas>")[0],i=a.getContext("2d"),s=angular.element("<img></img>")[0];s.setAttribute("crossOrigin","anonymous"),s.src=t.card.image,s.onload=function(){var t=s.height,n=o.outerHeight(),l=s.width,c=o.outerWidth();if(a.height=t,a.width=l,r.query("tablet")){var u=e.hasClass("sm"),m=e.hasClass("left"),d=e.hasClass("bottom");o.addClass("bg-transparent"),d&&(n=e.height()-n-20,u||(n-=50)),u?(n=1.5*n,c=m?1.2*c:r.query("screen-sm")?2.5*c:r.query("screen-md")?2*c:1.8*c):(r.query("screen-sm")?(c=.4*c,n=.8*n):r.query("screen-md")?(c=.9*c,n=1.3*n):(c=.8*c,n=1*n),n=1.3*n),i.save(),i.beginPath(),m?d?(i.moveTo(0,0),i.lineTo(l,0),i.lineTo(l,t),i.lineTo(c,t),i.lineTo(c,n),i.lineTo(0,n)):(i.moveTo(0,n),i.lineTo(c,n),i.lineTo(c,0),i.lineTo(l,0),i.lineTo(l,t),i.lineTo(0,t)):d?(i.moveTo(0,0),i.lineTo(l,0),i.lineTo(l,n),i.lineTo(c,n),i.lineTo(c,t),i.lineTo(0,t)):(i.moveTo(l,n),i.lineTo(c,n),i.lineTo(c,0),i.lineTo(0,0),i.lineTo(0,t),i.lineTo(l,t)),i.closePath(),i.clip()}else o.removeClass("bg-transparent");i.drawImage(s,0,0),i.restore(),e.css("backgroundImage","url('"+a.toDataURL("image/png")+"')")}};o(function(){0==t.$parent.i&&t.j<5&&(i(),angular.element(e).bind("resize",a(function(){i()},50)))},200)}}}]),function(){"use strict";function e(e){var t=e("/api/story/:id");return{getStoryById:function(e){return t.get({id:e})},getAll:function(){return t.query()}}}e.$inject=["$resource"],angular.module("lhr70").service("story",e)}(),function(){"use strict";function e(e,t,o){var r={tablet:"(min-width: 768px)","screen-xs":"(max-width:767px)","screen-sm":"(min-width:768px) and (max-width:991px)","screen-md":"(min-width:992px) and (max-width:1199px)","screen-ld":"(min-width:1200px)"};return{query:function(e){return this.raw(r[e])},raw:function(r){return e.value=o.matchMedia(r).matches,o.onresize=function(){e.value=o.matchMedia(r).matches,t.$apply()},e.value}}}function t(){return{}}e.$inject=["Media","$rootScope","$window"],angular.module("lhr70").service("$media",e).factory("Media",t)}(),function(){"use strict";function e(e,t){e.$media=t}e.$inject=["$rootScope","$media"],angular.module("lhr70").run(e)}(),function(){"use strict";function e(e,t){e.state("home",{url:"/",templateUrl:"app/pages/main/main.html",controller:"MainController",controllerAs:"main"}).state("story",{url:"/story/:id",templateUrl:"app/pages/story/story.html",controller:"StoryController",controllerAs:"main"}),t.otherwise("/")}e.$inject=["$stateProvider","$urlRouterProvider"],angular.module("lhr70").config(e)}(),function(){"use strict";angular.module("lhr70").constant("malarkey",malarkey).constant("moment",moment)}(),function(){"use strict";function e(e,t,o,r){e.debugEnabled(!0),t.allowHtml=!0,t.timeOut=3e3,t.positionClass="toast-top-right",t.preventDuplicates=!0,t.progressBar=!0;var n;angular.injector(["ngCookies"]).invoke(["$cookies",function(e){n=e}]),o.defaults.headers.post={"X-CSRFToken":n.get("csrftoken"),"Content-Type":"application/json"},r.html5Mode(!0)}e.$inject=["$logProvider","toastrConfig","$httpProvider","$locationProvider"],angular.module("lhr70").config(e)}(),angular.module("lhr70").run(["$templateCache",function(e){e.put("app/components/herobox/herobox.html","<div class=logo-box><img src=/assets/images/heath70_logo.png alt=\"70th anniversary logo\"></div><div class=hero-box><div class=hero-box--text><div class=hero-box--text-sm>This year we're celebrating 70 years of beautful journeys.</div><div class=hero-box--text-sm>Taking the world to family reunions, new careers & even coronations,</div><h1 class=hero-box--text-lg>Where has Heathrow taken you?</h1><div class=hero-box--text-sm>Add your story and we'll give you a birthday gift</div></div></div>"),e.put("app/components/navbar/navbar.html",'<nav class=navbar><a class="bg-gradient-lhr no-pad" href=/ ></a><!--<h1 class="icons-logo header-logo&#45;&#45;position">Heathrow</h1>--><div class=heading-spacer>&nbsp;</div><!--<ul class="menu">--><!--<li class="active menu-link"><a ng-href="#">Home</a></li>--><!--<li class="menu-link"><a ng-href="#">About</a></li>--><!--<li class="menu-link"><a ng-href="#">Contact</a></li>--><!--</ul>--></nav>'),e.put("app/components/quote/quote.directive.html",'<div class=quote><div class=quote--copy><blockquote class=quote-marks></blockquote><div class="lg-text text-capitalize">In 1978 I flew from heathrow to new york for a job interview. I didn\'t get the job but i met my wife on the flight home.</div></div></div>'),e.put("app/components/stories/stories.directive.html",'<div ng-repeat="(i, modules) in vm.cards track by $index" card-parallax masonary-grid class=jig-grid ng-class=modules.float><div ng-repeat="(j, card) in modules.items" class=card image-cropper=[i,j] ng-class=card.className ng-style=card.background><story-block story=card ng-if="card.className!=\'sq\'"><quote-block quote=card ng-if="card.className==\'sq\'"></div></div>'),e.put("app/components/story/story.directive.html",'<div class=story--copy><div class=story--from>LHR</div><div ng-if="vm.story.className == \'lg\'"><div class=lhr-gradient-text-lg>To conquer the mountain</div></div><div ng-if="vm.story.className == \'sm\'"><div class=lhr-gradient-text-lg>To Marry my wife</div></div></div><!--<div class="filler"></div>-->'),e.put("app/pages/main/main.html","<navbar></navbar><ng-include src=\"'app/components/herobox/herobox.html'\"></ng-include><stories-block cards=main.cards></stories-block>"),e.put("app/pages/story/story.html",'<div class=cards><story-block class=card story=main.story></story-block></div><!--<div class="container">--><!--<div>--><!--<acme-navbar></acme-navbar>--><!--</div>--><!--&lt;!&ndash; HTML markup for the section right below this code block &ndash;&gt;--><!--<section>--><!--<aside>What is it about?</aside>--><!--<article>Neat is an open source semantic grid framework built on top of Sass and Bourbon…</article>--><!--</section>--><!--<div class="jumbotron">--><!--<h1>\'Allo, \'Allo!</h1>--><!--<p class="lead">--><!--<img src="assets/images/yeoman.png" alt="I\'m Yeoman"><br>--><!--Always a pleasure scaffolding your apps.--><!--</p>--><!--<p class="animated infinite" ng-class="main.classAnimation">--><!--<a class="btn btn-lg btn-success" ng-click="main.showToastr()">Splendid Toastr</a>--><!--</p>--><!--<p>--><!--With ♥ thanks to the contributions of<acme-malarkey extra-values="[\'Yeoman\', \'Gulp\', \'Angular\']"></acme-malarkey>--><!--</p>--><!--</div>--><!--<div class="col" ng-repeat="awesomeThing in main.awesomeThings | orderBy:\'rank\'">--><!--<div class="thumbnail">--><!--<img class="pull-right" ng-src="assets/images/{{ awesomeThing.logo }}" alt="{{ awesomeThing.title }}">--><!--<div class="caption">--><!--<h3>{{ awesomeThing.title }}</h3>--><!--<p>{{ awesomeThing.description }}</p>--><!--<p><a ng-href="{{ awesomeThing.url }}">{{ awesomeThing.url }}</a></p>--><!--</div>--><!--</div>--><!--</div>--> <!--</div>-->')}]);
//# sourceMappingURL=../maps/scripts/app-60a4985f46.js.map
