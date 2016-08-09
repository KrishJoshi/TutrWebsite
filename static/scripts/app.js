(function() {
  'use strict';

  angular
    .module('lhr70', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngMessages', 'ngAria', 'ngResource', 'ui.router', 'toastr', 'slidePushMenu']);

})();

(function () {
  'use strict';

  angular
    .module('lhr70')
    .controller('StoryController', StoryController);

  /** @ngInject */
  function StoryController() {
    var vm = this;

    //var id = $stateParams.id;

    var stry = "Lorem ipsum dolor sit amet, eum te ullum corpora, prima posse postea eu per. Ex duo malis facilis referrentur. Eam eu utamur tractatos mediocrem. Pri te dolor conceptam. Omnis inciderint accommodare at mel. Mei ex nonumy percipitur dissentias, sonet signiferumque ex cum. Cu his aliquam indoctum, per ad eleifend expetendis, labitur erroribus interesset ad qui. Eos ei sumo appetere definiebas, agam probatus sed ea. Fastidii placerat accusamus ei duo, mel id detracto tacimates expetendis, affert disputando an eam. No meis omnis virtute ius, in duo laudem elaboraret. Idque doming dolores te nec. An vim ocurreret prodesset scribentur.Mundi reprimique ut has, mei prompta appellantur philosophia te. Molestie facilisi vim eu, quis dicat civibus in eam. No nam liber choro, an aliquip alterum consequat sit. Prima noster in vim, cibo labores torquatos qui in. Assum corrumpit efficiantur mea id."

    vm.story = {
      title: "To conquer the world",
      heathrow_origin: true,
      trip_year: 1991,
      trip_month: 12,
      trip_day: 5,
      person: {name: "the beatles"},
      journeyStart: 'LHR',
      journeyEnd: 'LAX',
      soundcloud: '208577499',
      image: 'http://www.intrawallpaper.com/static/images/abstract-mosaic-background.png',
      details: stry
    };

    if(vm.story.trip_day || vm.story.trip_month || vm.story.trip_year) {
      vm.story.date = "";
      if (vm.story.trip_day) vm.story.date += vm.story.trip_day + ".";
      if (vm.story.trip_month) vm.story.date += vm.story.trip_month + ".";
      if (vm.story.trip_year) vm.story.date += vm.story.trip_year;
    }
    //= story.getStoryById(id);
  }
})();

(function () {
  'use strict';

  angular
    .module('lhr70')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController(homepage) {
    var vm = this;
    homepage.createHomepage().then(function (data) {
      vm.cards = data;
    });
  }
})();

(function () {
  'use strict';

  angular
    .module('lhr70')
    .controller('GiftsController', GiftsController);

  /** @ngInject */
  function GiftsController(gift) {
    var vm = this;

    gift.createGiftsPage().then(function (data) {
      vm.cards = [];
      for (var j = 0; j < 5; j++) {
        for (var i = 0; i < data.length; i++) {
          var item = data[i];
          vm.cards.push(item);
        }
      }
    })
  }
})();

(function () {
  'use strict';

  angular
    .module('lhr70')
    .directive('storyHeader', storyHeader);

  /** @ngInject */
  function storyHeader() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/storyHeader/storyHeader.directive.html',
      scope: {
        story: '='
      },
      controller: StoryHeaderController,
      controllerAs: 'vm',
      bindToController: true
    };

    /** @ngInject */
    function StoryHeaderController($scope) {
      var vm = this;
        vm.story.background = {'background-image': 'url(' + vm.story.image + ')'};

      $scope.playVideo = function() {
        console.log("TODO: play video functionality");
      }
    }

    return directive;
  }
})();

(function () {
  'use strict';

  angular
    .module('lhr70')
    .directive('storyContent', storyContent);

  /** @ngInject */
  function storyContent() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/storyContent/storyContent.directive.html',
      scope: {
        story: '='
      },
      controller: StoryContentController,
      controllerAs: 'vm',
      bindToController: true
    };

    /** @ngInject */
    function StoryContentController($scope, $sce) {
      $scope.hasField = function(field) {
        return field.length > 0;
      }

      $scope.getSoundcloudUrl = function(id) {
        return $sce.trustAsResourceUrl("https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/" + id +
                "&amp;color=350083&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false");
      }
    }

    return directive;
  }
})();

