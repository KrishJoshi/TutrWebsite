!function(){"use strict";angular.module("lhr70",["ngAnimate","ngCookies","ngTouch","ngSanitize","ngMessages","ngAria","ngResource","ui.router","toastr","slidePushMenu"])}(),function(){"use strict";function t(){var t=this,e="Lorem ipsum dolor sit amet, eum te ullum corpora, prima posse postea eu per. Ex duo malis facilis referrentur. Eam eu utamur tractatos mediocrem. Pri te dolor conceptam. Omnis inciderint accommodare at mel. Mei ex nonumy percipitur dissentias, sonet signiferumque ex cum. Cu his aliquam indoctum, per ad eleifend expetendis, labitur erroribus interesset ad qui. Eos ei sumo appetere definiebas, agam probatus sed ea. Fastidii placerat accusamus ei duo, mel id detracto tacimates expetendis, affert disputando an eam. No meis omnis virtute ius, in duo laudem elaboraret. Idque doming dolores te nec. An vim ocurreret prodesset scribentur.Mundi reprimique ut has, mei prompta appellantur philosophia te. Molestie facilisi vim eu, quis dicat civibus in eam. No nam liber choro, an aliquip alterum consequat sit. Prima noster in vim, cibo labores torquatos qui in. Assum corrumpit efficiantur mea id.";t.story={title:"To conquer the world",heathrow_origin:!0,trip_year:1991,trip_month:12,trip_day:5,person:{name:"the beatles"},journeyStart:"LHR",journeyEnd:"LAX",soundcloud:"208577499",image:"http://www.intrawallpaper.comstatic//images/abstract-mosaic-background.png",details:e},(t.story.trip_day||t.story.trip_month||t.story.trip_year)&&(t.story.date="",t.story.trip_day&&(t.story.date+=t.story.trip_day+"."),t.story.trip_month&&(t.story.date+=t.story.trip_month+"."),t.story.trip_year&&(t.story.date+=t.story.trip_year))}angular.module("lhr70").controller("StoryController",t)}(),function(){"use strict";function t(t){var e=this;t.createHomepage().then(function(t){e.cards=t})}t.$inject=["homepage"],angular.module("lhr70").controller("MainController",t)}(),function(){"use strict";function t(t){var e=this;t.createGiftsPage().then(function(t){e.cards=[];for(var r=0;5>r;r++)for(var o=0;o<t.length;o++){var a=t[o];e.cards.push(a)}})}t.$inject=["gift"],angular.module("lhr70").controller("GiftsController",t)}(),function(){"use strict";function t(){function t(t){var e=this;e.story.background={"background-image":"url("+e.story.image+")"},t.playVideo=function(){console.log("TODO: play video functionality")}}t.$inject=["$scope"];var e={restrict:"E",templateUrl:"app/components/storyHeader/storyHeader.directive.html",scope:{story:"="},controller:t,controllerAs:"vm",bindToController:!0};return e}angular.module("lhr70").directive("storyHeader",t)}(),function(){"use strict";function t(){function t(t,e){t.hasField=function(t){return t.length>0},t.getSoundcloudUrl=function(t){return e.trustAsResourceUrl("https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/"+t+"&amp;color=350083&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false")}}t.$inject=["$scope","$sce"];var e={restrict:"E",templateUrl:"app/components/storyContent/storyContent.directive.html",scope:{story:"="},controller:t,controllerAs:"vm",bindToController:!0};return e}angular.module("lhr70").directive("storyContent",t)}(),angular.module("lhr70").directive("cardParallax",["$window","$document","$timeout","$media",function(t,e,r,o){return function(a,i){var s=[],n=Math.max(e[0].documentElement.clientHeight,t.innerHeight),l=function(t){var e=t.getBoundingClientRect(),r=80*-(e.top/n);o.query("screen-xs")&&(r=80*-(e.top/n)),r+=80,0>r&&(r=0),r>100&&(r=100),t.style.backgroundPosition="50% "+r+"%"},c=function(t){for(var e=0;e<t.length;e++){var r=t[e];l(r)}};r(function(){var t=angular.element(i).find(".card");c(t);for(var r=0;r<t.length;r++){var o=t[r];angular.element(o).on("inview",function(t,e){if(e)s.push(t.currentTarget),angular.element(t.currentTarget).addClass("visible");else{var r=s.indexOf(t.currentTarget);angular.element(t.currentTarget).removeClass("visible"),-1!=r&&s.splice(r,1)}})}e.bind("scroll",function(){s.length&&c(s)})},0)}}]),function(){"use strict";function t(){function t(t,e,r){function o(){s.isStoryPage="story"===r.path().split("/")[1],s.isStoryPage?n.addClass("visible"):t(function(){s.isStoryPage||a()},100)}function a(){angular.element(".hero-box").on("inview",function(e,r){t(function(){r?n.removeClass("visible"):n.addClass("visible")})})}function i(){e.$on("$locationChangeSuccess",function(){o()}),o(),t(function(){s.isStoryPage||a()},100)}var s=this,n=angular.element(".navbar");i()}t.$inject=["$timeout","$scope","$location"];var e={restrict:"E",templateUrl:"app/components/navbar/navbar.html",scope:{creationDate:"="},controller:t,controllerAs:"vm",bindToController:!0};return e}angular.module("lhr70").directive("navbar",t)}(),angular.module("lhr70").directive("imageCropper",["$window","$document","$timeout",function(t,e,r){return{restrict:"A",link:function(t,e){r(function(){var r=angular.element("<canvas></canvas>")[0],o=r.getContext("2d"),a=angular.element("<img></img>")[0];a.setAttribute("crossOrigin","anonymous"),a.src=t.vm.gift.image,a.onload=function(){var i=a.height,s=a.width;r.height=i,r.width=s,o.save(),o.beginPath(),"gftLg"==t.vm.gift.className?(o.moveTo(.13*s,0),o.lineTo(.28*s,.7*i),o.lineTo(.76*s,.85*i),o.lineTo(s,.61*i),o.lineTo(s,0)):(o.moveTo(.05*s,0),o.lineTo(.33*s,.8*i),o.lineTo(.83*s,.95*i),o.lineTo(s,.8*i),o.lineTo(s,0)),o.closePath(),o.clip(),o.drawImage(a,0,0),o.restore(),e[0].src=r.toDataURL("image/png")}},0)}}}]),angular.module("lhr70").directive("masonaryGrid",["$log","$timeout","$media",function(t,e,r){return function(t,o){var a=function(){var t=angular.element(".card.lg:first").width();t/=7;var o,a,i,s,n;r.query("tablet")?(o={width:(4*t-15).toString()+"px",height:(2*t).toString()+"px"},a={width:(3*t).toString()+"px",height:(2*t).toString()+"px"},i={height:t.toString()+"px"}):(o={width:(5*t).toString()+"px",height:(3*t).toString()+"px"},a={width:(5*t).toString()+"px",height:(3*t).toString()+"px"}),jss.set(".lg .story--copy",o),jss.set(".sm .story--copy",a),jss.set(".lg .content, .sm .content",i),s={"padding-top":t.toString()+"px"},jss.set(".cta,.gftCta",s),n=r.query("tablet")?{width:(4*t).toString()+"px"}:{width:"100%"},jss.set(".cta-border",n),e(function(){var t=angular.element(".cta,.gftCta");if(r.query("tablet"))for(var e=angular.element(window).width()/2,o={left:e-.55*e,right:e},a=0;a<t.length;a++){var i=angular.element(t[a]),s=i.position();if(s.left>o.left&&s.left<o.right&&a<t.length){var n=i.next();s.top==s.top&&(n.insertBefore(i),s=i.position())}i.removeClass("left"),i.removeClass("right"),s.left>o.left?i.addClass("right"):i.addClass("left")}else t.removeClass("left"),t.removeClass("right")},50)};e(function(){angular.element(o).mason({itemSelector:".card",ratio:1,promoted:[["lg",6.9,7],["sm",4.9,5],["qt",4,4],["sn",5,5],["cta",2,4],["gftCta",2,4],["gft",4.9,5],["gftLg",6,6],["gftSm",3.9,4]],columns:[[0,767,1],[768,1680,12]],filler:{itemSelector:".filler",filler_class:"mason-filler"},gutter:5,layout:"fluid"},a)},1e3)}}]),function(){"use strict";function t(){function t(){}var e={restrict:"EA",templateUrl:"app/components/gifts/gifts.directive.html",scope:{cards:"="},controller:t,controllerAs:"vm",bindToController:!0};return e}angular.module("lhr70").directive("giftsBlock",t)}(),function(){"use strict";function t(){function t(){}var e={restrict:"A",templateUrl:"app/components/footer/footer.directive.html",scope:{story:"="},controller:t,controllerAs:"vm",bindToController:!0};return e}angular.module("lhr70").directive("footer",t)}(),function(){"use strict";function t(){function t(){}var e={restrict:"EA",templateUrl:"app/components/cards/cards.directive.html",scope:{cards:"="},controller:t,controllerAs:"vm",bindToController:!0};return e}angular.module("lhr70").directive("cardsBlock",t)}(),function(){"use strict";function t(){function t(){}var e={restrict:"EA",templateUrl:"app/components/cardQuote/quote.directive.html",scope:{story:"="},controller:t,controllerAs:"vm",bindToController:!0};return e}angular.module("lhr70").directive("quoteBlock",t)}(),function(){"use strict";function t(){function t(){}var e={restrict:"EA",templateUrl:"app/components/cardStory/story.directive.html",scope:{story:"="},controller:t,controllerAs:"vm",bindToController:!0};return e}angular.module("lhr70").directive("storyBlock",t)}(),function(){"use strict";function t(){function t(){}var e={restrict:"EA",templateUrl:"app/components/cardSnippet/snippet.directive.html",scope:{story:"="},controller:t,controllerAs:"vm",bindToController:!0};return e}angular.module("lhr70").directive("snippetBlock",t)}(),function(){"use strict";function t(){function t(){}var e={restrict:"EA",templateUrl:"app/components/cardGift/gift.directive.html",scope:{gift:"="},controller:t,controllerAs:"vm",bindToController:!0};return e}angular.module("lhr70").directive("giftBlock",t)}(),function(){"use strict";function t(){function t(){}var e={restrict:"EA",templateUrl:"app/components/cardCta/cta.directive.html",scope:{type:"="},controller:t,controllerAs:"vm",bindToController:!0};return e}angular.module("lhr70").directive("ctaBlock",t)}(),function(){"use strict";function t(t){var e=t("/api/story/:id");return{getStoryById:function(t){return e.get({id:t}).$promise},getAll:function(){return e.query().$promise}}}t.$inject=["$resource"],angular.module("lhr70").service("story",t)}(),function(){"use strict";function t(t,e,r){var o={tablet:"(min-width: 768px)","screen-xs":"(max-width:767px)","screen-sm":"(min-width:768px) and (max-width:991px)","screen-md":"(min-width:992px) and (max-width:1199px)","screen-ld":"(min-width:1200px)"};return{query:function(t){return this.raw(o[t])},raw:function(o){return t.value=r.matchMedia(o).matches,r.onresize=function(){t.value=r.matchMedia(o).matches,e.$apply()},t.value}}}function e(){return{}}t.$inject=["Media","$rootScope","$window"],angular.module("lhr70").service("$media",t).factory("Media",e)}(),angular.module("lhr70").factory("mapCards",function(){var t={};return t.createCard=function(t,e){var r={gift:"gft",feature_gift:"gftLg",gift_small:"gftSm",story_cta:"cta",gift_cta:"gftCta",image:"sm",featured:"lg",quote:"qt",snippet:"sn"};return"undefined"!=typeof e?(e.className=r[t],null===e.image||"image"!=t&&"featured"!=t||(e.background={"background-image":"url("+e.image+")"})):e={className:r[t]},e},t}),function(){"use strict";function t(t,e,r){var o=t("/api/home/");return{getData:function(){return o.query().$promise},createHomepage:function(){var t=r.defer();return this.getData().then(function(r){for(var o=[],a=0;a<r.length;a++){var i=r[a];o.push(e.createCard(i.display_as,i)),a%3==0&&(a%2==0?o.push(e.createCard("gift_cta")):o.push(e.createCard("story_cta")))}console.log(o),t.resolve(o)}),t.promise}}}t.$inject=["$resource","mapCards","$q"],angular.module("lhr70").service("homepage",t)}(),function(){"use strict";function t(t,e,r){var o=t("/api/gift/:id");return{geGiftById:function(t){return o.get({id:t}).$promise},getAll:function(){return o.query().$promise},createGiftsPage:function(){var t=e.defer();return this.getAll().then(function(e){for(var o=[],a=0;a<e.length;a++){var i=e[a];o.push(r.createCard("gift_small",i))}t.resolve(o)}),t.promise}}}t.$inject=["$resource","$q","mapCards"],angular.module("lhr70").service("gift",t)}(),function(){"use strict";function t(t,e){t.$media=e}t.$inject=["$rootScope","$media"],angular.module("lhr70").run(t)}(),function(){"use strict";function t(t,e){t.state("home",{url:"/",templateUrl:"app/pages/main/main.html",controller:"MainController",controllerAs:"main"}).state("story",{url:"/story/:id",templateUrl:"app/pages/story/story.html",controller:"StoryController",controllerAs:"scope"}).state("gifts",{url:"/gifts/",templateUrl:"app/pages/gifts/gifts.html",controller:"GiftsController",controllerAs:"scope"}).state("gift",{url:"/gift/:id",templateUrl:"app/pages/gift/gift.html",controller:"GiftController",controllerAs:"scope"}),e.otherwise("/")}t.$inject=["$stateProvider","$urlRouterProvider"],angular.module("lhr70").config(t)}(),function(){"use strict";angular.module("lhr70").constant("malarkey",malarkey).constant("moment",moment)}(),function(){"use strict";function t(t,e,r,o){t.debugEnabled(!0),e.allowHtml=!0,e.timeOut=3e3,e.positionClass="toast-top-right",e.preventDuplicates=!0,e.progressBar=!0;var a;angular.injector(["ngCookies"]).invoke(["$cookies",function(t){a=t}]),r.defaults.headers.post={"X-CSRFToken":a.get("csrftoken"),"Content-Type":"application/json"},o.html5Mode(!0)}t.$inject=["$logProvider","toastrConfig","$httpProvider","$locationProvider"],angular.module("lhr70").config(t)}(),angular.module("lhr70").run(["$templateCache",function(t){t.put("app/components/cardCta/cta.directive.html",'<div class=text-uppercase><div class=cta-border></div><div ng-if="vm.type == \'cta\'"><img src=static//assets/images/storyCta.png class=cta-img alt="Share your Heathrow Story"><div class=text-bold>Tell us your story</div><div class=text-light>and receive a birthday gift</div></div><div ng-if="vm.type == \'gftCta\'"><img src=static//assets/images/giftCta.png class=cta-img alt="Share your Heathrow Story"><div class=text-bold>See all the gifts</div><div class=text-light>you could receive</div></div></div>'),t.put("app/components/cardGift/gift.directive.html",'<div class=gift-info><img class=logo ng-src={{vm.gift.logo_module}} alt=""> <img class=gift-image image-cropper alt=""></div><div class=gift-cta>ADD YOUR STORY FOR A CHANCE TO RECEIVE</div><div class=gift-content>{{vm.gift.title}}</div><!--<div class="filler"></div>-->'),t.put("app/components/cardQuote/quote.directive.html",'<div class=quote><div class=quote--copy><svg class=quote-marks xmlns=http://www.w3.org/2000/svg width=26 height=42 viewBox="0 0 26 17"><defs><linearGradient id=rgrad__uniqueID_6536915b x1=0% y1=45% x2=100% y2=46% gradientUnits=objectBoundingBox><stop offset=0% style="stop-color:rgb(195, 0, 192); stop-opacity:1"></stop><stop offset=100% style="stop-color:rgb(15, 0, 67); stop-opacity:1"></stop></linearGradient></defs><!--BACKGROUND--><rect height=90% width=90% class=svgBg y=5% x=5% fill=transparent></rect><!--BACKGROUND--><path fill="url(\'#rgrad__uniqueID_6536915b\')" d="M25.9 10.2C25.6 7.7 23.4 5.9 21 5.8c0.6-2.3 2.1-3.1 3.9-3.7 0.2-0.1 0.1-0.2 0.1-0.2l-0.3-1.8c0 0 0-0.1-0.3-0.1 -6.2 0.7-10.4 5.4-9.6 11.1 0.7 4 3.8 5.5 6.7 5.1C24.4 15.8 26.4 13.1 25.9 10.2L25.9 10.2zM6.2 5.8c0.6-2.3 2.1-3.1 3.9-3.7 0.2-0.1 0.1-0.2 0.1-0.2l-0.3-1.8c0 0 0-0.1-0.3-0.1C3.5 0.7-0.6 5.4 0.1 11.1c0.8 4 3.9 5.5 6.7 5.1 2.9-0.5 4.8-3.1 4.4-6C10.8 7.7 8.7 5.9 6.2 5.8z" fill=#010101 /></svg><div class="lg-text text-capitalize">{{ vm.story.short_details }}</div></div></div>'),t.put("app/components/cardSnippet/snippet.directive.html",'<div class=snippet><div class=snippet--copy><div class="lg-text text-capitalize">{{ vm.story.short_details }}</div></div></div>'),t.put("app/components/cardStory/story.directive.html",'<div class=content><div class=story--copy><div class=story--from>LHR<div class=icon-plain></div></div><div class=lhr-gradient-text-lg>{{ vm.story.title }}</div></div></div><!--<div class="filler"></div>-->'),t.put("app/components/cards/cards.directive.html","<div ng-if=vm.cards masonary-grid card-parallax class=jig-grid><div ng-repeat=\"card in vm.cards track by $index\" class=card ng-class=card.className ng-style=card.background>{{card.className}}<story-block story=card ng-if=\"card.className=='sm' || card.className=='lg' \"><quote-block story=card ng-if=\"card.className=='qt'\"><gift-block gift=card ng-if=\"card.className=='gft' || card.className=='gftLg' || card.className=='gftSm'\"><snippet-block story=card ng-if=\"card.className=='sn'\"><cta-block type=card.className ng-if=\"card.className=='cta' || card.className=='gftCta'\"></div></div>"),t.put("app/components/footer/footer.directive.html","<footer class=footer><div class=footer-content><div class=footer-ctas><div><a href=/story/1>How it works</a></div><div><a href=#>Terms &amp; Conditions</a></div></div><img class=footer-logo src=static//assets/images/logo_up_and_down.png></div></footer>"),t.put("app/components/gifts/gifts.directive.html",'<div ng-if=vm.cards masonary-grid card-parallax class=jig-grid><div ng-repeat="card in vm.cards track by $index" class=card ng-class=card.className ng-style=card.background><gift-block gift=card></div></div>'),t.put("app/components/herobox/herobox.html","<div class=logo-box><img src=static//assets/images/heath70_logo.png alt=\"70th anniversary logo\"></div><div class=hero-box><div class=hero-box--text><div class=hero-box--text-sm>This year we're celebrating 70 years of beautful journeys.</div><div class=hero-box--text-sm>Taking the world to family reunions, new careers & even coronations,</div><h1 class=hero-box--text-lg>Where has Heathrow taken you?</h1><div class=hero-box--text-sm>Add your story and we'll give you a birthday gift</div></div></div>"),t.put("app/components/navbar/navbar.html",'<nav><input type=checkbox id=hamburger><label class=menuicon for=hamburger ng-push-menu=menu><span></span></label><ng-slide-push-menu id=menu position=right><a href=# class=active>Read the Stories</a> <a href=#>See all Gifts</a> <a href=#>Find Plaques</a></ng-slide-push-menu></nav><nav class=navbar><div class=lhs><div class=nav--logo>Heathrow 70\'th Anniversary</div><div class=nav--story-title>{{story.title}}</div></div><div class=rhs><a class="btn btn--hero" href=#>Add your story</a></div></nav><menu></menu>'),t.put("app/components/storyContent/storyContent.directive.html","<div class=story-wrapper><div class=story-title-wrapper><div class=journey-from ng-if=vm.story.heathrow_origin>LHR<div class=icon-plane></div></div><h1 class=story-title>{{vm.story.title}}</h1></div><div class=story-inner><div class=story-content><section class=story-details-wrapper><section class=story-details><p class=story-paragraph ng-show=hasField(vm.story.soundcloud)><iframe width=100% height=166 scrolling=no frameborder=no ng-src={{getSoundcloudUrl(vm.story.soundcloud)}}></iframe></p><p class=story-paragraph>{{vm.story.details}}</p></section><quote-block story=card ng-if=\"card.className=='qt'\"><div class=story-author><span class=story-year>{{vm.story.trip_year}}</span> <span class=story-name>{{vm.story.person.name}}</span></div></section></div></div></div>"),t.put("app/components/storyHeader/storyHeader.directive.html",'<div class=story-header><div class=story-hero-image ng-style=vm.story.background><button class="story-hero-play-btn btn" ng-click=playVideo()><i class=story-hero-play-icon></i><span class=story-hero-play-copy>play video</span></button></div></div>'),t.put("app/pages/gifts/gifts.html","<ng-include src=\"'app/components/herobox/herobox.html'\"></ng-include><cards-block ng-if=scope.cards cards=scope.cards></cards-block>"),t.put("app/pages/story/story.html","<div class=story><div class=container><story-header story=scope.story></story-header><story-content story=scope.story></story-content></div><div class=cta><cta-block type=\"'cta'\"></cta-block></div></div>"),t.put("app/pages/main/main.html","<div class=homepage><ng-include src=\"'app/components/herobox/herobox.html'\"></ng-include><cards-block ng-if=main.cards cards=main.cards></cards-block></div>")}]);
//# sourceMappingURL=../maps/scripts/app-0ae3abfd85.js.map