/**
 * @ngdoc directive
 * @name lhr70:parallaxDirective
 *
 * @description
 *
 *
 * @restrict A
 * */
angular.module('lhr70')
  .directive('cardParallax', function ($window, $document, $timeout,$media) {
    return function (scope, elem) {
      var cardsInView = [];
      var viewHeight = Math.max($document[0].documentElement.clientHeight, $window.innerHeight);
      var parallax = function (element) {
        var itemPos = element.getBoundingClientRect(),
          elBackgroundPos = -(itemPos.top / viewHeight) * 80;

        if($media.query('screen-xs')) {
          elBackgroundPos = -(itemPos.top / viewHeight) * 80;
        }

        elBackgroundPos += 80;

        if(elBackgroundPos < 0) {
          elBackgroundPos = 0;
        }

        if(elBackgroundPos > 100) {
          elBackgroundPos = 100;
        }

        element.style.backgroundPosition = "50% " + elBackgroundPos + "%";

      };
      var startParallax = function (cards) {
        for (var i = 0; i < cards.length; i++) {
          var item = cards[i];
          parallax(item);
        }
      };
      $timeout(function () {
        var cards = angular.element(elem).find('.card');
        startParallax(cards);
        for (var i = 0; i < cards.length; i++) {
          var card = cards[i];
          angular.element(card).on('inview', function (event, isInView) {
            if (isInView) {
              cardsInView.push(event.currentTarget);
              angular.element(event.currentTarget).addClass('visible');
            } else {
              var locationInView = cardsInView.indexOf(event.currentTarget);
              angular.element(event.currentTarget).removeClass('visible');
              if (locationInView != -1)
                cardsInView.splice(locationInView, 1);

            }
          });
        }
        $document.bind('scroll', function () {
          if (cardsInView.length)
            startParallax(cardsInView);
        });
      }, 0);

    }
  });

(function () {
  'use strict';

  angular
    .module('lhr70')
    .directive('navbar', acmeNavbar);

  /** @ngInject */
  function acmeNavbar() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/navbar/navbar.html',
      scope: {
        creationDate: '='
      },
      controller: NavbarController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function NavbarController($timeout, $scope, $location) {
      var self = this;

      var navbar = angular.element('.navbar');

      function setStoryPage() {
        self.isStoryPage = $location.path().split("/")[1] === "story";

        if (self.isStoryPage) {
          navbar.addClass('visible');
        } else {
          $timeout(function () {
            if(!self.isStoryPage) {

              handleInViewBehaviour();

            }
          }, 100);
        }
      }

      function handleInViewBehaviour() {
        angular.element('.hero-box').on('inview', function (event, isInView) {
          $timeout(function () {
            if (!isInView)
              navbar.addClass('visible');
            else {
              navbar.removeClass('visible');
            }
          });
        });
      }

      function init() {
        $scope.$on('$locationChangeSuccess', function() {
          setStoryPage();
        });

        setStoryPage();

        $timeout(function () {
          if(!self.isStoryPage) {

            handleInViewBehaviour();

          }
        }, 100);
      }

      init();




//      this.toggleMenu = function () {
//console.log("works");
//      };

    }
  }

})();

/**
 * @ngdoc directive
 * @name lhr70:masonDirective
 *
 * @description
 *
 *
 * @restrict A
 * */
angular.module('lhr70')
  .directive('masonaryGrid', function ($log, $timeout, $media) {
    return function (scope, elem) {
      var setInfoPosition = function () {
        var colWidth = angular.element(".card.lg:first").width();
        colWidth = (colWidth / 7);
        var largeBlock, smallBlock, contentBlock, ctaBlock, ctaBorder;

        if ($media.query('tablet')) {
          largeBlock = {
            'width': ((colWidth * 4) - 15).toString() + "px",
            'height': (colWidth * 2).toString() + "px"
          };
          smallBlock = {
            'width': ((colWidth * 3)).toString() + "px",
            'height': (colWidth * 2).toString() + "px"
          };

          contentBlock = {'height': (colWidth).toString() + "px"};
        } else {
          largeBlock = {
            'width': ((colWidth * 5)).toString() + "px",
            'height': (colWidth * 3).toString() + "px"
          };
          smallBlock = {
            'width': ((colWidth * 5)).toString() + "px",
            'height': (colWidth * 3).toString() + "px"
          };
        }


        jss.set('.lg .story--copy', largeBlock);
        jss.set('.sm .story--copy', smallBlock);

        jss.set('.lg .content, .sm .content', contentBlock);

        ctaBlock = {'padding-top': colWidth.toString() + 'px'};
        jss.set('.cta,.gftCta', ctaBlock);

        if ($media.query('tablet')) {
          ctaBorder = {'width': ((colWidth * 4)).toString() + "px"};
        } else {
          ctaBorder = {'width': "100%"};
        }
        jss.set('.cta-border', ctaBorder);


        $timeout(function () {
          var ctas = angular.element(".cta,.gftCta");

          if ($media.query('tablet')) {
            var width = angular.element(window).width() / 2;

            var threshold = {
              left: width - (width * 0.55),
              right: width
            };

            for (var i = 0; i < ctas.length; i++) {
              var cta = angular.element(ctas[i]);

              var ctaPosition = cta.position();
              if (ctaPosition.left > threshold.left && ctaPosition.left < threshold.right) {
                if (i < ctas.length) {
                  var nextElement = cta.next();
                  if (ctaPosition.top == ctaPosition.top) {
                    nextElement.insertBefore(cta);
                    ctaPosition = cta.position();
                  }
                }
              }
              cta.removeClass('left');
              cta.removeClass('right');

              if (ctaPosition.left > threshold.left) {
                cta.addClass('right');
              } else {
                cta.addClass('left');
              }
            }
          } else {
            ctas.removeClass('left');
            ctas.removeClass('right');
          }
        }, 50);
      };
      $timeout(function () {
        angular.element(elem).mason({
          itemSelector: '.card',
          ratio: 1,
          promoted: [
            ['lg', 6.9, 7],
            ['sm', 4.9, 5],
            ['qt', 4, 4],
            ['sn', 5, 5],
            ['cta', 2, 4],
            ['gftCta', 2, 4],
            ['gft', 4.9, 5],
            ['gftLg', 6, 6],
            ['gftSm', 3.9, 4]
          ],
          columns: [
            [0, 767, 1],
            [768, 1680, 12]
          ],
          filler: {
            itemSelector: '.filler',
            filler_class: 'mason-filler'
          },
          gutter: 5,
          layout: 'fluid'
        }, setInfoPosition)
      }, 0);
    }
  });

/**
 * @ngdoc directive
 * @name lhr70:imageCropperDirective
 *
 * @description
 *
 *
 * @restrict A
 * */
angular.module('lhr70')
  .directive('imageCropper', function ($window, $document, $timeout) {
    return {
      restrict: 'A',
      link: function (scope, elem) {
        $timeout(function () {
          var canvas = angular.element('<canvas></canvas>')[0];
          var ctx = canvas.getContext('2d');
          var img = angular.element('<img></img>')[0];
          img.setAttribute('crossOrigin', 'anonymous');
          img.src = scope.vm.gift.image;

          // When the image is loaded, draw it
          img.onload = function () {
            var height = img.height;
            var width = img.width;

            canvas.height = height;
            canvas.width = width;

            // Save the state, so we can undo the clipping
            ctx.save();
            ctx.beginPath();
            if (scope.vm.gift.className == 'gftLg') {
              ctx.moveTo(width * 0.13, 0);
              ctx.lineTo(width * 0.28, height * 0.7);
              ctx.lineTo(width * 0.76, height * 0.85);
              ctx.lineTo(width, height * 0.61);
              ctx.lineTo(width, 0);
            } else {
              ctx.moveTo(width * 0.05, 0);
              ctx.lineTo(width * 0.33, height * 0.8);
              ctx.lineTo(width * 0.83, height * 0.95);
              ctx.lineTo(width, height * 0.8
              );
              ctx.lineTo(width, 0);
            }

            ctx.closePath();
            //ctx.stroke();

            // Clip to the current path
            ctx.clip();

            ctx.drawImage(img, 0, 0);

            // Undo the clipping
            ctx.restore();
            elem[0].src = canvas.toDataURL("image/png");
          };
        }, 0);
      }
    };
  });

(function () {
  'use strict';

  angular
    .module('lhr70')
    .directive('giftsBlock', giftsBlock);

  /** @ngInject */
  function giftsBlock() {
    var directive = {
      restrict: 'EA',
      templateUrl: 'app/components/gifts/gifts.directive.html',
      scope: {
        cards: '='
      },
      controller: GiftsController,
      controllerAs: 'vm',
      bindToController: true
    };

    /** @ngInject */
    function GiftsController() {

    }

    return directive;
  }
})();



(function () {
  'use strict';

  angular
    .module('lhr70')
    .directive('footer', footer);

  /** @ngInject */
  function footer() {
    var directive = {
      restrict: 'A',
      templateUrl: 'app/components/footer/footer.directive.html',
      scope: {
        story: '='
      },
      controller: FooterController,
      controllerAs: 'vm',
      bindToController: true
    };

    /** @ngInject */
    function FooterController() {
    }

    return directive;
  }
})();

(function () {
  'use strict';

  angular
    .module('lhr70')
    .directive('cardsBlock', cardsBlock);

  /** @ngInject */
  function cardsBlock() {
    var directive = {
      restrict: 'EA',
      templateUrl: 'app/components/cards/cards.directive.html',
      scope: {
        cards: '='
      },
      controller: CardsController,
      controllerAs: 'vm',
      bindToController: true
    };

    /** @ngInject */
    function CardsController() {

    }

    return directive;
  }
})();



(function () {
  'use strict';

  angular
    .module('lhr70')
    .directive('storyBlock', storyBlock);

  /** @ngInject */
  function storyBlock() {
    var directive = {
      restrict: 'EA',
      templateUrl: 'app/components/cardStory/story.directive.html',
      scope: {
        story: '='
      },
      controller: StoryController,
      controllerAs: 'vm',
      bindToController: true
    };

    /** @ngInject */
    function StoryController() {
    }

    return directive;
  }
})();

(function () {
  'use strict';

  angular
    .module('lhr70')
    .directive('snippetBlock', snippetBlock);

  /** @ngInject */
  function snippetBlock() {
    var directive = {
      restrict: 'EA',
      templateUrl: 'app/components/cardSnippet/snippet.directive.html',
      scope: {
        story: '='
      },
      controller: SnippetController,
      controllerAs: 'vm',
      bindToController: true
    };

    /** @ngInject */
    function SnippetController() {
    }

    return directive;
  }
})();

(function () {
  'use strict';

  angular
    .module('lhr70')
    .directive('giftBlock', giftBlock);

  /** @ngInject */
  function giftBlock() {
    var directive = {
      restrict: 'EA',
      templateUrl: 'app/components/cardGift/gift.directive.html',
      scope: {
        gift: '='
      },
      controller: GiftController,
      controllerAs: 'vm',
      bindToController: true
    };

    /** @ngInject */
    function GiftController() {
    }

    return directive;
  }
})();

(function () {
  'use strict';

  angular
    .module('lhr70')
    .directive('quoteBlock', QuoteBlock);

  /** @ngInject */
  function QuoteBlock() {
    var directive = {
      restrict: 'EA',
      templateUrl: 'app/components/cardQuote/quote.directive.html',
      scope: {
        story: '='
      },
      controller: QuoteController,
      controllerAs: 'vm',
      bindToController: true
    };

    /** @ngInject */
    function QuoteController() {

    }

    return directive;
  }
})();

(function () {
  'use strict';

  angular
    .module('lhr70')
    .directive('ctaBlock', CtaBlock);

  /** @ngInject */
  function CtaBlock() {
    var directive = {
      restrict: 'EA',
      templateUrl: 'app/components/cardCta/cta.directive.html',
      scope: {
        type: '='
      },
      controller: CtaController,
      controllerAs: 'vm',
      bindToController: true
    };

    /** @ngInject */
    function CtaController() {
    }

    return directive;
  }
})();

(function() {
  'use strict';

  angular
    .module('lhr70')
    .service('story', story);

  /** @ngInject */
  function story($resource) {

    var api = $resource('/api/story/:id');

    return {
      getStoryById: function (id) {
        return api.get({id:id}).$promise;
      },
      getAll:  function () {
        return api.query().$promise;
      }
    };
  }

})();

(function () {
  'use strict';

  angular
    .module('lhr70')
    .service('$media', $media)
    .factory('Media', Media);

  /** @ngInject */
  function $media(Media, $rootScope, $window) {
    var shortcuts = {
      'tablet': '(min-width: 768px)',
      'screen-xs': '(max-width:767px)',
      'screen-sm': '(min-width:768px) and (max-width:991px)',
      'screen-md': '(min-width:992px) and (max-width:1199px)',
      'screen-ld': '(min-width:1200px)'
    };

    return {
      query: function (shortcut) {
        return this.raw(shortcuts[shortcut]);
      },
      raw: function (raw_query) {
        Media.value = $window.matchMedia(raw_query).matches;
        $window.onresize = function () {
          Media.value = $window.matchMedia(raw_query).matches;
          $rootScope.$apply();
        };
        return Media.value;
      }
    }
  }


  function Media() {
    return {};
  }

})();

/**
 * @ngdoc service
 * @name lhr70:mapCardFactory
 *
 * @description
 *
 *
 * */
angular.module('lhr70')
    .factory('mapCards', function(){

    var Service = {};
      Service.createCard = function (type, data) {
        var type_mapping = {
          gift: 'gft',
          feature_gift: 'gftLg',
          gift_small: 'gftSm',
          story_cta: 'cta',
          gift_cta: 'gftCta',
          image: 'sm',
          featured: 'lg',
          quote: 'qt',
          snippet: 'sn'
        };

        if (typeof(data) != 'undefined') {
          data.className = type_mapping[type];
          if (data.image !== null && (type == "image" || type == "featured")) {
            data.background = {'background-image': 'url(' + data.image + ')'};
          }
        } else {
          data = {className: type_mapping[type]};
        }

        return data
      };

    return Service;
});

(function () {
  'use strict';

  angular
    .module('lhr70')
    .service('homepage', homepage);

  /** @ngInject */
  function homepage($resource, mapCards, $q) {

    var api = $resource('/api/home/');

    return {
      getData: function () {
        return api.query().$promise;
      },
      createHomepage: function () {
        var deferred = $q.defer();

        this.getData().then(function (data) {
          var cards = [];

          for (var i = 0; i < data.length; i++) {
            var item = data[i];
            cards.push(mapCards.createCard(item.display_as, item));
            if (i % 3 == 0) {
              if (i % 2 == 0)
                cards.push(mapCards.createCard('gift_cta'));
              else {
                cards.push(mapCards.createCard('story_cta'));
              }
            }
          }

          deferred.resolve(cards);
        });

        return deferred.promise;
      }
    };
  }

})();

(function() {
  'use strict';

  angular
    .module('lhr70')
    .service('gift', gift);

  /** @ngInject */
  function gift($resource, $q, mapCards) {

    var api = $resource('/api/gift/:id');

    return {
      geGiftById: function (id) {
        return api.get({id:id}).$promise;
      },
      getAll:  function () {
        return api.query().$promise;
      },
      createGiftsPage: function () {
        var deferred = $q.defer();

        this.getAll().then(function (data) {
          var cards = [];

          for (var i = 0; i < data.length; i++) {
            var item = data[i];
            cards.push(mapCards.createCard("gift_small", item));
          }

          deferred.resolve(cards);
        });

        return deferred.promise;
      }
    };
  }

})();

(function() {
  'use strict';

  angular
    .module('lhr70')
    .run(runBlock);

  /** @ngInject */
  function runBlock($rootScope, $media) {
    $rootScope.$media = $media;
  }

})();

(function () {
  'use strict';

  angular
    .module('lhr70')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/pages/main/main.html',
        controller: 'MainController',
        controllerAs: 'main'
      })
      .state('story', {
        url: '/story/:id',
        templateUrl: 'app/pages/story/story.html',
        controller: 'StoryController',
        controllerAs: 'scope'
      })
      .state('gifts', {
        url: '/gifts/',
        templateUrl: 'app/pages/gifts/gifts.html',
        controller: 'GiftsController',
        controllerAs: 'scope'
      })
      .state('gift', {
        url: '/gift/:id',
        templateUrl: 'app/pages/gift/gift.html',
        controller: 'GiftController',
        controllerAs: 'scope'
      });

      $stateProvider.otherwise('/');
  }

})();

/* global malarkey:false, moment:false */
(function() {
  'use strict';

  angular
    .module('lhr70')
    .constant('malarkey', malarkey)
    .constant('moment', moment);

})();

(function() {
  'use strict';

  angular
    .module('lhr70')
    .config(config);

  /** @ngInject */
  function config($logProvider, toastrConfig, $httpProvider, $locationProvider) {
    // Enable log
    $logProvider.debugEnabled(true);

    // Set options third-party lib
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 3000;
    toastrConfig.positionClass = 'toast-top-right';
    toastrConfig.preventDuplicates = true;
    toastrConfig.progressBar = true;

    //service cannot be injected into a config or something
    var $cookies;
    angular.injector(['ngCookies']).invoke(['$cookies', function(_$cookies_) {
      $cookies = _$cookies_;
    }]);

    // CSFR token for Django
    $httpProvider.defaults.headers.post  = {
      'X-CSRFToken': $cookies.get('csrftoken'),
      'Content-Type': 'application/json'
    };

    $locationProvider.html5Mode(true);



  }

})();

angular.module("lhr70").run(["$templateCache", function($templateCache) {$templateCache.put("app/components/cardCta/cta.directive.html","<div class=text-uppercase><div class=cta-border></div><div ng-if=\"vm.type == \'cta\'\"><img src=/static/assets/images/storyCta.png class=cta-img alt=\"Share your Heathrow Story\"><div class=text-bold>Tell us your story</div><div class=text-light>and receive a birthday gift</div></div><div ng-if=\"vm.type == \'gftCta\'\"><img src=/static/assets/images/giftCta.png class=cta-img alt=\"Share your Heathrow Story\"><div class=text-bold>See all the gifts</div><div class=text-light>you could receive</div></div></div>");
$templateCache.put("app/components/cardQuote/quote.directive.html","<div class=quote><div class=quote--copy><svg class=quote-marks xmlns=http://www.w3.org/2000/svg width=26 height=42 viewBox=\"0 0 26 17\"><defs><linearGradient id=rgrad__uniqueID_6536915b x1=0% y1=45% x2=100% y2=46% gradientUnits=objectBoundingBox><stop offset=0% style=\"stop-color:rgb(195, 0, 192); stop-opacity:1\"></stop><stop offset=100% style=\"stop-color:rgb(15, 0, 67); stop-opacity:1\"></stop></linearGradient></defs><!--BACKGROUND--><rect height=90% width=90% class=svgBg y=5% x=5% fill=transparent></rect><!--BACKGROUND--><path fill=\"url(\'#rgrad__uniqueID_6536915b\')\" d=\"M25.9 10.2C25.6 7.7 23.4 5.9 21 5.8c0.6-2.3 2.1-3.1 3.9-3.7 0.2-0.1 0.1-0.2 0.1-0.2l-0.3-1.8c0 0 0-0.1-0.3-0.1 -6.2 0.7-10.4 5.4-9.6 11.1 0.7 4 3.8 5.5 6.7 5.1C24.4 15.8 26.4 13.1 25.9 10.2L25.9 10.2zM6.2 5.8c0.6-2.3 2.1-3.1 3.9-3.7 0.2-0.1 0.1-0.2 0.1-0.2l-0.3-1.8c0 0 0-0.1-0.3-0.1C3.5 0.7-0.6 5.4 0.1 11.1c0.8 4 3.9 5.5 6.7 5.1 2.9-0.5 4.8-3.1 4.4-6C10.8 7.7 8.7 5.9 6.2 5.8z\" fill=#010101 /></svg><div class=\"lg-text text-capitalize\">{{ vm.story.short_details }}</div></div></div>");
$templateCache.put("app/components/cardGift/gift.directive.html","<div class=gift-info><img class=logo ng-src={{vm.gift.logo_module}} alt=\"\"> <img class=gift-image image-cropper alt=\"\"></div><div class=gift-cta>ADD YOUR STORY FOR A CHANCE TO RECEIVE</div><div class=gift-content>{{vm.gift.title}}</div><!--<div class=\"filler\"></div>-->");
$templateCache.put("app/components/cardSnippet/snippet.directive.html","<div class=snippet><div class=snippet--copy><div class=\"lg-text text-capitalize\">{{ vm.story.short_details }}</div></div></div>");
$templateCache.put("app/components/cardStory/story.directive.html","<div class=content><div class=story--copy><div class=story--from>LHR<div class=icon-plain></div></div><div class=lhr-gradient-text-lg>{{ vm.story.title }}</div></div></div><!--<div class=\"filler\"></div>-->");
$templateCache.put("app/components/cards/cards.directive.html","<div ng-if=vm.cards masonary-grid card-parallax class=jig-grid><div ng-repeat=\"card in vm.cards track by $index\" class=card ng-class=card.className ng-style=card.background><story-block story=card ng-if=\"card.className==\'sm\' || card.className==\'lg\' \"><quote-block story=card ng-if=\"card.className==\'qt\'\"><gift-block gift=card ng-if=\"card.className==\'gft\' || card.className==\'gftLg\' || card.className==\'gftSm\'\"><snippet-block story=card ng-if=\"card.className==\'sn\'\"><cta-block type=card.className ng-if=\"card.className==\'cta\' || card.className==\'gftCta\'\"></div></div>");
$templateCache.put("app/components/footer/footer.directive.html","<footer class=footer><div class=footer-content><div class=footer-ctas><div><a href=/story/1>How it works</a></div><div><a href=#>Terms &amp; Conditions</a></div></div><img class=footer-logo src=/static/assets/images/logo_up_and_down.png></div></footer>");
$templateCache.put("app/components/gifts/gifts.directive.html","<div ng-if=vm.cards masonary-grid card-parallax class=jig-grid><div ng-repeat=\"card in vm.cards track by $index\" class=card ng-class=card.className ng-style=card.background><gift-block gift=card></div></div>");
$templateCache.put("app/components/herobox/herobox.html","<div class=logo-box><img src=/static/assets/images/heath70_logo.png alt=\"70th anniversary logo\"></div><div class=hero-box><div class=hero-box--text><div class=hero-box--text-sm>This year we\'re celebrating 70 years of beautful journeys.</div><div class=hero-box--text-sm>Taking the world to family reunions, new careers & even coronations,</div><h1 class=hero-box--text-lg>Where has Heathrow taken you?</h1><div class=hero-box--text-sm>Add your story and we\'ll give you a birthday gift</div></div></div>");
$templateCache.put("app/components/navbar/navbar.html","<nav><input type=checkbox id=hamburger><label class=menuicon for=hamburger ng-push-menu=menu><span></span></label><ng-slide-push-menu id=menu position=right><a href=# class=active>Read the Stories</a> <a href=#>See all Gifts</a> <a href=#>Find Plaques</a></ng-slide-push-menu></nav><nav class=navbar><div class=lhs><div class=nav--logo>Heathrow 70\'th Anniversary</div><div class=nav--story-title>{{story.title}}</div></div><div class=rhs><a class=\"btn btn--hero\" href=#>Add your story</a></div></nav><menu></menu>");
$templateCache.put("app/components/storyHeader/storyHeader.directive.html","<div class=story-header><div class=story-hero-image ng-style=vm.story.background><button class=\"story-hero-play-btn btn\" ng-click=playVideo()><i class=story-hero-play-icon></i><span class=story-hero-play-copy>play video</span></button></div></div>");
$templateCache.put("app/components/storyContent/storyContent.directive.html","<div class=story-wrapper><div class=story-title-wrapper><div class=journey-from ng-if=vm.story.heathrow_origin>LHR<div class=icon-plane></div></div><h1 class=story-title>{{vm.story.title}}</h1></div><div class=story-inner><div class=story-content><section class=story-details-wrapper><section class=story-details><p class=story-paragraph ng-show=hasField(vm.story.soundcloud)><iframe width=100% height=166 scrolling=no frameborder=no ng-src={{getSoundcloudUrl(vm.story.soundcloud)}}></iframe></p><p class=story-paragraph>{{vm.story.details}}</p></section><quote-block story=card ng-if=\"card.className==\'qt\'\"><div class=story-author><span class=story-year>{{vm.story.trip_year}}</span> <span class=story-name>{{vm.story.person.name}}</span></div></section></div></div></div>");
$templateCache.put("app/pages/gifts/gifts.html","<ng-include src=\"\'app/components/herobox/herobox.html\'\"></ng-include><cards-block ng-if=scope.cards cards=scope.cards></cards-block>");
$templateCache.put("app/pages/main/main.html","<div class=homepage><ng-include src=\"\'app/components/herobox/herobox.html\'\"></ng-include><cards-block ng-if=main.cards cards=main.cards></cards-block></div>");
$templateCache.put("app/pages/story/story.html","<div class=story><div class=container><story-header story=scope.story></story-header><story-content story=scope.story></story-content></div><div class=cta><cta-block type=\"\'cta\'\"></cta-block></div></div>");}]);