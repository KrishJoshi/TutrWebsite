(function() {
  'use strict';

  angular
    .module('lhr70', ['ngAnimate', 'ngCookies', 'ngTouch',
      'ngSanitize', 'ngMessages', 'ngAria', 'ngResource',
      'ui.router', 'toastr', 'slidePushMenu',
      'ngFileUpload']);
})();

(function () {
  'use strict';

  SubmitStoryController.$inject = ["story", "$rootScope", "$q", "$timeout"];
  angular
    .module('lhr70')
    .controller('SubmitStoryController', SubmitStoryController);

  /** @ngInject */
  function SubmitStoryController(story, $rootScope, $q, $timeout) {

    var vm = this;
    $rootScope.hasBackground = true;
    $rootScope.customContainer = true;
    $rootScope.setMetatags("Tell us your story");
    $rootScope.hero = {
      title: "Story",
      subTitle: {
        top: "Tell us your"
      },
      text: {
        content: ["Add your story to receive one of our exciting 70th Birthday gifts. " +
        "Meet your partner on a flight? Enjoy a magical family holiday? The richer your story, " +
        "the better birthday present you’ll receive! " +
        "We can only send presents to UK addresses. " +
        "Below are some optional questions that might help trigger a story"]
      },
      width: 230,
      subTitleStyle: {
        'text-align': 'center',
        'padding-left': '15px',
        'letter-spacing': '1px'
      }
    };

    vm.successMessage = {
      title: "Story&nbsp;Added!",
      content: ["Thanks for sharing your story and being part of our 70th birthday.",
        "In the mean time why not read some <a class='success-link link' href='/'> " +
        "more stories</a> from the last seven decades."]
    };

    vm.story = {
      heathrow_origin: null
    };

    vm.reward = {
      one: '6331',
      two: '',
      three: '',
      four: ''
    };

    var getFileBase64FromFileAsync = function (file) {
      var deferred = $q.defer();
      var fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = function (e) {
        deferred.resolve(e.target.result);
      };
      return deferred.promise;
    };

    vm.isImage = function () {
      if (vm.image) {
        return vm.image.type.split("/")[0] == "image";
      }
      return false;
    };

    vm.isImageValid = function () {
      if (vm.image) {
        return vm.image.type.split("/")[0] == "image";
      }
      return false;
    };

    vm.submitForm = function (form, form2, form3) {
      var isFormValid = function (form, form2, form3) {
        if (form2.country.$viewValue === 'United Kingdom') {
          return form.$valid && form2.$valid && form3.$valid
        } else {
          form2.address_line_1.$setValidity('required', true);
          form2.postcode.$setValidity('required', true);
          return form.$valid && form2.$valid && form3.$valid
        }
      };
      var submitStorySuccess = function () {
        vm.isSubmitted = true;
        if (vm.heathrow_originNotSet)
          vm.story.heathrow_origin = null;

        if (vm.story.person.country == 'United Kingdom') {
          _satellite.track('submit_success_UK');
        } else {
          vm.successMessage.content = "Thanks for sharing your story and being part of our 70th birthday." +
            "In the meantime, why not read some more stories from the last seven decades";
          _satellite.track('submit_success_non_UK');
        }
        vm.message = vm.successMessage;

      };
      var submitStoryError = function (error) {
        var errorStr = "";

        for (var key in error.data) {
          errorStr = errorStr + error.data[key] + "\n";
        }
        alert('There was an error submitting your form. Please check the form and try again.\n' + errorStr);
        if (vm.heathrow_originNotSet)
          vm.story.heathrow_origin = null;
        if (vm.story.person.country == 'United Kingdom') {
          _satellite.track('submit_failure_UK');
        } else {
          vm.successMessage.content = "Thanks for sharing your story and being part of our 70th birthday." +
            "In the meantime, why not read some more stories from the last seven decades";
          _satellite.track('submit_failure_non_UK');
        }
      };
      var cleanseData = function () {
        if (vm.story.heathrow_origin === null) {
          vm.story.heathrow_origin = true;
          vm.heathrow_originNotSet = true;
        } else {
          vm.heathrow_originNotSet = false;
        }

        if (vm.reward.two != "") {
          vm.story.person.rewards_number = vm.reward.one + vm.reward.two + vm.reward.three + vm.reward.four;
        }
      };
      if (isFormValid(form, form2, form3)) {

        cleanseData();


        if (vm.image) {
          getFileBase64FromFileAsync(vm.image).then(
            function (imageData) {
              vm.story.image = imageData;
              story.save(vm.story).then(submitStorySuccess, submitStoryError);
            });
        } else {
          story.save(vm.story).then(submitStorySuccess, submitStoryError);
        }
      } else {
        angular.forEach(form.$error.required, function (field) {
          field.$setDirty();
        });
        angular.forEach(form2.$error.required, function (field) {
          field.$setDirty();
        });
        angular.forEach(form3.$error.required, function (field) {
          field.$setDirty();
        });
        $timeout(function () {
          angular.element('html, body').animate({
            scrollTop: angular.element('.to-fix:first').parent().offset().top - 80
          }, 250);
        }, 250);
      }
    };

    // ATTRIBUTES (with default values if not set)
    vm.yearOrder = true; // year order: 'asc' or 'desc', default: desc
    var endYear = 1946; // default: this year
    var startYear = new Date().getFullYear();

    vm.trip_date = new Date();

    // INIT YEARS, MONTHS AND DAYS NUMBER
    vm.dateSelector = {};

    var days = function (year, month) {
      if (year == startYear && parseInt(month) == new Date().getMonth()) {
        var nbDays = new Date().getDate();
      } else {
        var nbDays = new Date(year, month, 0).getDate() || 31;
      }
      // Get number of days based on month + year
      // (January = 31, February = 28, April = 30, February 2000 = 29) or 31 if no month selected yet
      var daysList = [];
      for (var i = 1; i <= nbDays; i++) {
        var iS = i.toString();
        daysList.push((iS.length < 2) ? '0' + iS : iS); // Adds a leading 0 if single digit
      }
      return daysList;
    };
    vm.dateSelector.days = days;


    var month = function (year) {
      var monthList = [];
      var monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];

      var lastMonth;
      if (year == startYear)
        lastMonth = new Date().getMonth();
      else {
        lastMonth = 11;
      }

      for (var i = 0; i <= lastMonth; i++) {
        var iS = (i+1).toString();


        var month = {};
        month.name = monthNames[i];
        month.id = iS;
        monthList.push(month); // Adds a leading 0 if single digit
      }
      return monthList;
    };
    vm.dateSelector.months = month;

    var yearsList = [];
    for (var i = startYear; i >= endYear; i--) {
      yearsList.push(i.toString());
    }
    vm.dateSelector.years = yearsList;

  }
})
();

(function () {
  'use strict';

  StoryController.$inject = ["story", "$rootScope", "$stateParams", "$location", "truncateFilter", "htmlToPlaintextFilter"];
  angular
    .module('lhr70')
    .controller('StoryController', StoryController);

  /** @ngInject */
  function StoryController(story, $rootScope, $stateParams, $location, truncateFilter, htmlToPlaintextFilter) {

    var vm = this;
    $rootScope.hasBackground = false;

    var slug = $stateParams.slug;

    var constructDate = function() {
      if(vm.story.trip_day || vm.story.trip_month || vm.story.trip_year) {
        vm.story.date = "";
        if (vm.story.trip_day) vm.story.date += vm.story.trip_day + ".";
        if (vm.story.trip_month) vm.story.date += vm.story.trip_month + ".";
        if (vm.story.trip_year) vm.story.date += vm.story.trip_year;
      }
    };

    var sendStoryData = function () {
      // send title to navigation
      // TODO: might need to be added into a location change event listener
      $rootScope.$broadcast('STORY_TITLE_CHANGE', {
        from: vm.story.journeyStart,
        title: vm.story.title,
        person_name: vm.story.person_name,
        date: vm.story.date
      });
    }

    story.getStoryById(slug).then(function (data) {
      vm.story = data;
      constructDate();
      sendStoryData();
      $rootScope.setMetatags(data.title, truncateFilter(htmlToPlaintextFilter(data.details)), "article", data.image);
    }, function () {
      $location.path('/not-found');
    });

    //var stry = "Lorem ipsum dolor sit amet, eum te ullum corpora, prima posse postea eu per. Ex duo malis facilis referrentur. Eam eu utamur tractatos mediocrem. Pri te dolor conceptam. Omnis inciderint accommodare at mel. Mei ex nonumy percipitur dissentias, sonet signiferumque ex cum. Cu his aliquam indoctum, per ad eleifend expetendis, labitur erroribus interesset ad qui. Eos ei sumo appetere definiebas, agam probatus sed ea. Fastidii placerat accusamus ei duo, mel id detracto tacimates expetendis, affert disputando an eam. No meis omnis virtute ius, in duo laudem elaboraret. Idque doming dolores te nec. An vim ocurreret prodesset scribentur.Mundi reprimique ut has, mei prompta appellantur philosophia te. Molestie facilisi vim eu, quis dicat civibus in eam. No nam liber choro, an aliquip alterum consequat sit. Prima noster in vim, cibo labores torquatos qui in. Assum corrumpit efficiantur mea id."

    // vm.story = {
    //   title: "To conquer the world!!!!!!!",
    //   heathrow_origin: true,
    //   trip_year: 1991,
    //   trip_month: 12,
    //   trip_day: 5,
    //   person: {name: "the beatles"},
    //   journeyStart: 'LHR',
    //   journeyEnd: 'LAX',
    //   soundcloud: '208577499',
    //   image: 'http://www.intrawallpaper.com/static/images/abstract-mosaic-background.png',
    //   details: stry
    // };

  }
})();

(function () {
  'use strict';

  StaticController.$inject = ["page", "$stateParams", "$rootScope", "$location"];
  angular
    .module('lhr70')
    .controller('StaticController', StaticController);

  /** @ngInject */
  function StaticController(page, $stateParams, $rootScope, $location) {

    var vm = this;
    $rootScope.hasBackground = false;

    var slug = $stateParams.slug;

    page.getPageById(slug).then(function (data) {
      vm.page = data;
      $rootScope.setMetatags(data.title);
    }, function () {
      $location.path('/not-found');
    });

  }
})();

(function () {
  'use strict';

  MainController.$inject = ["homepage", "$rootScope", "$timeout"];
  angular
    .module('lhr70')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController(homepage, $rootScope, $timeout) {
    var vm = this;
    $rootScope.hasBackground = true;
    homepage.createHomepage().then(function (data) {
      $timeout(function () {
        vm.cards = data;
      },500);
    });
    $rootScope.hero = {
      title: "Heathrow",
      subTitle: {
        top: "Where has",
        bottom: "taken you?"
      },
      text: {
        content: ["This year marks 70 years of Heathrow. We're celebrating your journeys with a birthday present to unwrap when you share your story. If you’ve ever travelled to loved ones, to new experiences or to beyond your wildest dreams, tell us and receive your gift."]
      },
      hasCta: true
    };

    $rootScope.setMetatags("Home");
  }
})();

(function () {
  'use strict';

  GiftsController.$inject = ["gift", "$rootScope"];
  angular
    .module('lhr70')
    .controller('GiftsController', GiftsController);

  /** @ngInject */
  function GiftsController(gift, $rootScope) {
    var vm = this;
    $rootScope.hasBackground = true;
    $rootScope.hero = {
      title: "Gifts?",
      subTitle: "Birthday",
      text: {
        content: ["For our 70th birthday, we’re asking you to share a Heathrow story to receive a birthday present. Where has Heathrow taken you?",
          "We’ve teamed up with our partners, to offer you some great gifts. Here are some of the gifts you could receive when you <a class='success-link link' href='/story/submit'>Add your story.</a>"]
      }
    };
    gift.createGiftsPage().then(function (data) {
      vm.cards = data;
    });
    $rootScope.setMetatags("Gifts");

  }
})();

(function () {
  'use strict';

  GiftController.$inject = ["gift", "$stateParams", "$rootScope", "$location", "htmlToPlaintextFilter", "truncateFilter"];
  angular
    .module('lhr70')
    .controller('GiftController', GiftController);

  /** @ngInject */
  function GiftController(gift, $stateParams, $rootScope, $location, htmlToPlaintextFilter, truncateFilter) {
    var vm = this;
    $rootScope.hasBackground = false;
    var slug = $stateParams.slug;

    gift.getGiftById(slug).then(function (data) {
      vm.gift = data;
      $rootScope.setMetatags(data.title, truncateFilter(htmlToPlaintextFilter(data.description)), "article", data.image_thumbnail);
    }, function () {
      $location.path('/not-found');
    });
  }
})();

/* global YT */

(function () {
  'use strict';

  angular
    .module('lhr70')
    .directive('storyHeader', storyHeader);

  /** @ngInject */
  function storyHeader() {
    StoryHeaderController.$inject = ["$scope", "$sce", "$rootScope", "$document", "$window", "$timeout", "$media"];
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
    function StoryHeaderController($scope, $sce, $rootScope, $document, $window, $timeout, $media) {

      var vm = this;
      var player;


      var initVideoPlayer = function () {


        if (!$rootScope.hasYoutubeAPI) {
          // 2. This code loads the player Player API code asynchronously.
          var tag = angular.element('<script>');
          var firstScriptTag = angular.element('script')[0];
          firstScriptTag.parentNode.insertBefore(tag[0], firstScriptTag);

          tag.attr('src', 'https://www.youtube.com/player_api');

          $rootScope.hasYoutubeAPI = true;

          $window.onYouTubePlayerAPIReady = function () {
            createYoutubePlayer();
          }
        } else {
          createYoutubePlayer();
        }

        function createYoutubePlayer() {
          // 3. This function creates an <player> (and YouTube player)
          //    after the API code downloads.
          player = new YT.Player('player', {
            height: '100%',
            width: '100%',
            videoId: vm.story.youtube_id,
            events: {
              'onReady': onPlayerReady,
              'onStateChange': onPlayerStateChange
            }
          });
        }

        // 4. The API will call this function when the video player is ready.
        function onPlayerReady(event) {
          if ($media.query('screen-md') || $media.query('screen-lg'))
            event.target.playVideo();

          $scope.videoActive = true;
          $scope.$apply();


          var requestFullScreen = player.requestFullScreen || player.mozRequestFullScreen || player.webkitRequestFullScreen;
          if (requestFullScreen) {
            requestFullScreen.bind(player)();
          }
        }

        // 5. The API calls this function when the player's state changes.
        //    The function indicates that when playing a video (state=1),
        //    the player should play for six seconds and then stop.
        var done = false;

        function onPlayerStateChange(event) {
          if (event.data == YT.PlayerState.ENDED && !done) {
            done = true;
          }
        }
      }

      $scope.hasVideo = function () {
        return vm.story && vm.story.youtube_id !== null && typeof vm.story.youtube_id !== 'undefined'
      }

      $scope.getBackground = function (image) {
        return {'background-image': 'url(' + image + ')'}
      }

      // $scope.getVideoSrc = function() {
      //   return $sce.trustAsResourceUrl('//www.youtube.com/embed/' + vm.story.youtube_id + '?autoplay=1');
      // }

      $scope.closeVideo = function () {
        player.stopVideo();
        $scope.videoActive = false;
      };

      $scope.playVideo = function () {
        if (typeof player === 'undefined') {
          initVideoPlayer();
        } else {
          $scope.videoActive = true;
          $timeout(function () {
            player.playVideo();
          }, 0)
        }

      }
    }

    return directive;
  }
})();

/*
  global $
*/

(function () {
  'use strict';

  angular
    .module('lhr70')
    .directive('storyContent', storyContent);

  function storyContent() {
    StoryContentController.$inject = ["$scope", "$sce", "$rootScope"];
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
    function StoryContentController($scope, $sce, $rootScope) {
      $scope.hasField = function(field) {
        return typeof field !== "undefined" && field !== null;
      }

      $scope.hasCopy = function(copy) {
        return typeof copy !== "undefined" && copy !== null;
      }

      $scope.getSoundcloudUrl = function(id) {
        return $sce.trustAsResourceUrl("https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/" + id +
                "&amp;color=350083&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false");
      }

      $scope.getParagraphs = function(copy) {

        copy = $scope.altToCaption(copy);

        var paragraphs = copy ? copy.split("</p>") : [];

        $.each( paragraphs, function( key ) {
          if (paragraphs[key] && paragraphs[key].length > 0) {
            paragraphs[key] += "</p>";
          } else {
            paragraphs.pop(paragraphs[key]);
          }
        });

        return paragraphs;

      }

      $scope.getFirstParagraph = function(copy) {
        return $scope.getParagraphs(copy)[0];
      }

      $scope.getOtherParagraphs = function(copy) {
        var paragraphs = $scope.getParagraphs(copy);
        return paragraphs.slice(1, paragraphs.length);
      }

      $scope.altToCaption = function(text) {
        var $text = angular.element('<div>' + text + '</div>');
        var images = $text.find('img');

        if (images.length > 0) {
          $text.find('img').each(function() {
            var $outer = angular.element(angular.element(this).wrap( '<div class=\'story-image-wrapper\'></div>' )).parent();
            $outer.append('<span class="story-image-caption">' + angular.element(this).attr('alt') + '</span>');
          })

          return ($text.html());
        } else {
          return text;
        }
      }

      $scope.getSafeHtml = function(copy) {
        return $sce.trustAsResourceUrl(copy);
      }

      var handleTitleInView = function() {
        angular.element('.story-title').on('inview', function (event, isInView) {
          $rootScope.$broadcast('STORY_SHOW_TITLE_IN_NAV', !isInView);
        });
      }

      handleTitleInView();
    }

    return directive;
  }
})();

/*
 globals Modernizr
 */
(function () {
  'use strict';

  angular
    .module('lhr70')
    .directive('share', share);

  function share() {
    ShareController.$inject = ["$element", "$window", "$scope", "$location", "$document", "$timeout", "$state"];
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/share/share.directive.html',
      scope: {
        element: '='
      },
      controller: ShareController,
      controllerAs: 'vm',
      bindToController: true
    };

    /** @ngInject */
    function ShareController($element, $window, $scope, $location, $document, $timeout, $state) {
      var vm = this;
      $timeout(function () {
        var $shareWrapper = $element.find('.story-share-wrapper');
        var shareShowing = false;

        var twitterText = "";
        var facebookText = "";
        var emailCopy = {
          subject: "",
          body: ""
        };

        $scope.vm.element.$promise.then(function (data) {
            if ($state.current.name === 'gift') {
              facebookText = 'It’s Heathrow’s 70th birthday and they’re giving out birthday presents! Add a story for your chance to unwrap it';
              twitterText = 'It’s Heathrow’s 70th birthday! For the chance to unwrap this amazing gift, add a story';
              emailCopy.subject = "Heathrow’s 70th birthday";
              emailCopy.body = "It’s Heathrow’s 70th birthday and they’re giving out birthday presents! Add a story for your chance to unwrap this gift " + $window.encodeURIComponent($location.absUrl());
            } else {
              facebookText = "Heathrow presents ‘" + data.title +
                "’ Hear this amazing story as the airport celebrates 70 years of beautiful journeys.";
              twitterText = "‘" + data.title +
                "’ An amazing new story for @Heathrow’s 70th birthday";
              emailCopy.subject = "A new story for Heathrow’s 70th birthday";
              emailCopy.body = "Heathrow presents ‘" + data.title +
                "’, a amazing new story to celebrate their 70th anniversary this year. You can also add you own story for the chance to receive a birthday gift.";
            }
        });

        $scope.getFacebookUrl = function () {
          return "https://www.facebook.com/sharer/sharer.php?u=" + $window.encodeURIComponent($location.absUrl()) + "&quote='" +
            facebookText + "'";
        };

        $scope.getTwitterUrl = function () {
          return vm.element ? "https://twitter.com/intent/tweet?text=" + twitterText + " " + $window.encodeURIComponent($location.absUrl()) : "";
        };

        $scope.getEmailContent = function () {
          return vm.element ? "mailto:?Subject=" +
          emailCopy.subject +
          "&body=" + emailCopy.body : "";
        };

        $scope.openInNewWindow = function (e) {
          if (shareShowing || !Modernizr.touchevents) {
            return !$window.open(e.currentTarget.href, "Share", "width=800,height=250");
          } else {
            e.preventDefault();
          }
        };

        $scope.openShare = function () {
          if (Modernizr.touchevents) {
            $shareWrapper.addClass('is-active');

            $timeout(function () {
              shareShowing = true;
            }, 10);
          }
        }

        var closeShare = function () {
          shareShowing = false;
          $shareWrapper.removeClass('is-active');
        }

        var addUnFocusHandler = function () {
          $document.on('click touchstart', function (ev) {
            if (!(angular.element(ev.target).closest('.story-share-inner').length > 0)) {
              closeShare();
            }
          });
        }

        var makeItemSticky = function () {

          angular.element($window).on('scroll', function () {

            if ($element.offset().top - $window.scrollY < 125) {
              $shareWrapper.addClass('is-sticky');
            } else {
              $shareWrapper.removeClass('is-sticky');
            }
          });
        }


        var init = function () {
          makeItemSticky();

          if (Modernizr.touchevents) {
            addUnFocusHandler();
          }
        }

        init();
      });
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
/** @ngInject */
angular.module('lhr70')
  .directive("rewardInput", function () {
    return {
      restrict: "A",
      link: function ($scope, element) {
        element.on("input", function (e) {
          if (element.val().length == element.attr("maxlength")) {
            var $nextElement = element.next();
            if ($nextElement.length) {
              $nextElement[0].focus();
            }
          }
        });
      }
    }
  });

/**
 * @ngdoc directive
 * @name lhr70:parallaxDirective
 *
 * @description
 *
 *
 * @restrict A
 * */
/** @ngInject */
angular.module('lhr70')
  .directive('cardParallax', ["$window", "$document", "$timeout", "$media", function ($window, $document, $timeout, $media) {
    return function (scope, elem) {
      var cardsInView = [];
      var viewHeight = Math.max($document[0].documentElement.clientHeight, $window.innerHeight);
      var parallax = function (element) {
        var itemPos = element.getBoundingClientRect(),
          elBackgroundPos = -(itemPos.top / viewHeight) * 80;

        if ($media.query('screen-xs')) {
          elBackgroundPos = -(itemPos.top / viewHeight) * 80;
        }

        elBackgroundPos += 80;

        if (elBackgroundPos < 0) {
          elBackgroundPos = 0;
        }

        if (elBackgroundPos > 100) {
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
        var initParalax = function () {
          startParallax(angular.element(elem).find('.card.lg,.card.sm'));
          var cards = angular.element(elem).find('.card');
          for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            angular.element(card).on('inview', function (event, isInView) {
              var cardElement = angular.element(event.currentTarget);

              if (isInView) {
                if (cardElement.hasClass('lg') || cardElement.hasClass('sm'))
                  cardsInView.push(event.currentTarget);
                cardElement.addClass('visible');
              } else {
                var locationInView = cardsInView.indexOf(event.currentTarget);
                cardElement.removeClass('visible');
                if (locationInView != -1 && (cardElement.hasClass('lg') || cardElement.hasClass('sm')))
                  cardsInView.splice(locationInView, 1);
              }
            });
          }
        };

        initParalax();

        scope.$watch(function (scope) {
          return scope.loadedCards.length
        }, function () {
          initParalax();
        });
        $document.bind('scroll', function () {
          if (cardsInView.length)
            startParallax(cardsInView);
        });
      }, isOldIE ? 1500 : 0);

    }
  }]);

(function () {
  'use strict';
  /** @ngInject */
  angular
    .module('lhr70')
    .directive('onFinishRender', ["$timeout", function ($timeout) {
      return {
        restrict: 'A',
        link: function (scope) {
          if (scope.$last === true) {
            $timeout(function () {
              scope.$emit('ngRepeatFinished');
            });
          }
        }
      }
    }])

  })();

(function () {
  'use strict';

  angular
    .module('lhr70')
    .directive('pageContent', pageContent);

  function pageContent() {
    PageContentController.$inject = ["$scope", "$sce"];
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/pageContent/pageContent.directive.html',
      scope: {
        page: '='
      },
      controller: PageContentController,
      controllerAs: 'vm',
      bindToController: true
    };

    /** @ngInject */
    function PageContentController($scope, $sce) {
      $scope.getSafeContent = function(content) {
        return $sce.trustAsResourceUrl(content);
      }
    }

    return directive;
  }
})();

(function () {
  'use strict';

  angular
    .module('lhr70')
    .directive('navbar', acmeNavbar);

  function acmeNavbar() {
    NavbarController.$inject = ["$timeout", "$scope", "$rootScope", "$location"];
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
    function NavbarController($timeout, $scope, $rootScope, $location) {

      var navbar = angular.element('.navbar');

      /**
       *  set behaviour for story page
       *
       *  @method setStoryPage
       */
      function setPages() {
        var locationPath = $location.path().split('/');
        var locationMain = locationPath[1];
        var locationSub = locationPath[2];

        $scope.navAlwaysVisible = locationMain === 'story' && locationSub !== 'submit' || locationMain === 'gift' || locationMain === 'page';

        $scope.isHomePage = locationMain === '';
        $scope.isStoryPage = locationMain === 'story' && locationSub !== 'submit';
        $scope.isGiftPage = locationMain === 'gifts';
        $scope.isHowItWorksPage = locationMain == 'page' && locationSub == 'how-it-works';
        $scope.isTOC = locationMain == 'page' && locationSub == 'terms';


        if ($scope.navAlwaysVisible) {
          navbar.addClass('visible');
        } else {
          $timeout(function () {
            if (!$scope.navAlwaysVisible) {
              if(isOldIE) {
                $timeout(function () {
                  handleInViewBehaviour();
                },1500);
              } else {
                handleInViewBehaviour();
              }
            }
          }, 100);
        }
      }

      /**
       *  set show hide of nav (only for non story pages)
       *
       *  @method handleInViewBehaviour
       */
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

      /**
       *  handle title visibility for story page
       *
       *  @method handleStoryVisibility
       */
      function handleStoryVisibility() {
        var deregisterationCallback = $rootScope.$on('STORY_SHOW_TITLE_IN_NAV', function (ev, visible) {
          if (visible) {
            navbar.addClass('has-story-info');
          } else {
            navbar.removeClass('has-story-info');
          }
        });

        $rootScope.$on('$destroy', deregisterationCallback);
      }

      /**
       *  update story title
       *
       *  @method handleStoryInfoBehaviour
       */
      function updateStoryTitle() {
        // get title from navigation
        var deregisterationCallback = $rootScope.$on('STORY_TITLE_CHANGE', function (ev, args) {
          $scope.storyInfo = args;
        });

        $rootScope.$on('$destroy', deregisterationCallback);
      }

      /**
       *  initialise navigation
       *
       *  @method init
       */
      function init() {

        setPages();
        handleStoryVisibility();


        $timeout(function () {
          if (!$scope.navAlwaysVisible) {
            handleInViewBehaviour();
          }
        }, 100);

        updateStoryTitle();
      }

      var deregisterationCallback3 = $rootScope.$on('$stateChangeStart',
        function (event, toState) {
          navbar.addClass('is-transitioning');

          if (toState.name === 'gifts' || toState.name === 'home' || toState.name === 'storySubmit') {
            navbar.removeClass('visible');
          }
        }
      );

      var deregisterationCallback2 = $rootScope.$on('$stateChangeSuccess',
        function () {
          $timeout(function () {
            navbar.removeClass('is-transitioning');
          }, 100);
          init();
        }
      );

      $rootScope.$on('$destroy', deregisterationCallback2);
      $rootScope.$on('$destroy', deregisterationCallback3);

      init();

    }
  }

})();

(function () {
  'use strict';

  angular
    .module('lhr70')
    .directive('menu', menu);

  function menu() {
    MenuController.$inject = ["$scope", "$rootScope", "$location", "$timeout"];
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/menu/menu.html',
      scope: {},
      controller: MenuController
    };

    return directive;

    /** @ngInject */
    function MenuController($scope, $rootScope, $location, $timeout) {

      var body = angular.element('.menu-body');
      var element = angular.element('.menu');
      $scope.active = false;

      /**
       *  toggle menu
       *
       *  @method toggleMenu
       */
      $scope.toggleMenu = function () {
        element.toggleClass('is-active');
        body.toggleClass('has-active-menu');
        $scope.active = !$scope.active;
      };

      var resetMenu = function () {
        var locationPath = $location.path().split('/');
        var locationMain = locationPath[1];

        $scope.isHomePage = locationMain === 'home';
        $scope.isGiftsPage = locationMain === 'gifts';
      };

      /**
       *  close menu
       *
       *  @method closeMenu
       */
      $scope.closeMenu = function () {
        body.removeClass('has-active-menu');
        element.removeClass('is-active');
        $scope.active = false;
      };

      function detectClickOutside() {
        angular.element(document).click(function (event) {
          if (!angular.element(event.target).closest('.menu').length && !angular.element(event.target).is('.menu')) {
            if (element.hasClass('is-active')) {
              $scope.closeMenu();
              $scope.$apply();
            }
          }
        })
      }

      $scope.focusToMenu = function (event) {
        if (event.keyCode == 9) {
          $scope.toggleMenu();
        }
      };

      /**
       *  initialise menu
       *
       *  @method init
       */
      function init() {
        resetMenu();
        detectClickOutside();
      }

      var deregisterationCallback = $rootScope.$on('$stateChangeSuccess',
        function () {
          $scope.closeMenu();
          init();
          resetMenu();
        }
      );

      $rootScope.$on('$destroy', deregisterationCallback);

      init();

    }
  }

})();

// Code here will be linted with JSHint.
/*eslint-disable */

(function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var a = typeof require == "function" && require;
        if (!u && a)return a(o, !0);
        if (i)return i(o, !0);
        var f = new Error("Cannot find module '" + o + "'");
        throw f.code = "MODULE_NOT_FOUND", f
      }
      var l = n[o] = {exports: {}};
      t[o][0].call(l.exports, function (e) {
        var n = t[o][1][e];
        return s(n ? n : e)
      }, l, l.exports, e, t, n, r)
    }
    return n[o].exports
  }

  var i = typeof require == "function" && require;
  for (var o = 0; o < r.length; o++)s(r[o]);
  return s
})({
  1: [function (require, module, exports) {

    /*

     MasonJS
     Author: Drew Dahlman - Edited by Krish Joshi
     Version: 2.0.3
     License: MIT

     Copyright (c) 2015 Drew Dahlman

     Permission is hereby granted, free of charge, to any person obtaining
     a copy of this software and associated documentation files (the
     "Software"), to deal in the Software without restriction, including
     without limitation the rights to use, copy, modify, merge, publish,
     distribute, sublicense, and/or sell copies of the Software, and to
     permit persons to whom the Software is furnished to do so, subject to
     the following conditions:

     The above copyright notice and this permission notice shall be
     included in all copies or substantial portions of the Software.

     THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
     EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
     MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
     NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
     LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
     OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
     WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

     Krish's edit
     To fit our grid and margins, I've changed the script such that on mobile it will make the width of the cards
     30px smaller then the window, which gives an illusion that we have a fixed margin
     */
    (function ($) {
      return $.fn.mason = function (options, complete) {
        var $self, callback, debug_elements, defaults, elements, mason_clear, relayout;
        defaults = {
          itemSelector: '',
          ratio: 0,
          sizes: [],
          columns: [[0, 480, 1], [480, 780, 2], [780, 1080, 3], [1080, 1320, 4], [1320, 1680, 5]],
          promoted: [],
          filler: {
            itemSelector: options.itemSelector,
            filler_class: 'mason_filler',
            keepDataAndEvents: false
          },
          randomSizes: false,
          randomFillers: false,
          layout: 'none',
          gutter: 0,
          debug: false
        };
        $self = null;
        debug_elements = {
          container: $("<div id='debug'></div>"),
          block: "<div class='mason-debug' style='background-color: rgba(244, 67, 54, .5); float: left;'></div>"
        };
        mason_clear = "<div class='mason_clear' style='clear:both; position:relative;'></div>";
        if (complete) {
          callback = {
            complete: complete
          };
        }
        elements = {
          block: {
            height: 0,
            width: 0
          },
          matrix: [],
          startWidth: 0
        };
        this.each(function () {
          var callbacks, columnSize, debug, layBricks, mason, resize, settings, setup, sizeElements, cache;
          settings = $.extend(defaults, options);
          callbacks = $.extend(callback, complete);
          $self = $(this);
          cache = [];
          setup = function () {
            if (settings.debug) {
              console.log("SETUP");
            }
            if ($self.children(".mason_clear").length < 1) {
              $self.append(mason_clear);
            }
            elements.block.height = Math.round(parseFloat(($self.width() / columnSize()) / settings.ratio)).toFixed(2);
            elements.block.width = Math.round(parseFloat($self.width() / columnSize())).toFixed(2);
            elements.startWidth = $self.width();
            sizeElements();
            relayout = setup;
            if (settings.debug) {
              console.log("############## Running In Debug Mode ##############");
              return debug();
            }
          };
          sizeElements = function () {
            var $block;
            if (columnSize() === 1) {
              function setNewMargins() {
                $self.children("" + settings.itemSelector, "." + settings.filler.filler_class).each(function () {
                  $block = $(this);
                  var width = $(window).width() - 30;


                  var cta = $block;
                  if (cta.hasClass('gftLg')) {
                    cta.css('height', width + 75 + 'px');
                  } else {
                    cta.css('height', width + 'px');
                  }
                  cta.css('width', width + 'px');
                  cta.css('margin', '15px');
                });
              }

              setNewMargins();
              if (typeof callbacks.complete !== "undefined") {
                return callbacks.complete();
              }
            } else {
              $self.children("" + settings.itemSelector, "." + settings.filler.filler_class).each(function () {
                var h, p, promoted, promoted_size, ran, size, w;
                $block = $(this);
                p = 0;
                promoted = false;
                promoted_size = 0;
                while (p < settings.promoted.length) {
                  if ($block.hasClass(settings.promoted[p][0])) {
                    promoted = true;
                    promoted_size = p;
                  }
                  p++;
                }
                if (promoted) {
                  size = settings.promoted[promoted_size];
                  $block.data('size', promoted_size);
                  $block.data('promoted', true);
                  h = parseFloat(elements.block.height * size[2]).toFixed(0);
                  h = h - (settings.gutter * 2);
                  w = parseFloat(elements.block.width * size[1]).toFixed(0);
                  w = w - (settings.gutter * 2);
                } else {
                  ran = Math.floor(Math.random() * settings.sizes.length);
                  size = settings.sizes[ran];
                  $block.data('size', ran);
                  h = parseFloat(elements.block.height * size[1]).toFixed(0);
                  h = h - (settings.gutter * 2);
                  w = parseFloat(elements.block.width * size[0]).toFixed(0);
                  w = w - (settings.gutter * 2);
                }
                $block.height(h + 'px');
                $block.width(w - 5 + 'px');
                return $block.css({
                  'margin': settings.gutter
                });
              });
              return mason();
            }
          };
          mason = function () {
            var block_h, c, col, el_h, r;
            col = columnSize();
            el_h = $self.height();
            block_h = Math.round(el_h / elements.block.height);
            elements.matrix = [];
            r = 0;
            while (r < block_h) {
              elements.matrix[r] = [];
              c = 0;
              while (c < col) {
                elements.matrix[r][c] = false;
                c++;
              }
              r++;
            }
            $self.children("" + settings.itemSelector).each(function () {
              var $block, a, bh, bw, h, l, results, s, t, w;
              $block = $(this);
              l = Math.round($block.position().left / elements.block.width);
              t = Math.round($block.position().top / elements.block.height);
              s = parseFloat($block.data('size'));
              if ($block.data('promoted')) {
                h = settings.promoted[s][2];
                w = settings.promoted[s][1];
                a = h * w;
              } else {
                h = settings.sizes[s][1];
                w = settings.sizes[s][0];
                a = h * w;
              }
              r = 0;
              results = [];
              while (r < a) {
                bh = 0;
                while (bh < h) {
                  bw = 0;
                  elements.matrix[t + bh][l] = true;
                  while (bw < w) {
                    elements.matrix[t + bh][l + bw] = true;
                    bw++;
                  }
                  bh++;
                }
                results.push(r++);
              }
              return results;
            });
            return layBricks();
          };
          layBricks = function () {
            var $filler, c, filler_index, filler_total, h, r, w, x, y;
            r = 0;
            filler_total = $("" + settings.filler.itemSelector).not("." + settings.filler.filler_class).length;
            filler_index = -1;
            while (r < elements.matrix.length) {
              c = 0;
              while (c < elements.matrix[r].length) {
                if (!elements.matrix[r][c]) {
                  h = elements.block.height;
                  w = elements.block.width;
                  x = (r * h) + settings.gutter;
                  y = (c * w) + settings.gutter;
                  h = h - settings.gutter * 2;
                  w = w - settings.gutter * 2;
                  if (settings.randomFillers) {
                    filler_index = Math.floor(Math.random() * filler_total);
                  } else {
                    if (filler_index < filler_total) {
                      filler_index++;
                    }
                    if (filler_index === filler_total) {
                      filler_index = 0;
                    }
                  }
                  $filler = $("" + settings.filler.itemSelector).not("." + settings.filler.filler_class).eq(filler_index).clone(settings.filler.keepDataAndEvents);
                  $filler.addClass(settings.filler.filler_class);
                  $filler.css({
                    position: 'absolute',
                    top: x + 'px',
                    left: y + 'px',
                    height: h + 'px',
                    width: w + 'px',
                    margin: '0px'
                  });
                  $filler.appendTo($self);
                }
                c++;
              }
              r++;
            }
            if ($self.width() < elements.startWidth) {
              return $(window, $self).trigger('resize');
            } else {
              if (typeof callbacks.complete !== "undefined") {
                return callbacks.complete();
              }
            }
          };
          columnSize = function () {
            var cols, colsCount, i, w;
            w = parseFloat($self.width());
            cols = 0;
            colsCount = settings.columns.length - 1;
            if (w >= settings.columns[colsCount[1]]) {
              cols = settings.columns[colsCount[2]];
            } else {
              i = 0;
              while (i <= colsCount) {
                if (w > settings.columns[i][0] && settings.columns[i][1]) {
                  cols = settings.columns[i][2];
                }
                i++;
              }
            }
            return Math.floor(cols);
          };
          debug = function () {
            var $debug, block, block_h, c, col, el_h, i;
            $debug = $self.parent();
            col = columnSize();
            el_h = $self.height();
            block_h = el_h / elements.block.height;
            debug_elements.container.css({
              position: 'absolute',
              top: '0',
              left: '0',
              height: $self.height(),
              width: $self.width()
            });
            i = 0;
            while (i < block_h) {
              c = 0;
              while (c < col) {
                block = $(debug_elements.block);
                block.css({
                  height: elements.block.height - (settings.gutter * 2),
                  width: elements.block.width - (settings.gutter * 2),
                  margin: settings.gutter
                });
                debug_elements.container.append(block);
                c++;
              }
              i++;
            }
            debug_elements.container.append(mason_clear);
            return $debug.prepend(debug_elements.container);
          };
          if (settings.layout === "fluid") {
            resize = null;
            var width = $(window).width();
            $(window, $self).on('resize', (function (_this) {
              return function (event) {
                if (width !== $(window).width()) {
                  width = $(window).width();
                  $("." + settings.filler.filler_class).remove();
                  elements.matrix = [];
                  clearTimeout(resize);
                  resize = null;
                  return resize = setTimeout(function () {
                    return setup();
                  }, 0);
                }
              };
            })(this));
          }
          return setup();
        });
        return {
          destroy: function () {
            return $(window, $self).off('resize');
          },
          relayout: function () {
            relayout();
          }
        };
      };
    })(jQuery);


  }, {}]
}, {}, [1]);
// Code here will be ignored by JSHint.
/*eslint-enable */

/**
 * @ngdoc directive
 * @name lhr70:masonDirective
 *
 * @description
 *
 *
 * @restrict A
 * */

/** @ngInject */
angular.module('lhr70')
  .directive('masonaryGrid', ["$log", "$timeout", "$media", function ($log, $timeout, $media) {
      return function (scope, elem) {
        var setInfoPosition = function () {
          var screenWidth = angular.element(window).width();
          var colWidth = angular.element(".card.gftLg:first").width() / 7;

          angular.element('.jig-grid').removeClass('grid-loaded');
          angular.element('.loader').removeClass('loaded');

          var computeBlockSize = function () {
            var sizes = {};
            if ($media.query('tablet')) {
              sizes.largeBlock = {
                'width': ((colWidth * 5) - 5).toString() + "px",
                'height': (colWidth * 2).toString() + "px"
              };
              sizes.smallBlock = {
                'width': ((colWidth * 4)).toString() + "px",
                'height': (colWidth * 2 + 4).toString() + "px"
              };

              sizes.contentBlock = {'height': (colWidth + 2).toString() + "px"};
              sizes.ctaBlock = {'padding-top': (colWidth * 1.5).toString() + 'px'};
              sizes.ctaBorder = {'width': ((colWidth * 4)).toString() + "px"};
              sizes.firstBlock = {'top': (colWidth).toString() + 'px'};
            } else {
              sizes.largeBlock = {
                'width': ((colWidth * 5)).toString() + "px",
                'height': ((colWidth * 2) - 6).toString() + "px"
              };
              sizes.smallBlock = {
                'width': ((colWidth * 5)).toString() + "px",
                'height': (colWidth * 2).toString() + "px"
              };
              sizes.ctaBlock = {'padding-top': (colWidth * 2.5).toString() + 'px'};
              sizes.ctaBorder = {'width': "100%"};
              sizes.firstBlock = {'top': 0 + 'px'};
            }
            return sizes;
          };


          var sizes = computeBlockSize();

          jss.set('.lg .story--copy', sizes.largeBlock);
          jss.set('.sm .story--copy', sizes.smallBlock);
          jss.set('.lg .content, .sm .content', sizes.contentBlock);
          jss.set('.cta,.gftCta', sizes.ctaBlock);
          jss.set('.cta-border', sizes.ctaBorder);
          jss.set('.lg .story--copy', sizes.largeBlock);
          jss.set('.homepage .jig-grid:nth-child(1) .card:nth-child(1)', sizes.firstBlock);


          angular.element('.jig-grid').addClass('grid-loaded');
          angular.element('.loader').addClass('loaded');

          $timeout(function () {
            var ctas = angular.element(".card.cta,.card.gftCta");

            // This is to set the margin on mobile as masonary doesn't support the mobile layout we want
            function setNewMargins() {
              var cards = angular.element(".card");
              var width = screenWidth - 30;

              for (var i = 0; i < cards.length; i++) {
                var card = angular.element(cards[i]);
                if (i == 0 && card.hasClass('gftLg') || i == 0 && card.hasClass('gftHero')) {
                  card.css('height', width + 75 + 'px');
                } else {
                  card.css('height', width + 'px');
                }
                card.css('width', width + 'px');
                card.css('margin', '15px');
              }
            }

            //var cards = angular.element(".card.gftSm");
            //
            //for (var i = 0; i < cards.length; i++) {
            //  var card = angular.element(cards[i]);
            //  card.width(card.width() - (i % 2 ? 1 : 2));
            //}

            // Set position of CTAs in the grid
            if ($media.query('tablet')) {
              screenWidth = screenWidth > 1200 ? 1200 : screenWidth;

              var width = screenWidth / 2;

              var threshold = {
                left: width - (width * 0.55),
                right: width
              };

              for (var i = 0; i < ctas.length; i++) {
                var cta = angular.element(ctas[i]);
                cta.width(cta.width() - 18);
                cta.height(cta.height() - 65);

                var ctaPosition = cta.position();

                // if the cta is in middle of the page, move it left, and move it again if it's still in middle
                // , if it still doesn't work, remove it  (written at late hours, I cannot grammar)
                if (ctaPosition.left > threshold.left && ctaPosition.left < threshold.right) {
                  if (i < ctas.length) {
                    var nextElement = cta.next();
                    if (ctaPosition.top == ctaPosition.top) {
                      nextElement.insertBefore(cta);
                      ctaPosition = cta.position();
                      if (ctaPosition.left > threshold.left && ctaPosition.left < threshold.right) {
                        cta.remove();
                      }
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
              ctas.addClass('right');
              setNewMargins()
            }
          }, 50);
        };

        var currentMason;
        scope.$watch(function (scope) {
            return scope.loadedCards.length
          }, function () {
            $timeout(function () {
              if (typeof(currentMason) != 'undefined') {
                setInfoPosition();
                currentMason.relayout();
              } else {
                currentMason = angular.element(elem).mason({
                  itemSelector: '.card',
                  ratio: 1,
                  promoted: [
                    ['lg', 7, 7],
                    ['sm', 5, 6],
                    ['qt', 4, 4],
                    ['sn', 5, 5],
                    ['cta', 2, 4],
                    ['gftCta', 2, 4],
                    ['gftHero', 12, 4],
                    ['gft', 4, 4],
                    ['gftLg', 7, 7],
                    ['gftSm', 4, 4]
                  ],
                  columns: [
                    [0, 608, 1],
                    [608, 1680, 12]
                  ],
                  filler: {
                    itemSelector: '.filler',
                    filler_class: 'mason-filler'
                  },
                  gutter: 5,
                  layout: 'fluid'
                }, setInfoPosition);
              }
            }, 100);
          }
        );
      }
    }]
  )
;

/**
 * @ngdoc directive
 * @name lhr70:imageCropperDirective
 *
 * @description
 *
 *
 * @restrict A
 * */

/* ng-infinite-scroll - v1.0.0 - 2013-02-23 */

/** @ngInject */
angular.module('lhr70')
  .directive('infiniteScroll', [
    '$rootScope', '$window', '$timeout', function($rootScope, $window, $timeout) {
      return {
        link: function(scope, elem, attrs) {
          var checkWhenEnabled, handler, scrollDistance, scrollEnabled;
          $window = angular.element($window);
          scrollDistance = 0;
          if (attrs.infiniteScrollDistance != null) {
            scope.$watch(attrs.infiniteScrollDistance, function(value) {
              return scrollDistance = parseInt(value, 10);
            });
          }
          scrollEnabled = true;
          checkWhenEnabled = false;
          if (attrs.infiniteScrollDisabled != null) {
            scope.$watch(attrs.infiniteScrollDisabled, function(value) {
              scrollEnabled = !value;
              if (scrollEnabled && checkWhenEnabled) {
                checkWhenEnabled = false;
                return handler();
              }
            });
          }
          handler = function() {
            var elementBottom, remaining, shouldScroll, windowBottom;
            windowBottom = $window.height() + $window.scrollTop();
            elementBottom = elem.offset().top + elem.height();
            remaining = elementBottom - windowBottom;
            shouldScroll = remaining <= $window.height() * scrollDistance;
            if (shouldScroll && scrollEnabled) {
              if ($rootScope.$$phase) {
                return scope.$eval(attrs.infiniteScroll);
              } else {
                return scope.$apply(attrs.infiniteScroll);
              }
            } else if (shouldScroll) {
              return checkWhenEnabled = true;
            }
          };
          $window.on('scroll', handler);
          scope.$on('$destroy', function() {
            return $window.off('scroll', handler);
          });
          return $timeout((function() {
            if (attrs.infiniteScrollImmediateCheck) {
              if (scope.$eval(attrs.infiniteScrollImmediateCheck)) {
                return handler();
              }
            } else {
              return handler();
            }
          }), 0);
        }
      };
    }
  ]);

/**
 * @ngdoc directive
 * @name lhr70:imageCropperDirective
 *
 * @description
 *
 *
 * @restrict A
 * */

/** @ngInject */
angular.module('lhr70')
  .directive('imageCropper', function () {
    return {
      restrict: 'A',
      scope: {
        source: '=',
        type: '='
      },
      link: function (scope, elem) {
        var startCropping = function (watcher) {
          var canvas = angular.element('<canvas></canvas>')[0];
          var ctx = canvas.getContext('2d');
          var img = angular.element('<img></img>')[0];
          img.setAttribute('crossOrigin', 'anonymous');
          img.src = scope.source;
          // When the image is loaded, draw it
          img.onload = function () {
            var height = img.height;
            var width = img.width;
            canvas.height = scope.type == 'header-image' ? height * 0.86 : height;
            canvas.width = scope.type == 'header-image' ? width * 0.86 : width;

            // Save the state, so we can undo the clipping
            ctx.save();
            ctx.beginPath();
            if (scope.type == 'gftLg') {
              ctx.moveTo(width * 0.1, 0);
              ctx.lineTo(width * 0.28, height * 0.8);
              ctx.lineTo(width * 0.76, height);
              ctx.lineTo(width, height * 0.70);
              ctx.lineTo(width, 0);
            } else if (scope.type == 'header-image') {
              ctx.moveTo(width * 0.13, 0);
              ctx.lineTo(width * 0.24, height * 0.60);
              ctx.lineTo(width * 0.76, height * 0.85);
              ctx.lineTo(width, height * 0.45);
              ctx.lineTo(width, 0);
            } else {
              ctx.moveTo(width * 0.025, 0);
              ctx.lineTo(width * 0.16, height * 0.7);
              ctx.lineTo(width * 0.83, height);
              ctx.lineTo(width, height * 0.8);
              ctx.lineTo(width, 0);
            }

            ctx.closePath();

            // Clip to the current path
            ctx.clip();

            if (scope.type == 'header-image') {
              var sourceX = 0;
              var sourceY = 0;
              var sourceWidth = width;
              var sourceHeight = height;
              var destWidth = sourceWidth * 0.86;
              var destHeight = sourceHeight * 0.86;
              var destX = 0;
              var destY = 0;
              ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
            } else {
              ctx.drawImage(img, 0, 0);
            }

            // Undo the clipping
            ctx.restore();
            if (scope.type == 'header-image') {
              elem[0].src = canvas.toDataURL("image/png", 50);
            } else {
              elem[0].src = canvas.toDataURL("image/png", 10);
            }
            angular.element(elem[0]).data('cropperAdded', true);
            watcher();
          }
        };

        var watcher = scope.$watch(function () {
          return scope.source;
        }, function (source) {
          if (typeof(source) !== 'undefined') {
            startCropping(watcher);
            // destroy the watcher
          }
        });
      }
    };
  });

(function () {
  'use strict';

  angular
    .module('lhr70')
    .directive('giftsBlock', giftsBlock);

  function giftsBlock() {
    GiftsController.$inject = ["$scope"];
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
    function GiftsController($scope) {
      var vm = this;
      var itemsToLoad = 15;
      $scope.loadedCards = vm.cards.splice(0, itemsToLoad+1);

      $scope.loadMore = function () {
        if(vm.cards.length){
          var itemsToadd = vm.cards.splice(0, itemsToLoad);
          $scope.loadedCards = $scope.loadedCards.concat(itemsToadd);
        }
      };
    }

    return directive;
  }
})();



(function () {
  'use strict';

  angular
    .module('lhr70')
    .directive('giftHeader', giftHeader);

  /** @ngInject */
  function giftHeader() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/giftHeader/giftHeader.directive.html',
      scope: {
        image: '=',
        logo: '='
      },
      controller: GiftHeaderController
    };

    function GiftHeaderController() {
      // TODO
    }

    return directive;
  }
})();

(function () {
  'use strict';

  angular
    .module('lhr70')
    .directive('giftContent', giftContent);

  function giftContent() {
    GiftContentController.$inject = ["$scope", "$sce", "$rootScope"];
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/giftContent/giftContent.directive.html',
      scope: {
        gift: '='
      },
      controller: GiftContentController,
      controllerAs: 'vm',
      bindToController: true
    };

    /** @ngInject */
    function GiftContentController($scope, $sce, $rootScope) {
      $scope.hasField = function(field) {
        return field && field.length > 0;
      }

      $scope.getSoundcloudUrl = function(id) {
        return $sce.trustAsResourceUrl("https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/" + id +
                "&amp;color=350083&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false");
      }

      var handleTitleInView = function() {
        angular.element('.gift-title').on('inview', function (event, isInView) {
          $rootScope.$broadcast('STORY_SHOW_TITLE_IN_NAV', !isInView);
        });
      }

      handleTitleInView();
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
    .directive('cookieConsent', cookieConsent);

  /** @ngInject */
  function cookieConsent() {
    CookieConsentController.$inject = ["$cookies"];
    var directive = {
      restrict: 'A',
      templateUrl: 'app/components/cookieConsent/cookieConsent.directive.html',
      scope: {},
      controller: CookieConsentController,
      controllerAs: 'vm',
      bindToController: true
    };

    /** @ngInject */
    function CookieConsentController($cookies) {
      var vm = this;

      var $element = angular.element('.cookie-consent');

      vm.showCookieConsent = function () {
        var cookie = $cookies.get('cookieConsent');
        return cookie === "y";
      };

      vm.closePanel = function () {
        var now = new Date(), exp = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());

        $cookies.put('cookieConsent', 'y', {
          expires: exp
        });

        $element.hide('slow');
      };
    }

    return directive;
  }
})();

(function () {
  'use strict';

  angular
    .module('lhr70')
    .directive('carousel', carousel);

  function carousel() {
    CarouselController.$inject = ["$scope", "$timeout"];
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/carousel/carousel.directive.html',
      scope: {
        images: '='
      },
      controller: CarouselController
    };

    /** @ngInject */
    function CarouselController($scope, $timeout) {

      $scope.isLastElement = function() {
        return $scope.currentSlide === $scope.images.length - 1;
      }

      $scope.isFirstElement = function() {
        return $scope.currentSlide === 0;
      }

      var initCarousel = function() {
        var c = angular.element('.carousel-inner').slick({
          prevArrow: angular.element('.carousel-prev'),
          nextArrow: angular.element('.carousel-next'),
          infinite: false
        });

        c.on('beforeChange', function(event, slick, currentSlide, nextSlide) {

          updatePage(nextSlide);

        });
      }

      var updatePage = function(newPage) {
        angular.element('.carousel-current').addClass('is-animating');

        $timeout(function() {

          $scope.currentSlide = newPage;
          $scope.$apply();
          angular.element('.carousel-current').removeClass('is-animating');

        }, 300);
      }

      var init = function() {
        $scope.currentSlide = 0;

        $scope.$on('ngRepeatFinished', function() {
          initCarousel();
        });
      }

      init();
    }

    return directive;
  }
})();

(function () {
  'use strict';

  angular
    .module('lhr70')
    .directive('cardsBlock', cardsBlock);

  function cardsBlock() {
    CardsController.$inject = ["$scope"];
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
    function CardsController($scope) {
      var vm = this;
      $scope.loadedCards = vm.cards.splice(0, 20);
      $scope.isStory = function (card) {
        return card.className == 'qt' || card.className == 'sn' || card.className == 'cta' ||
          card.className == 'gftCta' || card.className == 'sm' || card.className == 'lg';
      };

      $scope.isGift = function (card) {
        return card.className == 'gft' || card.className == 'gftLg' ||
          card.className == 'gftSm' || card.className == 'gftHero';
      };

      $scope.getUrl = function (card) {
        return card.className === "gftCta" ? "/gifts" :
          card.className === "cta" ? "/story/submit" :
            $scope.isGift(card) ? "/gift/" + card.slug :
            "/story/" + card.slug
      };

      $scope.loadMore = function () {
        if(vm.cards.length){
          var itemsToadd = vm.cards.splice(0, 20);
          $scope.loadedCards = $scope.loadedCards.concat(itemsToadd);
        }
      };
    }

    return directive;
  }
})();

(function () {
  'use strict';

  angular
    .module('lhr70')
    .directive('storyBlock', storyBlock);

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
        gift: '=',
        color: '='
      },
      controller: GiftController,
      controllerAs: 'vm',
      bindToController: true
    };

    /** @ngInject */
    function GiftController() {
      var vm = this;
      vm.isGiftsPage = angular.element('.page-gifts').length;
    }

    return directive;
  }
})();

(function () {
  'use strict';

  angular
    .module('lhr70')
    .directive('giftHeroBlock', giftHeroBlock);

  /** @ngInject */
  function giftHeroBlock() {
    var directive = {
      restrict: 'EA',
      templateUrl: 'app/components/cardGiftHero/giftHero.directive.html',
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
        story: '=',
        block: '='
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
        type: '=',
        href: "=",
        title: "=",
        copy: "="
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

/*
 * Modernizr tests which native CSS3 and HTML5 features are available in the
 * current UA and makes the results available to you in two ways: as properties on
 * a global `Modernizr` object, and as classes on the `<html>` element. This
 * information allows you to progressively enhance your pages with a granular level
 * of control over the experience.
*/

;(function(window, document, undefined){
  var tests = [];
  

  /**
   *
   * ModernizrProto is the constructor for Modernizr
   *
   * @class
   * @access public
   */

  var ModernizrProto = {
    // The current version, dummy
    _version: '3.3.1',

    // Any settings that don't work as separate modules
    // can go in here as configuration.
    _config: {
      'classPrefix': "supports-",
      'enableClasses': true,
      'enableJSClass': true,
      'usePrefixes': true
    },

    // Queue of tests
    _q: [],

    // Stub these for people who are listening
    on: function(test, cb) {
      // I don't really think people should do this, but we can
      // safe guard it a bit.
      // -- NOTE:: this gets WAY overridden in src/addTest for actual async tests.
      // This is in case people listen to synchronous tests. I would leave it out,
      // but the code to *disallow* sync tests in the real version of this
      // function is actually larger than this.
      var self = this;
      setTimeout(function() {
        cb(self[test]);
      }, 0);
    },

    addTest: function(name, fn, options) {
      tests.push({name: name, fn: fn, options: options});
    },

    addAsyncTest: function(fn) {
      tests.push({name: null, fn: fn});
    }
  };

  

  // Fake some of Object.create so we can force non test results to be non "own" properties.
  var Modernizr = function() {};
  Modernizr.prototype = ModernizrProto;

  // Leak modernizr globally when you `require` it rather than force it here.
  // Overwrite name so constructor name is nicer :D
  Modernizr = new Modernizr();

  

  var classes = [];
  

  /**
   * is returns a boolean if the typeof an obj is exactly type.
   *
   * @access private
   * @function is
   * @param {*} obj - A thing we want to check the type of
   * @param {string} type - A string to compare the typeof against
   * @returns {boolean}
   */

  function is(obj, type) {
    return typeof obj === type;
  }
  ;

  /**
   * Run through all tests and detect their support in the current UA.
   *
   * @access private
   */

  function testRunner() {
    var featureNames;
    var feature;
    var aliasIdx;
    var result;
    var nameIdx;
    var featureName;
    var featureNameSplit;

    for (var featureIdx in tests) {
      if (tests.hasOwnProperty(featureIdx)) {
        featureNames = [];
        feature = tests[featureIdx];
        // run the test, throw the return value into the Modernizr,
        // then based on that boolean, define an appropriate className
        // and push it into an array of classes we'll join later.
        //
        // If there is no name, it's an 'async' test that is run,
        // but not directly added to the object. That should
        // be done with a post-run addTest call.
        if (feature.name) {
          featureNames.push(feature.name.toLowerCase());

          if (feature.options && feature.options.aliases && feature.options.aliases.length) {
            // Add all the aliases into the names list
            for (aliasIdx = 0; aliasIdx < feature.options.aliases.length; aliasIdx++) {
              featureNames.push(feature.options.aliases[aliasIdx].toLowerCase());
            }
          }
        }

        // Run the test, or use the raw value if it's not a function
        result = is(feature.fn, 'function') ? feature.fn() : feature.fn;


        // Set each of the names on the Modernizr object
        for (nameIdx = 0; nameIdx < featureNames.length; nameIdx++) {
          featureName = featureNames[nameIdx];
          // Support dot properties as sub tests. We don't do checking to make sure
          // that the implied parent tests have been added. You must call them in
          // order (either in the test, or make the parent test a dependency).
          //
          // Cap it to TWO to make the logic simple and because who needs that kind of subtesting
          // hashtag famous last words
          featureNameSplit = featureName.split('.');

          if (featureNameSplit.length === 1) {
            Modernizr[featureNameSplit[0]] = result;
          } else {
            // cast to a Boolean, if not one already
            /* jshint -W053 */
            if (Modernizr[featureNameSplit[0]] && !(Modernizr[featureNameSplit[0]] instanceof Boolean)) {
              Modernizr[featureNameSplit[0]] = new Boolean(Modernizr[featureNameSplit[0]]);
            }

            Modernizr[featureNameSplit[0]][featureNameSplit[1]] = result;
          }

          classes.push((result ? '' : 'no-') + featureNameSplit.join('-'));
        }
      }
    }
  }
  ;

  /**
   * docElement is a convenience wrapper to grab the root element of the document
   *
   * @access private
   * @returns {HTMLElement|SVGElement} The root element of the document
   */

  var docElement = document.documentElement;
  

  /**
   * A convenience helper to check if the document we are running in is an SVG document
   *
   * @access private
   * @returns {boolean}
   */

  var isSVG = docElement.nodeName.toLowerCase() === 'svg';
  

  /**
   * setClasses takes an array of class names and adds them to the root element
   *
   * @access private
   * @function setClasses
   * @param {string[]} classes - Array of class names
   */

  // Pass in an and array of class names, e.g.:
  //  ['no-webp', 'borderradius', ...]
  function setClasses(classes) {
    var className = docElement.className;
    var classPrefix = Modernizr._config.classPrefix || '';

    if (isSVG) {
      className = className.baseVal;
    }

    // Change `no-js` to `js` (independently of the `enableClasses` option)
    // Handle classPrefix on this too
    if (Modernizr._config.enableJSClass) {
      var reJS = new RegExp('(^|\\s)' + classPrefix + 'no-js(\\s|$)');
      className = className.replace(reJS, '$1' + classPrefix + 'js$2');
    }

    if (Modernizr._config.enableClasses) {
      // Add the new classes
      className += ' ' + classPrefix + classes.join(' ' + classPrefix);
      isSVG ? docElement.className.baseVal = className : docElement.className = className;
    }

  }

  ;

  /**
   * createElement is a convenience wrapper around document.createElement. Since we
   * use createElement all over the place, this allows for (slightly) smaller code
   * as well as abstracting away issues with creating elements in contexts other than
   * HTML documents (e.g. SVG documents).
   *
   * @access private
   * @function createElement
   * @returns {HTMLElement|SVGElement} An HTML or SVG element
   */

  function createElement() {
    if (typeof document.createElement !== 'function') {
      // This is the case in IE7, where the type of createElement is "object".
      // For this reason, we cannot call apply() as Object is not a Function.
      return document.createElement(arguments[0]);
    } else if (isSVG) {
      return document.createElementNS.call(document, 'http://www.w3.org/2000/svg', arguments[0]);
    } else {
      return document.createElement.apply(document, arguments);
    }
  }

  ;

  /**
   * since we have a fairly large number of input tests that don't mutate the input
   * we create a single element that can be shared with all of those tests for a
   * minor perf boost
   *
   * @access private
   * @returns {HTMLInputElement}
   */
  var inputElem = createElement('input');
  
/*!
{
  "name": "Input attributes",
  "property": "input",
  "tags": ["forms"],
  "authors": ["Mike Taylor"],
  "notes": [{
    "name": "WHATWG spec",
    "href": "https://html.spec.whatwg.org/multipage/forms.html#input-type-attr-summary"
  }],
  "knownBugs": ["Some blackberry devices report false positive for input.multiple"]
}
!*/
/* DOC
Detects support for HTML5 `<input>` element attributes and exposes Boolean subproperties with the results:

```javascript
Modernizr.input.autocomplete
Modernizr.input.autofocus
Modernizr.input.list
Modernizr.input.max
Modernizr.input.min
Modernizr.input.multiple
Modernizr.input.pattern
Modernizr.input.placeholder
Modernizr.input.required
Modernizr.input.step
```
*/

  // Run through HTML5's new input attributes to see if the UA understands any.
  // Mike Taylr has created a comprehensive resource for testing these attributes
  //   when applied to all input types:
  //   miketaylr.com/code/input-type-attr.html

  // Only input placeholder is tested while textarea's placeholder is not.
  // Currently Safari 4 and Opera 11 have support only for the input placeholder
  // Both tests are available in feature-detects/forms-placeholder.js

  var inputattrs = 'autocomplete autofocus list placeholder max min multiple pattern required step'.split(' ');
  var attrs = {};

  Modernizr.input = (function(props) {
    for (var i = 0, len = props.length; i < len; i++) {
      attrs[ props[i] ] = !!(props[i] in inputElem);
    }
    if (attrs.list) {
      // safari false positive's on datalist: webk.it/74252
      // see also github.com/Modernizr/Modernizr/issues/146
      attrs.list = !!(createElement('datalist') && window.HTMLDataListElement);
    }
    return attrs;
  })(inputattrs);


  /**
   * If the browsers follow the spec, then they would expose vendor-specific style as:
   *   elem.style.WebkitBorderRadius
   * instead of something like the following, which would be technically incorrect:
   *   elem.style.webkitBorderRadius

   * Webkit ghosts their properties in lowercase but Opera & Moz do not.
   * Microsoft uses a lowercase `ms` instead of the correct `Ms` in IE8+
   *   erik.eae.net/archives/2008/03/10/21.48.10/

   * More here: github.com/Modernizr/Modernizr/issues/issue/21
   *
   * @access private
   * @returns {string} The string representing the vendor-specific style properties
   */

  var omPrefixes = 'Moz O ms Webkit';
  

  /**
   * List of JavaScript DOM values used for tests
   *
   * @memberof Modernizr
   * @name Modernizr._domPrefixes
   * @optionName Modernizr._domPrefixes
   * @optionProp domPrefixes
   * @access public
   * @example
   *
   * Modernizr._domPrefixes is exactly the same as [_prefixes](#modernizr-_prefixes), but rather
   * than kebab-case properties, all properties are their Capitalized variant
   *
   * ```js
   * Modernizr._domPrefixes === [ "Moz", "O", "ms", "Webkit" ];
   * ```
   */

  var domPrefixes = (ModernizrProto._config.usePrefixes ? omPrefixes.toLowerCase().split(' ') : []);
  ModernizrProto._domPrefixes = domPrefixes;
  

  /**
   * Modernizr.hasEvent() detects support for a given event
   *
   * @memberof Modernizr
   * @name Modernizr.hasEvent
   * @optionName Modernizr.hasEvent()
   * @optionProp hasEvent
   * @access public
   * @function hasEvent
   * @param  {string|*} eventName - the name of an event to test for (e.g. "resize")
   * @param  {Element|string} [element=HTMLDivElement] - is the element|document|window|tagName to test on
   * @returns {boolean}
   * @example
   *  `Modernizr.hasEvent` lets you determine if the browser supports a supplied event.
   *  By default, it does this detection on a div element
   *
   * ```js
   *  hasEvent('blur') // true;
   * ```
   *
   * However, you are able to give an object as a second argument to hasEvent to
   * detect an event on something other than a div.
   *
   * ```js
   *  hasEvent('devicelight', window) // true;
   * ```
   *
   */

  var hasEvent = (function() {

    // Detect whether event support can be detected via `in`. Test on a DOM element
    // using the "blur" event b/c it should always exist. bit.ly/event-detection
    var needsFallback = !('onblur' in document.documentElement);

    function inner(eventName, element) {

      var isSupported;
      if (!eventName) { return false; }
      if (!element || typeof element === 'string') {
        element = createElement(element || 'div');
      }

      // Testing via the `in` operator is sufficient for modern browsers and IE.
      // When using `setAttribute`, IE skips "unload", WebKit skips "unload" and
      // "resize", whereas `in` "catches" those.
      eventName = 'on' + eventName;
      isSupported = eventName in element;

      // Fallback technique for old Firefox - bit.ly/event-detection
      if (!isSupported && needsFallback) {
        if (!element.setAttribute) {
          // Switch to generic element if it lacks `setAttribute`.
          // It could be the `document`, `window`, or something else.
          element = createElement('div');
        }

        element.setAttribute(eventName, '');
        isSupported = typeof element[eventName] === 'function';

        if (element[eventName] !== undefined) {
          // If property was created, "remove it" by setting value to `undefined`.
          element[eventName] = undefined;
        }
        element.removeAttribute(eventName);
      }

      return isSupported;
    }
    return inner;
  })();


  ModernizrProto.hasEvent = hasEvent;
  
/*!
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
/* DOC
Detects support for the DOM Pointer Events API, which provides a unified event interface for pointing input devices, as implemented in IE10+.
*/

  // **Test name hijacked!**
  // Now refers to W3C DOM PointerEvents spec rather than the CSS pointer-events property.
  Modernizr.addTest('pointerevents', function() {
    // Cannot use `.prefixed()` for events, so test each prefix
    var bool = false,
    i = domPrefixes.length;

    // Don't forget un-prefixed...
    bool = Modernizr.hasEvent('pointerdown');

    while (i-- && !bool) {
      if (hasEvent(domPrefixes[i] + 'pointerdown')) {
        bool = true;
      }
    }
    return bool;
  });

/*!
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

  var newSyntax = 'CSS' in window && 'supports' in window.CSS;
  var oldSyntax = 'supportsCSS' in window;
  Modernizr.addTest('supports', newSyntax || oldSyntax);

/*!
{
  "name": "placeholder attribute",
  "property": "placeholder",
  "tags": ["forms", "attribute"],
  "builderAliases": ["forms_placeholder"]
}
!*/
/* DOC
Tests for placeholder attribute in inputs and textareas
*/

  Modernizr.addTest('placeholder', ('placeholder' in createElement('input') && 'placeholder' in createElement('textarea')));


  /**
   * List of property values to set for css tests. See ticket #21
   * http://git.io/vUGl4
   *
   * @memberof Modernizr
   * @name Modernizr._prefixes
   * @optionName Modernizr._prefixes
   * @optionProp prefixes
   * @access public
   * @example
   *
   * Modernizr._prefixes is the internal list of prefixes that we test against
   * inside of things like [prefixed](#modernizr-prefixed) and [prefixedCSS](#-code-modernizr-prefixedcss). It is simply
   * an array of kebab-case vendor prefixes you can use within your code.
   *
   * Some common use cases include
   *
   * Generating all possible prefixed version of a CSS property
   * ```js
   * var rule = Modernizr._prefixes.join('transform: rotate(20deg); ');
   *
   * rule === 'transform: rotate(20deg); webkit-transform: rotate(20deg); moz-transform: rotate(20deg); o-transform: rotate(20deg); ms-transform: rotate(20deg);'
   * ```
   *
   * Generating all possible prefixed version of a CSS value
   * ```js
   * rule = 'display:' +  Modernizr._prefixes.join('flex; display:') + 'flex';
   *
   * rule === 'display:flex; display:-webkit-flex; display:-moz-flex; display:-o-flex; display:-ms-flex; display:flex'
   * ```
   */

  var prefixes = (ModernizrProto._config.usePrefixes ? ' -webkit- -moz- -o- -ms- '.split(' ') : []);

  // expose these for the plugin API. Look in the source for how to join() them against your input
  ModernizrProto._prefixes = prefixes;

  

  /**
   * getBody returns the body of a document, or an element that can stand in for
   * the body if a real body does not exist
   *
   * @access private
   * @function getBody
   * @returns {HTMLElement|SVGElement} Returns the real body of a document, or an
   * artificially created element that stands in for the body
   */

  function getBody() {
    // After page load injecting a fake body doesn't work so check if body exists
    var body = document.body;

    if (!body) {
      // Can't use the real body create a fake one.
      body = createElement(isSVG ? 'svg' : 'body');
      body.fake = true;
    }

    return body;
  }

  ;

  /**
   * injectElementWithStyles injects an element with style element and some CSS rules
   *
   * @access private
   * @function injectElementWithStyles
   * @param {string} rule - String representing a css rule
   * @param {function} callback - A function that is used to test the injected element
   * @param {number} [nodes] - An integer representing the number of additional nodes you want injected
   * @param {string[]} [testnames] - An array of strings that are used as ids for the additional nodes
   * @returns {boolean}
   */

  function injectElementWithStyles(rule, callback, nodes, testnames) {
    var mod = 'modernizr';
    var style;
    var ret;
    var node;
    var docOverflow;
    var div = createElement('div');
    var body = getBody();

    if (parseInt(nodes, 10)) {
      // In order not to give false positives we create a node for each test
      // This also allows the method to scale for unspecified uses
      while (nodes--) {
        node = createElement('div');
        node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
        div.appendChild(node);
      }
    }

    style = createElement('style');
    style.type = 'text/css';
    style.id = 's' + mod;

    // IE6 will false positive on some tests due to the style element inside the test div somehow interfering offsetHeight, so insert it into body or fakebody.
    // Opera will act all quirky when injecting elements in documentElement when page is served as xml, needs fakebody too. #270
    (!body.fake ? div : body).appendChild(style);
    body.appendChild(div);

    if (style.styleSheet) {
      style.styleSheet.cssText = rule;
    } else {
      style.appendChild(document.createTextNode(rule));
    }
    div.id = mod;

    if (body.fake) {
      //avoid crashing IE8, if background image is used
      body.style.background = '';
      //Safari 5.13/5.1.4 OSX stops loading if ::-webkit-scrollbar is used and scrollbars are visible
      body.style.overflow = 'hidden';
      docOverflow = docElement.style.overflow;
      docElement.style.overflow = 'hidden';
      docElement.appendChild(body);
    }

    ret = callback(div, rule);
    // If this is done after page load we don't want to remove the body so check if body exists
    if (body.fake) {
      body.parentNode.removeChild(body);
      docElement.style.overflow = docOverflow;
      // Trigger layout so kinetic scrolling isn't disabled in iOS6+
      docElement.offsetHeight;
    } else {
      div.parentNode.removeChild(div);
    }

    return !!ret;

  }

  ;

  /**
   * testStyles injects an element with style element and some CSS rules
   *
   * @memberof Modernizr
   * @name Modernizr.testStyles
   * @optionName Modernizr.testStyles()
   * @optionProp testStyles
   * @access public
   * @function testStyles
   * @param {string} rule - String representing a css rule
   * @param {function} callback - A function that is used to test the injected element
   * @param {number} [nodes] - An integer representing the number of additional nodes you want injected
   * @param {string[]} [testnames] - An array of strings that are used as ids for the additional nodes
   * @returns {boolean}
   * @example
   *
   * `Modernizr.testStyles` takes a CSS rule and injects it onto the current page
   * along with (possibly multiple) DOM elements. This lets you check for features
   * that can not be detected by simply checking the [IDL](https://developer.mozilla.org/en-US/docs/Mozilla/Developer_guide/Interface_development_guide/IDL_interface_rules).
   *
   * ```js
   * Modernizr.testStyles('#modernizr { width: 9px; color: papayawhip; }', function(elem, rule) {
   *   // elem is the first DOM node in the page (by default #modernizr)
   *   // rule is the first argument you supplied - the CSS rule in string form
   *
   *   addTest('widthworks', elem.style.width === '9px')
   * });
   * ```
   *
   * If your test requires multiple nodes, you can include a third argument
   * indicating how many additional div elements to include on the page. The
   * additional nodes are injected as children of the `elem` that is returned as
   * the first argument to the callback.
   *
   * ```js
   * Modernizr.testStyles('#modernizr {width: 1px}; #modernizr2 {width: 2px}', function(elem) {
   *   document.getElementById('modernizr').style.width === '1px'; // true
   *   document.getElementById('modernizr2').style.width === '2px'; // true
   *   elem.firstChild === document.getElementById('modernizr2'); // true
   * }, 1);
   * ```
   *
   * By default, all of the additional elements have an ID of `modernizr[n]`, where
   * `n` is its index (e.g. the first additional, second overall is `#modernizr2`,
   * the second additional is `#modernizr3`, etc.).
   * If you want to have more meaningful IDs for your function, you can provide
   * them as the fourth argument, as an array of strings
   *
   * ```js
   * Modernizr.testStyles('#foo {width: 10px}; #bar {height: 20px}', function(elem) {
   *   elem.firstChild === document.getElementById('foo'); // true
   *   elem.lastChild === document.getElementById('bar'); // true
   * }, 2, ['foo', 'bar']);
   * ```
   *
   */

  var testStyles = ModernizrProto.testStyles = injectElementWithStyles;
  
/*!
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
/* DOC
Indicates if the browser supports the W3C Touch Events API.

This *does not* necessarily reflect a touchscreen device:

* Older touchscreen devices only emulate mouse events
* Modern IE touch devices implement the Pointer Events API instead: use `Modernizr.pointerevents` to detect support for that
* Some browsers & OS setups may enable touch APIs when no touchscreen is connected
* Future browsers may implement other event models for touch interactions

See this article: [You Can't Detect A Touchscreen](http://www.stucox.com/blog/you-cant-detect-a-touchscreen/).

It's recommended to bind both mouse and touch/pointer events simultaneously – see [this HTML5 Rocks tutorial](http://www.html5rocks.com/en/mobile/touchandmouse/).

This test will also return `true` for Firefox 4 Multitouch support.
*/

  // Chrome (desktop) used to lie about its support on this, but that has since been rectified: http://crbug.com/36415
  Modernizr.addTest('touchevents', function() {
    var bool;
    if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
      bool = true;
    } else {
      // include the 'heartz' as a way to have a non matching MQ to help terminate the join
      // https://git.io/vznFH
      var query = ['@media (', prefixes.join('touch-enabled),('), 'heartz', ')', '{#modernizr{top:9px;position:absolute}}'].join('');
      testStyles(query, function(node) {
        bool = node.offsetTop === 9;
      });
    }
    return bool;
  });

/*!
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
/* DOC
Detects support for the ':target' CSS pseudo-class.
*/

  // querySelector
  Modernizr.addTest('target', function() {
    var doc = window.document;
    if (!('querySelectorAll' in doc)) {
      return false;
    }

    try {
      doc.querySelectorAll(':target');
      return true;
    } catch (e) {
      return false;
    }
  });


  var cssomPrefixes = (ModernizrProto._config.usePrefixes ? omPrefixes.split(' ') : []);
  ModernizrProto._cssomPrefixes = cssomPrefixes;
  


  /**
   * contains checks to see if a string contains another string
   *
   * @access private
   * @function contains
   * @param {string} str - The string we want to check for substrings
   * @param {string} substr - The substring we want to search the first string for
   * @returns {boolean}
   */

  function contains(str, substr) {
    return !!~('' + str).indexOf(substr);
  }

  ;

  /**
   * Create our "modernizr" element that we do most feature tests on.
   *
   * @access private
   */

  var modElem = {
    elem: createElement('modernizr')
  };

  // Clean up this element
  Modernizr._q.push(function() {
    delete modElem.elem;
  });

  

  var mStyle = {
    style: modElem.elem.style
  };

  // kill ref for gc, must happen before mod.elem is removed, so we unshift on to
  // the front of the queue.
  Modernizr._q.unshift(function() {
    delete mStyle.style;
  });

  

  /**
   * domToCSS takes a camelCase string and converts it to kebab-case
   * e.g. boxSizing -> box-sizing
   *
   * @access private
   * @function domToCSS
   * @param {string} name - String name of camelCase prop we want to convert
   * @returns {string} The kebab-case version of the supplied name
   */

  function domToCSS(name) {
    return name.replace(/([A-Z])/g, function(str, m1) {
      return '-' + m1.toLowerCase();
    }).replace(/^ms-/, '-ms-');
  }
  ;

  /**
   * nativeTestProps allows for us to use native feature detection functionality if available.
   * some prefixed form, or false, in the case of an unsupported rule
   *
   * @access private
   * @function nativeTestProps
   * @param {array} props - An array of property names
   * @param {string} value - A string representing the value we want to check via @supports
   * @returns {boolean|undefined} A boolean when @supports exists, undefined otherwise
   */

  // Accepts a list of property names and a single value
  // Returns `undefined` if native detection not available
  function nativeTestProps(props, value) {
    var i = props.length;
    // Start with the JS API: http://www.w3.org/TR/css3-conditional/#the-css-interface
    if ('CSS' in window && 'supports' in window.CSS) {
      // Try every prefixed variant of the property
      while (i--) {
        if (window.CSS.supports(domToCSS(props[i]), value)) {
          return true;
        }
      }
      return false;
    }
    // Otherwise fall back to at-rule (for Opera 12.x)
    else if ('CSSSupportsRule' in window) {
      // Build a condition string for every prefixed variant
      var conditionText = [];
      while (i--) {
        conditionText.push('(' + domToCSS(props[i]) + ':' + value + ')');
      }
      conditionText = conditionText.join(' or ');
      return injectElementWithStyles('@supports (' + conditionText + ') { #modernizr { position: absolute; } }', function(node) {
        return getComputedStyle(node, null).position == 'absolute';
      });
    }
    return undefined;
  }
  ;

  /**
   * cssToDOM takes a kebab-case string and converts it to camelCase
   * e.g. box-sizing -> boxSizing
   *
   * @access private
   * @function cssToDOM
   * @param {string} name - String name of kebab-case prop we want to convert
   * @returns {string} The camelCase version of the supplied name
   */

  function cssToDOM(name) {
    return name.replace(/([a-z])-([a-z])/g, function(str, m1, m2) {
      return m1 + m2.toUpperCase();
    }).replace(/^-/, '');
  }
  ;

  // testProps is a generic CSS / DOM property test.

  // In testing support for a given CSS property, it's legit to test:
  //    `elem.style[styleName] !== undefined`
  // If the property is supported it will return an empty string,
  // if unsupported it will return undefined.

  // We'll take advantage of this quick test and skip setting a style
  // on our modernizr element, but instead just testing undefined vs
  // empty string.

  // Property names can be provided in either camelCase or kebab-case.

  function testProps(props, prefixed, value, skipValueTest) {
    skipValueTest = is(skipValueTest, 'undefined') ? false : skipValueTest;

    // Try native detect first
    if (!is(value, 'undefined')) {
      var result = nativeTestProps(props, value);
      if (!is(result, 'undefined')) {
        return result;
      }
    }

    // Otherwise do it properly
    var afterInit, i, propsLength, prop, before;

    // If we don't have a style element, that means we're running async or after
    // the core tests, so we'll need to create our own elements to use

    // inside of an SVG element, in certain browsers, the `style` element is only
    // defined for valid tags. Therefore, if `modernizr` does not have one, we
    // fall back to a less used element and hope for the best.
    var elems = ['modernizr', 'tspan'];
    while (!mStyle.style) {
      afterInit = true;
      mStyle.modElem = createElement(elems.shift());
      mStyle.style = mStyle.modElem.style;
    }

    // Delete the objects if we created them.
    function cleanElems() {
      if (afterInit) {
        delete mStyle.style;
        delete mStyle.modElem;
      }
    }

    propsLength = props.length;
    for (i = 0; i < propsLength; i++) {
      prop = props[i];
      before = mStyle.style[prop];

      if (contains(prop, '-')) {
        prop = cssToDOM(prop);
      }

      if (mStyle.style[prop] !== undefined) {

        // If value to test has been passed in, do a set-and-check test.
        // 0 (integer) is a valid property value, so check that `value` isn't
        // undefined, rather than just checking it's truthy.
        if (!skipValueTest && !is(value, 'undefined')) {

          // Needs a try catch block because of old IE. This is slow, but will
          // be avoided in most cases because `skipValueTest` will be used.
          try {
            mStyle.style[prop] = value;
          } catch (e) {}

          // If the property value has changed, we assume the value used is
          // supported. If `value` is empty string, it'll fail here (because
          // it hasn't changed), which matches how browsers have implemented
          // CSS.supports()
          if (mStyle.style[prop] != before) {
            cleanElems();
            return prefixed == 'pfx' ? prop : true;
          }
        }
        // Otherwise just return true, or the property name if this is a
        // `prefixed()` call
        else {
          cleanElems();
          return prefixed == 'pfx' ? prop : true;
        }
      }
    }
    cleanElems();
    return false;
  }

  ;

  /**
   * fnBind is a super small [bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) polyfill.
   *
   * @access private
   * @function fnBind
   * @param {function} fn - a function you want to change `this` reference to
   * @param {object} that - the `this` you want to call the function with
   * @returns {function} The wrapped version of the supplied function
   */

  function fnBind(fn, that) {
    return function() {
      return fn.apply(that, arguments);
    };
  }

  ;

  /**
   * testDOMProps is a generic DOM property test; if a browser supports
   *   a certain property, it won't return undefined for it.
   *
   * @access private
   * @function testDOMProps
   * @param {array.<string>} props - An array of properties to test for
   * @param {object} obj - An object or Element you want to use to test the parameters again
   * @param {boolean|object} elem - An Element to bind the property lookup again. Use `false` to prevent the check
   */
  function testDOMProps(props, obj, elem) {
    var item;

    for (var i in props) {
      if (props[i] in obj) {

        // return the property name as a string
        if (elem === false) {
          return props[i];
        }

        item = obj[props[i]];

        // let's bind a function
        if (is(item, 'function')) {
          // bind to obj unless overriden
          return fnBind(item, elem || obj);
        }

        // return the unbound function or obj or value
        return item;
      }
    }
    return false;
  }

  ;

  /**
   * testPropsAll tests a list of DOM properties we want to check against.
   * We specify literally ALL possible (known and/or likely) properties on
   * the element including the non-vendor prefixed one, for forward-
   * compatibility.
   *
   * @access private
   * @function testPropsAll
   * @param {string} prop - A string of the property to test for
   * @param {string|object} [prefixed] - An object to check the prefixed properties on. Use a string to skip
   * @param {HTMLElement|SVGElement} [elem] - An element used to test the property and value against
   * @param {string} [value] - A string of a css value
   * @param {boolean} [skipValueTest] - An boolean representing if you want to test if value sticks when set
   */
  function testPropsAll(prop, prefixed, elem, value, skipValueTest) {

    var ucProp = prop.charAt(0).toUpperCase() + prop.slice(1),
    props = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');

    // did they call .prefixed('boxSizing') or are we just testing a prop?
    if (is(prefixed, 'string') || is(prefixed, 'undefined')) {
      return testProps(props, prefixed, value, skipValueTest);

      // otherwise, they called .prefixed('requestAnimationFrame', window[, elem])
    } else {
      props = (prop + ' ' + (domPrefixes).join(ucProp + ' ') + ucProp).split(' ');
      return testDOMProps(props, prefixed, elem);
    }
  }

  // Modernizr.testAllProps() investigates whether a given style property,
  // or any of its vendor-prefixed variants, is recognized
  //
  // Note that the property names must be provided in the camelCase variant.
  // Modernizr.testAllProps('boxSizing')
  ModernizrProto.testAllProps = testPropsAll;

  

  /**
   * testAllProps determines whether a given CSS property is supported in the browser
   *
   * @memberof Modernizr
   * @name Modernizr.testAllProps
   * @optionName Modernizr.testAllProps()
   * @optionProp testAllProps
   * @access public
   * @function testAllProps
   * @param {string} prop - String naming the property to test (either camelCase or kebab-case)
   * @param {string} [value] - String of the value to test
   * @param {boolean} [skipValueTest=false] - Whether to skip testing that the value is supported when using non-native detection
   * @example
   *
   * testAllProps determines whether a given CSS property, in some prefixed form,
   * is supported by the browser.
   *
   * ```js
   * testAllProps('boxSizing')  // true
   * ```
   *
   * It can optionally be given a CSS value in string form to test if a property
   * value is valid
   *
   * ```js
   * testAllProps('display', 'block') // true
   * testAllProps('display', 'penguin') // false
   * ```
   *
   * A boolean can be passed as a third parameter to skip the value check when
   * native detection (@supports) isn't available.
   *
   * ```js
   * testAllProps('shapeOutside', 'content-box', true);
   * ```
   */

  function testAllProps(prop, value, skipValueTest) {
    return testPropsAll(prop, undefined, undefined, value, skipValueTest);
  }
  ModernizrProto.testAllProps = testAllProps;
  
/*!
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
/* DOC
Detects the ability to control specifies whether or not an element's background
extends beyond its border in CSS
*/

  Modernizr.addTest('backgroundcliptext', function() {
    return testAllProps('backgroundClip', 'text');
  });


  // Run each test
  testRunner();

  // Remove the "no-js" class if it exists
  setClasses(classes);

  delete ModernizrProto.addTest;
  delete ModernizrProto.addAsyncTest;

  // Run the things that are supposed to run after the tests
  for (var i = 0; i < Modernizr._q.length; i++) {
    Modernizr._q[i]();
  }

  // Leak Modernizr namespace
  window.Modernizr = Modernizr;


;

})(window, document);
(function() {
  'use strict';

  story.$inject = ["$resource"];
  angular
    .module('lhr70')
    .service('story', story);

  /** @ngInject */
  function story($resource) {

    var storyApi = $resource(
      '/api/story/:id',
      {},
      {
        save: {
          method: 'POST'
        }
      }
    );

    return {
      getStoryById: function (id) {
        return storyApi.get({id:id}).$promise;
      },
      getAll:  function () {
        return storyApi.query().$promise;
      },
      save: function (storyData) {
        var newStory = new storyApi(storyData);
        return newStory.$save();
      }
    };
  }

})();

(function() {
  'use strict';

  page.$inject = ["$resource"];
  angular
    .module('lhr70')
    .service('page', page);

  /** @ngInject */
  function page($resource) {

    var pageApi = $resource(
      '/api/page/:id',
      {},
      {
        save: {
          method: 'POST'
        }
      }
    );

    return {
      getPageById: function (id) {
        return pageApi.get({id:id}).$promise;
      },
      getAll:  function () {
        return pageApi.query().$promise;
      }
    };
  }

})();

(function () {
  'use strict';

  $media.$inject = ["Media", "$rootScope", "$window"];
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
          gift_hero: 'gftHero',
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

  homepage.$inject = ["$resource", "mapCards", "$q"];
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
            if (i > 4) {
              if (i % 3 == 0) {
                if (i % 2 == 0)
                  cards.push(mapCards.createCard('gift_cta'));
                else {
                  cards.push(mapCards.createCard('story_cta'));
                }
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

  gift.$inject = ["$resource", "$q", "mapCards"];
  angular
    .module('lhr70')
    .service('gift', gift);

  /** @ngInject */
  function gift($resource, $q, mapCards) {

    var api = $resource('/api/gift/:id');

    return {
      getGiftById: function (id) {
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
            if (item.importance == 1) {
              cards.push(mapCards.createCard("gift_hero", item));
            } else {
              cards.push(mapCards.createCard("gift_small", item));
            }
          }

          deferred.resolve(cards);
        });

        return deferred.promise;
      }
    };
  }

})();

(function () {
  'use strict';

  angular
    .module('lhr70')
    .filter('newline', ["$sce", function ($sce) {

      return function (text) {

        text = text.replace(/\n/g, '<br />');
        return $sce.trustAsHtml(text);

      }

    }])
    .filter('listify', ["$sce", function ($sce) {

      return function (text) {

        if (!text) return;

        var list = text.split("\n");

        text = "<ul>";

        for (var i = 0; i < list.length; i++) {
          text += "<li>" + list[i] + "</li>";
        }

        text += "</ul>"

        return $sce.trustAsHtml(text);

      }
    }])
    .filter('alttocaption', ["$sce", function ($sce) {

      return function (text) {

        if (!text) return;

        debugger;

        var list = text.split("\n");

        text = "<ul>";

        for (var i = 0; i < list.length; i++) {
          text += "<li>" + list[i] + "</li>";
        }

        text += "</ul>"

        return $sce.trustAsHtml(text);

      }
    }])
    .filter('htmlToPlaintext', function () {
      return function (text) {
        return text ? String(text).replace(/<[^>]+>/gm, '') : '';
      };
    })
    .filter('truncate', function () {
    return function (text, length, end) {
      if (isNaN(length))
        length = 500;

      if (end === undefined)
        end = "...";

      if (text.length <= length || text.length - end.length <= length) {
        return text;
      }
      else {
        return String(text).substring(0, length-end.length) + end;
      }
    };
  });

})();

(function () {
  'use strict';

  runBlock.$inject = ["$rootScope", "$media", "$location"];
  angular
    .module('lhr70')
    .run(runBlock);

  /** @ngInject */
  function runBlock($rootScope, $media, $location) {
    $rootScope.$media = $media;
    $rootScope.hasBackground = false;
    $rootScope.customContainer = false;
    $rootScope.isOldIE = isOldIE;

    $rootScope.$on('$stateChangeSuccess',
      function () {
        _satellite.track('page_view');
      });

    var defaultMetatags = {
      title: "Heathrow 70", pageTitle: "Heathrow 70", description: "Where has Heathrow taken you? " +
      "This year marks 70 years of Heathrow " +
      "We’re celebrating all your journeys with a birthday present for every story told. " +
      "If you’ve ever travelled to loved ones, to new experiences or to beyond your wildest dreams, tell us and receive your gift.",
      type: "website",
      image: "https://stories.heathrow.com/static/assets/icons/apple-icons/apple-touch-icon-180x180.png"
    };
    $rootScope.metatags = (JSON.parse(JSON.stringify(defaultMetatags)));

    $rootScope.setMetatags = function (title, description, type, image) {
      if (title) {
        $rootScope.metatags.pageTitle = "Heathrow 70 | " + title;
        $rootScope.metatags.title = title;
      } else {
        $rootScope.metatags.pageTitle = defaultMetatags.title;
        $rootScope.metatags.title = defaultMetatags.title;
      }

      if (description)
        $rootScope.metatags.description = description;
      else {
        $rootScope.metatags.description = defaultMetatags.description;
      }
      if (type)
        $rootScope.metatags.type = type;
      else
        $rootScope.metatags.type = defaultMetatags.type;

      if (image) {
        var url = $location.absUrl().split($location.path())[0];
        $rootScope.metatags.image = url + image;
      }
      else {
        $rootScope.metatags.image = defaultMetatags.image;
      }
    };
  }
})();

(function () {
  'use strict';

  routerConfig.$inject = ["$stateProvider", "$urlRouterProvider", "$locationProvider"];
  angular
    .module('lhr70')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider, $locationProvider) {

    $urlRouterProvider.rule(function ($injector, $location) {
      var path = $location.path();
      var hasTrailingSlash = path[path.length - 1] === '/';

      if (hasTrailingSlash) {
        //if last character is a slash, return the same url without the slash
        var newPath = path.substr(0, path.length - 1);
        return newPath;
      }
    });

    if (!isOldIE) {
      $locationProvider.html5Mode(true);
    } else {
      $locationProvider.html5Mode(false);
    }

    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'app/pages/main/main.html',
        controller: 'MainController',
        controllerAs: 'main'
      })
      .state('storySubmit', {
        url: '/story/submit',
        templateUrl: 'app/pages/submitStory/submitStory.html',
        controller: 'SubmitStoryController',
        controllerAs: 'scope'
      })
      .state('story', {
        url: '/story/:slug',
        templateUrl: 'app/pages/story/story.html',
        controller: 'StoryController',
        controllerAs: 'scope'
      })
      .state('gifts', {
        url: '/gifts',
        templateUrl: 'app/pages/gifts/gifts.html',
        controller: 'GiftsController',
        controllerAs: 'scope'
      })
      .state('gift', {
        url: '/gift/:slug',
        templateUrl: 'app/pages/gift/gift.html',
        controller: 'GiftController',
        controllerAs: 'scope'
      })
      .state('page', {
        url: '/page/:slug',
        templateUrl: 'app/pages/static/static.html',
        controller: 'StaticController',
        controllerAs: 'scope'
      }).state('404', {
      url: '/not-found',
      templateUrl: 'app/components/messageBox/messageBox.html',
      controller: ["$rootScope", function ($rootScope) {
        $rootScope.hasBackground = true;
        var vm = this;
        vm.message = {
          title: "404",
          subTitle: "Error",
          content: ["Sorry. the page you are looking for cannot be found.",
          "Why not <a class='success-link' href='/'>read some of our stories </a> form the last 70 years instead."]
        };
      }],
      controllerAs: 'scope'
    });

    $urlRouterProvider.otherwise(function ($injector, $location) {
      if ($location.url() == "/" || $location.url() == "" || $location.url().contains("?")) {
        $location.path('/home');
      } else {
        $location.path('/not-found');
      }
    });
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

  config.$inject = ["$logProvider", "toastrConfig", "$httpProvider"];
  angular
    .module('lhr70')
    .config(config);

  /** @ngInject */
  function config($logProvider, toastrConfig, $httpProvider) {
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
  }

})();

angular.module("lhr70").run(["$templateCache", function($templateCache) {$templateCache.put("app/components/cardCta/cta.directive.html","<a class=cta-content ng-href={{vm.href}} title={{vm.title}}><div class=cta-inner><div class=cta-icon ng-class=\"{\'cta-icon--story\': vm.type == \'cta\', \'cta-icon--gift\': vm.type == \'gftCta\'}\"></div><div class=text-bold>{{vm.title}}</div><div class=text-light ng-if=vm.copy>{{vm.copy}}</div></div></a>");
$templateCache.put("app/components/cardGift/gift.directive.html","<div class=gift-info><div class=logo><img class=logo--image ng-src=\"{{vm.isGiftsPage ? vm.gift.logo_full : vm.gift.logo_module}}\" alt=\"{{ vm.gift.merchant }}\"></div><div class=gift-featured><div class=gift-crop ng-class=\"{\n        \'gift-crop--pink\': vm.color === \'pink\',\n        \'gift-crop--white\': vm.color === \'white\'\n      }\">{{vm.gift.className}} <img class=gift-featured--image src={{vm.gift.image_thumbnail}} type=vm.gift.className alt={{vm.gift.title}}></div></div></div><div class=gift-text><div class=gift-cta>ADD YOUR STORY FOR A CHANCE TO RECEIVE...</div><div class=gift-content>{{vm.gift.title}}</div></div><!--<div class=\"filler\"></div>-->");
$templateCache.put("app/components/cardSnippet/snippet.directive.html","<div class=snippet><div class=snippet--copy><div class=\"lg-text text-capitalize\"><span ng-bind-html=vm.story.short_details></span></div></div></div>");
$templateCache.put("app/components/cardQuote/quote.directive.html","<div class=quote ng-class=\"{\'is-block\': vm.block}\"><div class=quote--copy><div class=quote-marks>“</div><div class=quote-text><div class=\"lg-text text-capitalize\">{{ vm.story.short_details ? vm.story.short_details : vm.story.pull_quote }}</div></div></div></div>");
$templateCache.put("app/components/cardGiftHero/giftHero.directive.html","<div class=gift-info><img class=logo ng-src={{vm.gift.logo_full}} alt={{vm.gift.title}}></div><div class=gift-text><div class=gift-cta>ADD YOUR STORY FOR A CHANCE TO RECEIVE</div><div class=gift-content>{{vm.gift.title}}</div></div><div class=gift-image><div class=\"gift-crop gift-crop--white\"><img src={{vm.gift.image_thumbnail}} type=vm.gift.className alt={{vm.gift.title}}></div></div><!--<div class=\"filler\"></div>-->");
$templateCache.put("app/components/cards/cards.directive.html","<div class=cards-wrapper><div class=\"loader cards-loader\">Loading...</div><div ng-if=vm.cards masonary-grid card-parallax class=jig-grid infinite-scroll=loadMore() infinite-scroll-distance=2><div ng-repeat=\"card in loadedCards track by $index\" class=card ng-class=card.className ng-style=card.background><a ng-href={{getUrl(card)}} ng-if=\"isStory(card) && card.className!==\'cta\' && card.className!==\'gftCta\'\"><quote-block story=card ng-if=\"card.className==\'qt\'\" block=true></quote-block><snippet-block story=card ng-if=\"card.className==\'sn\'\"></snippet-block><story-block story=card ng-if=\"card.className==\'sm\' || card.className==\'lg\' \"></story-block></a><a ng-href={{getUrl(card)}} ng-if=isGift(card)><gift-block gift=card color=\"\'pink\'\"></gift-block></a><cta-block type=card.className href=\"card.className==\'cta\'?\'/story/submit\':\'/gifts\'\" title=\"card.className==\'cta\'?\'add your story\':\'explore all gifts\'\" copy=\"card.className==\'cta\'?\'to receive a birthday gift\':\'\'\" ng-if=\"card.className==\'cta\' || card.className==\'gftCta\'\"></cta-block></div></div></div>");
$templateCache.put("app/components/cardStory/story.directive.html","<div class=content><div class=story--copy><div class=story--from>LHR <span class=icon-plane--grey></span></div><div class=lhr-gradient-text-lg>{{ vm.story.title }}</div></div></div><!--<div class=\"filler\"></div>-->");
$templateCache.put("app/components/carousel/carousel.directive.html","<div class=carousel><div class=carousel-inner><img ng-repeat=\"(key, value) in images\" ng-src={{images[key]}} on-finish-render=ngRepeatFinished></div><nav class=carousel-navigation><button class=carousel-prev ng-class=\"{\'is-not-active\': isFirstElement()}\"></button> <button class=carousel-next ng-class=\"{\'is-not-active\': isLastElement()}\"></button><div class=carousel-pageinfo-wrapper><div class=carousel-pageinfo><span class=carousel-current>{{currentSlide + 1}}</span><span class=carousel-divider>/</span><span class=carousel-max>{{images.length}}</span></div></div></nav></div>");
$templateCache.put("app/components/cookieConsent/cookieConsent.directive.html","<div class=cookie-consent ng-hide=vm.showCookieConsent()><div class=lhs>We use <a href=http://www.heathrow.com/more/help-with-this-website/privacy-notice class=success-link>cookies on this website</a> to ensure we give you the best experience and to see how people use the site. The cookies cannot identify you.<br>If you continue to use the site without changing your browser settings, we’ll assume you are happy with this.</div><div class=rhs><a class=\"btn btn-close\" href=# ng-click=vm.closePanel() title=close></a></div></div>");
$templateCache.put("app/components/footer/footer.directive.html","<footer class=\"footer container\"><div class=footer-content><div class=footer-ctas><div><a href=/page/how-it-works>How it works</a></div><div><a href=http://www.heathrow.com/more/help-with-this-website/privacy-notice target=_blank>Privacy policy</a></div><div><a href=/page/terms>Terms &amp; Conditions</a></div></div><a href=http://www.heathrow.com/ target=_blank><img class=footer-logo src=/static/assets/images/heathrow_footer_logo2.svg alt=\"Heathrow Logo\"></a></div></footer><!--Adobe Tag Manager code--><script type=text/javascript>_satellite.pageBottom();</script>");
$templateCache.put("app/components/giftContent/giftContent.directive.html","<div class=giftdetail-wrapper><div class=giftdetail-title-wrapper><div class=journey-from ng-if=vm.gift.heathrow_origin>LHR<div class=icon-plane></div></div><h1 class=giftdetail-title><span class=giftdetail-title-sub>ADD YOUR STORY FOR A CHANCE TO RECEIVE...</span> <span class=giftdetail-title-copy>{{vm.gift.title}}</span></h1></div><div class=giftdetail-inner><share element=vm.gift></share><div class=giftdetail-content><section class=giftdetail-details-wrapper><section class=giftdetail-details><p class=giftdetail-paragraph ng-bind-html=vm.gift.description></p></section><section class=giftdetail-carousel ng-if=\"vm.gift.additional_images.length > 1\"><carousel images=vm.gift.additional_images></carousel></section><section class=giftdetail-image ng-if=\"vm.gift.additional_images.length === 1\"><img ng-src={{vm.gift.additional_images[0]}}></section><h2 class=giftdetail-subtitle ng-if=vm.gift.included>This gift includes</h2><section class=giftdetail-included ng-if=vm.gift.included ng-bind-html=vm.gift.included></section><h2 class=giftdetail-subtitle>Terms &amp; Conditions</h2><section class=giftdetail-terms ng-if=vm.gift.terms><p ng-bind-html=vm.gift.terms></p></section></section></div></div></div>");
$templateCache.put("app/components/giftHeader/giftHeader.directive.html","<div class=gift-header><div class=gift-header-logo><img ng-src={{logo}}></div><div class=gift-header-image><div class=\"gift-crop gift-crop--white\"><img src={{image}} type=\"\'header-image\'\" ng-src={{image}}></div></div></div>");
$templateCache.put("app/components/gifts/gifts.directive.html","<div class=cards-wrapper><div class=\"loader cards-loader\">Loading...</div><div ng-if=vm.cards masonary-grid card-parallax class=\"jig-grid page-gifts\" infinite-scroll=loadMore() infinite-scroll-distance=1><div ng-repeat=\"card in loadedCards track by $index\" class=card ng-class=card.className ng-style=card.background><a href=/gift/{{card.slug}}><gift-hero-block ng-if=\"card.className == \'gftHero\'\" gift=card></gift-hero-block><gift-block ng-if=\"card.className != \'gftHero\'\" gift=card cardlocation=gifts-page color=\"\'white\'\"></gift-block></a></div></div></div>");
$templateCache.put("app/components/herobox/herobox.html","<div class=logo-box><a href=/ ><img src=/static/assets/images/heath70_logo-main_@x2.png alt=\"70th anniversary logo\"></a></div><div class=hero-box ng-class=\"{\'has-content\': hero.text.content}\" ng-style=\"{width: hero.width}\"><div class=hero-box--text><div class=\"hero-box--text-md hero-box--subtitle-top\" ng-style=hero.subTitleStyle>{{hero.subTitle.top}}</div><!--<div class=\"hero-box&#45;&#45;text-sm\" ng-repeat=\"line in hero.text.beforeHero\">{{line}}</div>--><h1 class=hero-box--text-lg ng-class=\"{\'hero-box--text-lg--has-sub-title\': hero.subTitle}\" ng-style=\"{\'font-size\': hero.fontSize}\">{{hero.title}}</h1><div class=\"hero-box--text-md hero-box--subtitle-bottom\">{{hero.subTitle.bottom}}</div><!--<div class=\"hero-box&#45;&#45;text-sm\" ng-repeat=\"line in hero.text.afterHero\">{{line}}</div>--></div></div><div class=\"success-box--text hero-box--content\" ng-repeat=\"line in hero.text.content\"><span ng-bind-html=line></span></div><div class=\"success-box--text hero-box--content\" ng-show=hero.hasCta><a href=/story/submit class=hero-box--cta><div class=hero-cta>Add your story<div class=icon-circle-border><div class=icon-plane-takeoff--white></div></div></div></a></div>");
$templateCache.put("app/components/menu/menu.html","<nav class=menu><label class=menu-icon for=hamburger ng-click=toggleMenu() tabindex=1><span></span><div class=menu-text>Menu</div></label><div class=menu-content id=menu position=right><div class=menu-items ng-show=active><a href=/ ng-class=\"{\'active\': isHomePage}\" ng-click=closeMenu()>Home page</a> <a href=/gifts ng-class=\"{\'active\': isGiftsPage}\" ng-click=closeMenu()>All Gifts</a><div class=menu-bottom><a href=/page/how-it-works ng-class=\"{\'active\': isHowItWorksPage}\" ng-click=closeMenu()>How it works</a> <a href=http://www.heathrow.com/more/help-with-this-website/privacy-notice target=_blank ng-click=closeMenu()>Privacy policy</a> <a href=/page/terms ng-class=\"{\'active\': isTOC}\" ng-click=closeMenu() ng-keydown=focusToMenu($event)>Terms &amp; Conditions</a></div></div></div></nav>");
$templateCache.put("app/components/messageBox/messageBox.html","<div class=logo-box><a href=/ ><img src=/static/assets/images/heath70_logo-main_@x2.png alt=\"70th anniversary logo\"></a></div><div class=\"hero-box has-content\"><div class=hero-box--text><div class=success-box--text-md ng-bind-html=scope.message.subTitle></div><h1 class=success-box--text-lg ng-bind-html=scope.message.title></h1></div></div><div class=\"success-box--text hero-box--content\" ng-repeat=\"line in scope.message.content\"><ng-bind-html ng-bind-html=line></ng-bind-html></div>");
$templateCache.put("app/components/navbar/navbar.html","<menu></menu><nav class=navbar><div class=lhs><a class=nav--logo href=/ >Heathrow 70\'th Anniversary</a><div class=nav--story-info ng-if=isStoryPage><div class=nav--story-primary><span class=nav--story-from>LHR</span> <span class=icon-plane--white></span> <span class=nav--story-title>{{storyInfo.title}}</span></div><div class=nav--story-secondary><span class=nav--story-author ng-if=storyInfo.person_name>{{storyInfo.person_name}}</span> {{storyInfo.date}}</div></div></div><div class=rhs><a class=\"btn btn--hero\" href=/story/submit>Add your story<span class=icon-plane--departure></span></a></div></nav>");
$templateCache.put("app/components/pageContent/pageContent.directive.html","<div class=static-wrapper><div class=static-title-wrapper><h1 class=static-title>{{vm.page.title}}</h1></div><div class=static-inner><div class=static-content><section class=static-details-wrapper><section class=static-details ng-bind-html=getSafeContent(vm.page.content)></section></section></div></div></div>");
$templateCache.put("app/components/share/share.directive.html","<div class=story-share-wrapper><div class=story-share-container><div class=story-share-inner ng-click=openShare()><button class=story-share-btn><span class=story-share-copy>SHARE</span></button><div class=story-share-content><a ng-href={{getFacebookUrl()}} ng-click=openInNewWindow($event) target=_blank class=\"story-share-link story-share-link--facebook\">Facebook</a> <a ng-href={{getTwitterUrl()}} ng-click=openInNewWindow($event) target=_blank class=\"story-share-link story-share-link--twitter\">Twitter</a> <a ng-href={{getEmailContent()}} class=\"story-share-link story-share-link--email\">Email</a></div></div></div></div>");
$templateCache.put("app/components/storyContent/storyContent.directive.html","<div class=story-wrapper><div class=story-title-wrapper><div class=journey-from>LHR<div class=icon-plane--grey></div></div><h1 class=story-title>{{vm.story.title}}</h1></div><div class=story-inner><share element=vm.story></share><div class=story-content><section class=story-details-wrapper><section class=story-details><p class=story-paragraph ng-if=hasField(vm.story.soundcloud_id)><iframe width=100% height=166 scrolling=no frameborder=no ng-src={{getSoundcloudUrl(vm.story.soundcloud_id)}}></iframe></p><div class=story-paragraph ng-if=hasCopy(vm.story.details) ng-bind-html=getSafeHtml(getFirstParagraph(vm.story.details))></div><div class=\"qt story-quote\" ng-if=vm.story.pull_quote><quote-block story=vm.story></quote-block></div><div class=story-paragraph ng-repeat=\"paragraph in getOtherParagraphs(vm.story.details) track by $index\" ng-bind-html=getSafeHtml(paragraph)></div></section><div class=story-author><span class=story-name>{{vm.story.person_name}}</span> <span class=story-year>{{vm.story.trip_year}}</span></div></section></div></div></div>");
$templateCache.put("app/pages/gift/gift.html","<div class=gift><gift-header image=scope.gift.image logo=scope.gift.logo_full></gift-header><div class=container><gift-content gift=scope.gift></gift-content></div><div class=\"cta right\"><cta-block type=\"\'cta\'\" href=\"\'/story/submit\'\" title=\"\'TELL US YOUR STORY\'\" copy=\"\'FOR A CHANCE TO RECEIVE THIS BIRTHDAY GIFT\'\"></cta-block></div></div>");
$templateCache.put("app/components/storyHeader/storyHeader.directive.html","<div class=story-header ng-class=\"{\'is-playing-video\': videoActive}\" ng-if=vm.story.image><div class=story-hero-image ng-style=getBackground(vm.story.image) ng-if=vm.story.image><div class=container ng-if=hasVideo()><button class=\"story-hero-play-btn btn\" ng-click=playVideo()><i class=story-hero-play-icon></i><span class=story-hero-play-copy>play video</span></button></div></div><div class=story-video-wrapper ng-class=\"{\'is-playing\': videoActive}\"><button class=story-video-close-btn ng-click=closeVideo()></button><div class=story-video-spacer><div class=story-video><div id=player></div></div></div></div></div>");
$templateCache.put("app/pages/gifts/gifts.html","<div class=\"container gifts\"><ng-include src=\"\'app/components/herobox/herobox.html\'\"></ng-include><gifts-block ng-if=scope.cards cards=scope.cards></gifts-block><div class=\"cta right\"><cta-block type=\"\'cta\'\" href=\"\'/story/submit\'\" title=\"\'tell us your story\'\" copy=\"\'for a chance to receive one of these birthday gifts\'\"></cta-block></div></div>");
$templateCache.put("app/pages/main/main.html","<div class=homepage><div class=plane><img src=/static/assets/images/hompage_plane_@x2.png alt=\"\"></div><div class=container><ng-include src=\"\'app/components/herobox/herobox.html\'\"></ng-include><cards-block ng-if=main.cards cards=main.cards></cards-block></div><div class=\"cta right cta-bottom\"><div cta-block type=\"\'cta\'\" href=\"\'/story/submit\'\" title=\"\'ADD YOUR STORY\'\" copy=\"\'TO RECEIVE A BIRTHDAY GIFT\'\"></div></div></div>");
$templateCache.put("app/pages/static/static.html","<div class=static><div class=container><page-content page=scope.page></page-content></div></div>");
$templateCache.put("app/pages/story/story.html","<div class=story><story-header story=scope.story></story-header><div class=container><story-content story=scope.story></story-content></div><div class=\"cta right\"><cta-block type=\"\'cta\'\" href=\"\'/story/submit\'\" title=\"\'ADD YOUR STORY\'\" copy=\"\'TO RECEIVE A BIRTHDAY GIFT\'\"></cta-block></div></div>");
$templateCache.put("app/pages/submitStory/submitStory.html","<div class=container--custom><div class=forms ng-hide=scope.isSubmitted><ng-include src=\"\'app/components/herobox/herobox.html\'\"></ng-include><form role=form name=form id=contact-form class=form-journey-info novalidate><div class=form-group><div class=question-number><div ng-if=\"scope.story.heathrow_origin === null\">1</div><div ng-if=\"scope.story.heathrow_origin !== null\"><div class=icon-tick-purple></div></div></div><label for=destination class=form-helper-text>To start with, were you flying from or to Heathrow?</label><div class=switch><div class=option ng-class=\"{\'active\':scope.story.heathrow_origin !== null && scope.story.heathrow_origin === true}\" ng-click=\"scope.story.heathrow_origin = true\">From</div><div class=option ng-class=\"{\'active\':scope.story.heathrow_origin !== null && scope.story.heathrow_origin === false}\" ng-click=\"scope.story.heathrow_origin = false\">To</div></div></div><!--div.form-group>.question-number+label.form-helper-text--><div class=form-group ng-class=\"{\'active\': scope.story.destination}\"><div class=question-number><div ng-show=!scope.story.destination>2</div><div ng-show=scope.story.destination><div class=icon-tick-purple></div></div></div><label for=destination ng-class=\"{\'to-fix\': form.destination.$error.pattern}\"><div class=form-helper-text>Do you Remember where you were flying {{scope.story.heathrow_origin ? \"to\" : \"from\"}}?</div></label><input type=text class=form-control name=destination id=destination ng-pattern=\"/^[a-zA-Z0-9,.!\'`()?\\s]*$/\" placeholder=\"Tokyo? Kenyan Safari?\" ng-model=scope.story.destination></div><div class=\"form-group form-group--lg\" ng-class=\"{\'active\': scope.story.details}\"><div class=question-number><div ng-if=!scope.story.details>3</div><div ng-if=scope.story.details><div class=icon-tick-purple></div></div></div><label for=details class=required ng-class=\"{\'to-fix\': (form.details.$error.required && form.details.$dirty) || form.details.$error.pattern}\"><div class=form-helper-text>What was meaningful about this trip?</div></label><textarea class=form-control name=details id=details maxlength=3500 ng-pattern=\"/^[a-zA-Z0-9,.!\'`()?\\s]*$/\" placeholder=\"{{(form.details.$error.required && form.details.$dirty) ? \'Please tell us your story\' : \'Landed a brilliant job?\nMet a long-lost cousin for the first time?\n(The more detailed your story, the better the birthday gift you will receive)\'}}\" ng-model=scope.story.details required></textarea></div><div class=form-group><div class=question-number><div ng-if=\"!scope.story.trip_year && !scope.story.trip_month && !scope.story.trip_date\">4</div><div ng-if=\"scope.story.trip_year || scope.story.trip_month || scope.story.trip_date\"><div class=icon-tick-purple></div></div></div><label for=year class=form-helper-text>Do you remember the date?</label><div class=select-row><div class=lhr-select ng-class=\"{\'active\': scope.story.trip_year}\"><select ng-model=scope.story.trip_year ng-options=\"year for year in scope.dateSelector.years\" class=form-control id=year><option value=\"\">Year</option></select></div><div class=lhr-select ng-class=\"{\'active\': scope.story.trip_month}\"><select ng-model=scope.story.trip_month ng-options=\"month.id as month.name for month in scope.dateSelector.months(scope.story.trip_year) track by month.id\" class=form-control><option value=\"\">Month</option></select></div><div class=lhr-select ng-class=\"{\'active\': scope.story.trip_day}\"><select ng-model=scope.story.trip_day ng-options=\"day for day in scope.dateSelector.days(scope.story.trip_year, scope.story.trip_month)\" class=form-control><option value=\"\">Day</option></select></div></div></div><div class=form-group><div class=question-number><div ng-if=!scope.story.terminal>5</div><div ng-if=scope.story.terminal><div class=icon-tick-purple></div></div></div><label class=form-helper-text>What about the terminal?</label><div class=form-terminal-selector><div class=option ng-click=\"scope.story.terminal=\'T1\'\" ng-class=\"{\'active\': scope.story.terminal==\'T1\'}\">T1</div><div class=option ng-click=\"scope.story.terminal=\'T2\'\" ng-class=\"{\'active\': scope.story.terminal==\'T2\'}\">T2</div><div class=option ng-click=\"scope.story.terminal=\'T3\'\" ng-class=\"{\'active\': scope.story.terminal==\'T3\'}\">T3</div><div class=option ng-click=\"scope.story.terminal=\'T4\'\" ng-class=\"{\'active\': scope.story.terminal==\'T4\'}\">T4</div><div class=option ng-click=\"scope.story.terminal=\'T5\'\" ng-class=\"{\'active\': scope.story.terminal==\'T5\'}\">T5</div></div></div><div class=form-group><div class=question-number><div ng-if=!scope.isImageValid()>6</div><div ng-if=\"scope.image && scope.isImageValid()\"><div class=icon-tick-purple></div></div></div><label ng-class=\"{\'to-fix\': scope.image && !scope.isImageValid()}\"><div class=form-helper-text>Have you got an image?<br>Please share!</div></label><div class=image--add ng-class=\"{\'to-fix\': scope.image && !scope.isImageValid()}\" ng-show=!scope.isImage() ngf-select ng-model=scope.image accept=image/*><div class=icon-camera></div><div class=image--add-text ng-show=!scope.image>Upload an Image</div><div class=image--add-text ng-show=\"scope.image && !scope.isImageValid()\">Choose a valid file type</div><div class=image--add-text--small>(5MB max - JPG/PNG/GIF)</div></div><img class=image--added ng-show=scope.isImage() ng-src=\"{{scope.image|\n             ngfDataUrl}}\" alt=image><div class=image--options ng-show=scope.isImage()><a class=\"image--option-btn success\" ngf-select ng-model=scope.image accept=image/*>Change Image</a> <a class=\"image--option-btn danger\" ng-click=\"scope.image = null\">Remove Image</a></div></div></form><form role=form name=form2 class=form-person-info novalidate><div class=form-group><label for=title class=required ng-class=\"{\'to-fix\': form2.title.$error.required && form2.title.$dirty}\"><div class=form-helper-text>Your Title</div></label><div class=lhr-select ng-class=\"{\'to-fix\': form2.title.$error.required && form2.title.$dirty}\"><select name=title id=title class=form-control required ng-model=scope.story.person.title><option value=\"\" disabled>{{(form2.title.$error.required && form2.title.$dirty) ? \'Please choose a title\' : \'Choose\'}}</option><option value=Mr>Mr</option><option value=Mrs>Mrs</option><option value=Ms selected>Ms</option><option value=Miss selected>Miss</option><option value=Dr selected>Dr</option><option value=Prof selected>Prof</option><option value=Rev selected>Rev</option></select></div></div><div class=form-group><label for=FirstName class=required ng-class=\"{\'to-fix\': form2.FirstName.$error.required && form2.FirstName.$dirty}\"><div class=form-helper-text>Your First name</div></label><input type=text class=form-control name=FirstName id=FirstName ng-model=scope.story.person.first_name placeholder=\"{{(form2.FirstName.$error.required && form2.FirstName.$dirty) ? \'Please tell us your First name\' : \'\'}}\" required></div><div class=form-group><label for=LastName class=required ng-class=\"{\'to-fix\': form2.LastName.$error.required && form2.LastName.$dirty}\"><div class=form-helper-text>Your Last Name</div></label><input type=text class=form-control name=LastName id=LastName ng-model=scope.story.person.last_name placeholder=\"{{(form2.LastName.$error.required && form2.LastName.$dirty) ? \'Please tell us your Last name\' : \'\'}}\" required></div><div class=form-group><label for=EmailAddress class=required ng-class=\"{\'to-fix\':((form2.EmailAddress.$error.required || form2.EmailAddress.$error.email) && form2.EmailAddress.$dirty)\n               || (form2.EmailAddressConfirm.$dirty\n                       && (form2.EmailAddressConfirm.$viewValue != form2.EmailAddress.$viewValue))}\"><div class=form-helper-text>Your Email address</div></label><input type=email class=form-control id=EmailAddress name=EmailAddress ng-model=scope.story.person.email_address ng-model-options=\"{ updateOn: \'blur\' }\" ng-class=\"{\'to-fix\':((form2.EmailAddress.$error.required || form2.EmailAddress.$error.email) && form2.EmailAddress.$dirty)\n                       || (form2.EmailAddressConfirm.$dirty\n                       && (form2.EmailAddressConfirm.$viewValue != form2.EmailAddress.$viewValue))}\" placeholder=\"{{(form2.EmailAddress.$error.required && form2.EmailAddress.$dirty) ? \'Please tell us your Email address\' : \'\'}}\" required></div><div class=form-group><label for=EmailAddressConfirm class=required ng-class=\"{\'to-fix\': form2.EmailAddressConfirm.$dirty\n                       && form2.EmailAddressConfirm.$viewValue != form2.EmailAddress.$viewValue\n                       }\"><div class=form-helper-text>Confirm Email address</div></label><input type=email class=form-control id=EmailAddressConfirm name=EmailAddressConfirm ng-model=scope.EmailAddressConfirm ng-model-options=\"{ updateOn: \'blur\' }\" ng-class=\"{\'to-fix\': form2.EmailAddressConfirm.$dirty\n                       && form2.EmailAddressConfirm.$viewValue != form2.EmailAddress.$viewValue\n                       }\" equals={{scope.story.person.email_address}} placeholder=\"{{(form2.EmailAddress.$error.required && form2.EmailAddress.$dirty) ? \'Please tell us your Email address\' : \'\'}}\" required></div><div class=form-group><label for=rewardsNum1 ng-class=\"{\'to-fix\': (form2.rewardsNum1.$invalid ||\n               form2.rewardsNum2.$invalid ||\n               form2.rewardsNum3.$invalid ||\n               form2.rewardsNum4.$invalid)}\"><div class=form-helper-text>Your Heathrow rewards card number?</div></label><div class=reward-field><input type=text class=\"form-control reward-num\" ng-pattern=/^[0-9]*$/ maxlength=4 reward-input name=rewardsNum1 id=rewardsNum1 ng-model=scope.reward.one> <input type=text class=\"form-control reward-num\" ng-pattern=/^[0-9]*$/ maxlength=4 reward-input name=rewardsNum2 id=rewardsNum2 ng-model=scope.reward.two> <input type=text class=\"form-control reward-num\" ng-pattern=/^[0-9]*$/ maxlength=4 reward-input name=rewardsNum3 id=rewardsNum3 ng-model=scope.reward.three> <input type=text class=\"form-control reward-num\" ng-pattern=/^[0-9]*$/ maxlength=4 reward-input name=rewardsNum4 id=rewardsNum4 ng-model=scope.reward.four></div></div><div class=form-group><label for=country class=required ng-class=\"{\'to-fix\': form2.country.$error.required && form2.country.$dirty}\"><div class=form-helper-text>Your Country</div></label><div class=lhr-select><select class=form-control name=country id=country ng-model=scope.story.person.country required><option value=\"\" disabled>{{(form2.country.$error.required && form2.country.$dirty) ? \'Please choose a Country\' : \'Choose\'}}</option><option value=\"United Kingdom\">United Kingdom</option><option disabled value=\"\">-------------------</option><option value=Afghanistan>Afghanistan</option><option value=Albania>Albania</option><option value=Algeria>Algeria</option><option value=\"American Samoa\">American Samoa</option><option value=Andorra>Andorra</option><option value=Angola>Angola</option><option value=Anguilla>Anguilla</option><option value=Antartica>Antarctica</option><option value=\"Antigua and Barbuda\">Antigua and Barbuda</option><option value=Argentina>Argentina</option><option value=Armenia>Armenia</option><option value=Aruba>Aruba</option><option value=Australia>Australia</option><option value=Austria>Austria</option><option value=Azerbaijan>Azerbaijan</option><option value=Bahamas>Bahamas</option><option value=Bahrain>Bahrain</option><option value=Bangladesh>Bangladesh</option><option value=Barbados>Barbados</option><option value=Belarus>Belarus</option><option value=Belgium>Belgium</option><option value=Belize>Belize</option><option value=Benin>Benin</option><option value=Bermuda>Bermuda</option><option value=Bhutan>Bhutan</option><option value=Bolivia>Bolivia</option><option value=\"Bosnia and Herzegowina\">Bosnia and Herzegowina</option><option value=Botswana>Botswana</option><option value=\"Bouvet Island\">Bouvet Island</option><option value=Brazil>Brazil</option><option value=\"British Indian Ocean Territory\">British Indian Ocean Territory</option><option value=\"Brunei Darussalam\">Brunei Darussalam</option><option value=Bulgaria>Bulgaria</option><option value=\"Burkina Faso\">Burkina Faso</option><option value=Burundi>Burundi</option><option value=Cambodia>Cambodia</option><option value=Cameroon>Cameroon</option><option value=Canada>Canada</option><option value=\"Cape Verde\">Cape Verde</option><option value=\"Cayman Islands\">Cayman Islands</option><option value=\"Central African Republic\">Central African Republic</option><option value=Chad>Chad</option><option value=Chile>Chile</option><option value=China>China</option><option value=\"Christmas Island\">Christmas Island</option><option value=\"Cocos Islands\">Cocos (Keeling) Islands</option><option value=Colombia>Colombia</option><option value=Comoros>Comoros</option><option value=Congo>Congo</option><option value=Congo>Congo, the Democratic Republic of the</option><option value=\"Cook Islands\">Cook Islands</option><option value=\"Costa Rica\">Costa Rica</option><option value=\"Cota D\'Ivoire\">Cote d\'Ivoire</option><option value=Croatia>Croatia (Hrvatska)</option><option value=Cuba>Cuba</option><option value=Cyprus>Cyprus</option><option value=\"Czech Republic\">Czech Republic</option><option value=Denmark>Denmark</option><option value=Djibouti>Djibouti</option><option value=Dominica>Dominica</option><option value=\"Dominican Republic\">Dominican Republic</option><option value=\"East Timor\">East Timor</option><option value=Ecuador>Ecuador</option><option value=Egypt>Egypt</option><option value=\"El Salvador\">El Salvador</option><option value=\"Equatorial Guinea\">Equatorial Guinea</option><option value=Eritrea>Eritrea</option><option value=Estonia>Estonia</option><option value=Ethiopia>Ethiopia</option><option value=\"Falkland Islands\">Falkland Islands (Malvinas)</option><option value=\"Faroe Islands\">Faroe Islands</option><option value=Fiji>Fiji</option><option value=Finland>Finland</option><option value=France>France</option><option value=\"France Metropolitan\">France, Metropolitan</option><option value=\"French Guiana\">French Guiana</option><option value=\"French Polynesia\">French Polynesia</option><option value=\"French Southern Territories\">French Southern Territories</option><option value=Gabon>Gabon</option><option value=Gambia>Gambia</option><option value=Georgia>Georgia</option><option value=Germany>Germany</option><option value=Ghana>Ghana</option><option value=Gibraltar>Gibraltar</option><option value=Greece>Greece</option><option value=Greenland>Greenland</option><option value=Grenada>Grenada</option><option value=Guadeloupe>Guadeloupe</option><option value=Guam>Guam</option><option value=Guatemala>Guatemala</option><option value=Guinea>Guinea</option><option value=Guinea-Bissau>Guinea-Bissau</option><option value=Guyana>Guyana</option><option value=Haiti>Haiti</option><option value=\"Heard and McDonald Islands\">Heard and Mc Donald Islands</option><option value=\"Holy See\">Holy See (Vatican City State)</option><option value=Honduras>Honduras</option><option value=\"Hong Kong\">Hong Kong</option><option value=Hungary>Hungary</option><option value=Iceland>Iceland</option><option value=India>India</option><option value=Indonesia>Indonesia</option><option value=Iran>Iran (Islamic Republic of)</option><option value=Iraq>Iraq</option><option value=Ireland>Ireland</option><option value=Israel>Israel</option><option value=Italy>Italy</option><option value=Jamaica>Jamaica</option><option value=Japan>Japan</option><option value=Jordan>Jordan</option><option value=Kazakhstan>Kazakhstan</option><option value=Kenya>Kenya</option><option value=Kiribati>Kiribati</option><option value=\"Democratic People\'s Republic of Korea\">Korea, Democratic People\'s Republic of</option><option value=Korea>Korea, Republic of</option><option value=Kuwait>Kuwait</option><option value=Kyrgyzstan>Kyrgyzstan</option><option value=Lao>Lao People\'s Democratic Republic</option><option value=Latvia>Latvia</option><option value=Lebanon selected>Lebanon</option><option value=Lesotho>Lesotho</option><option value=Liberia>Liberia</option><option value=\"Libyan Arab Jamahiriya\">Libyan Arab Jamahiriya</option><option value=Liechtenstein>Liechtenstein</option><option value=Lithuania>Lithuania</option><option value=Luxembourg>Luxembourg</option><option value=Macau>Macau</option><option value=Macedonia>Macedonia, The Former Yugoslav Republic of</option><option value=Madagascar>Madagascar</option><option value=Malawi>Malawi</option><option value=Malaysia>Malaysia</option><option value=Maldives>Maldives</option><option value=Mali>Mali</option><option value=Malta>Malta</option><option value=\"Marshall Islands\">Marshall Islands</option><option value=Martinique>Martinique</option><option value=Mauritania>Mauritania</option><option value=Mauritius>Mauritius</option><option value=Mayotte>Mayotte</option><option value=Mexico>Mexico</option><option value=Micronesia>Micronesia, Federated States of</option><option value=Moldova>Moldova, Republic of</option><option value=Monaco>Monaco</option><option value=Mongolia>Mongolia</option><option value=Montserrat>Montserrat</option><option value=Morocco>Morocco</option><option value=Mozambique>Mozambique</option><option value=Myanmar>Myanmar</option><option value=Namibia>Namibia</option><option value=Nauru>Nauru</option><option value=Nepal>Nepal</option><option value=Netherlands>Netherlands</option><option value=\"Netherlands Antilles\">Netherlands Antilles</option><option value=\"New Caledonia\">New Caledonia</option><option value=\"New Zealand\">New Zealand</option><option value=Nicaragua>Nicaragua</option><option value=Niger>Niger</option><option value=Nigeria>Nigeria</option><option value=Niue>Niue</option><option value=\"Norfolk Island\">Norfolk Island</option><option value=\"Northern Mariana Islands\">Northern Mariana Islands</option><option value=Norway>Norway</option><option value=Oman>Oman</option><option value=Pakistan>Pakistan</option><option value=Palau>Palau</option><option value=Panama>Panama</option><option value=\"Papua New Guinea\">Papua New Guinea</option><option value=Paraguay>Paraguay</option><option value=Peru>Peru</option><option value=Philippines>Philippines</option><option value=Pitcairn>Pitcairn</option><option value=Poland>Poland</option><option value=Portugal>Portugal</option><option value=\"Puerto Rico\">Puerto Rico</option><option value=Qatar>Qatar</option><option value=Reunion>Reunion</option><option value=Romania>Romania</option><option value=Russia>Russian Federation</option><option value=Rwanda>Rwanda</option><option value=\"Saint Kitts and Nevis\">Saint Kitts and Nevis</option><option value=\"Saint Lucia\">Saint Lucia</option><option value=\"Saint Vincent\">Saint Vincent and the Grenadines</option><option value=Samoa>Samoa</option><option value=\"San Marino\">San Marino</option><option value=\"Sao Tome and Principe\">Sao Tome and Principe</option><option value=\"Saudi Arabia\">Saudi Arabia</option><option value=Senegal>Senegal</option><option value=Seychelles>Seychelles</option><option value=Sierra>Sierra Leone</option><option value=Singapore>Singapore</option><option value=Slovakia>Slovakia (Slovak Republic)</option><option value=Slovenia>Slovenia</option><option value=\"Solomon Islands\">Solomon Islands</option><option value=Somalia>Somalia</option><option value=\"South Africa\">South Africa</option><option value=\"South Georgia\">South Georgia and the South Sandwich Islands</option><option value=Span>Spain</option><option value=SriLanka>Sri Lanka</option><option value=\"St. Helena\">St. Helena</option><option value=\"St. Pierre and Miguelon\">St. Pierre and Miquelon</option><option value=Sudan>Sudan</option><option value=Suriname>Suriname</option><option value=Svalbard>Svalbard and Jan Mayen Islands</option><option value=Swaziland>Swaziland</option><option value=Sweden>Sweden</option><option value=Switzerland>Switzerland</option><option value=Syria>Syrian Arab Republic</option><option value=Taiwan>Taiwan, Province of China</option><option value=Tajikistan>Tajikistan</option><option value=Tanzania>Tanzania, United Republic of</option><option value=Thailand>Thailand</option><option value=Togo>Togo</option><option value=Tokelau>Tokelau</option><option value=Tonga>Tonga</option><option value=\"Trinidad and Tobago\">Trinidad and Tobago</option><option value=Tunisia>Tunisia</option><option value=Turkey>Turkey</option><option value=Turkmenistan>Turkmenistan</option><option value=\"Turks and Caicos\">Turks and Caicos Islands</option><option value=Tuvalu>Tuvalu</option><option value=Uganda>Uganda</option><option value=Ukraine>Ukraine</option><option value=\"United Arab Emirates\">United Arab Emirates</option><option value=\"United Kingdom\">United Kingdom</option><option value=\"United States\">United States</option><option value=\"United States Minor Outlying Islands\">United States Minor Outlying Islands</option><option value=Uruguay>Uruguay</option><option value=Uzbekistan>Uzbekistan</option><option value=Vanuatu>Vanuatu</option><option value=Venezuela>Venezuela</option><option value=Vietnam>Vietnam</option><option value=\"Virgin Islands (British)\">Virgin Islands (British)</option><option value=\"Virgin Islands (U.S)\">Virgin Islands (U.S.)</option><option value=\"Wallis and Futana Islands\">Wallis and Futuna Islands</option><option value=\"Western Sahara\">Western Sahara</option><option value=Yemen>Yemen</option><option value=Yugoslavia>Yugoslavia</option><option value=Zambia>Zambia</option><option value=Zimbabwe>Zimbabwe</option></select></div></div><div class=\"uk-address-form fade\" ng-show=\"scope.story.person.country === \'United Kingdom\'\"><div class=form-group><label for=address_line_1 class=required ng-class=\"{\'to-fix\': form2.address_line_1.$error.required && form2.address_line_1.$dirty}\"><div class=form-helper-text>Your Address Line 1</div></label><input type=text class=form-control name=address_line_1 id=address_line_1 ng-model=scope.story.person.address_line_1 placeholder=\"{{(form2.address_line_1.$error.required && form2.address_line_1.$dirty) ? \'Please tell us your address_line_1\' : \'\'}}\" required></div><div class=form-group><label for=address_line_2><div class=form-helper-text>Your Address Line 2</div></label><input type=text class=form-control name=address_line_2 id=address_line_2 ng-model=scope.story.person.address_line_2></div><div class=form-group><label for=address_line_3><div class=form-helper-text>Your Address Line 3</div></label><input type=text class=form-control name=address_line_3 id=address_line_3 ng-model=scope.story.person.address_line_3></div><div class=form-group><label for=town><div class=form-helper-text>Your town</div></label><input type=text class=form-control name=town id=town ng-model=scope.story.person.town></div><div class=form-group><label for=county><div class=form-helper-text>Your county</div></label><input type=text class=form-control name=county id=county ng-model=scope.story.person.county></div><div class=form-group><label for=postcode class=required ng-class=\"{\'to-fix\': form2.postcode.$error.required && form2.postcode.$dirty}\"><div class=form-helper-text>Your Postcode</div></label><input type=text class=form-control name=postcode id=postcode ng-model=scope.story.person.postcode placeholder=\"{{(form2.postcode.$error.required && form2.postcode.$dirty) ? \'Please tell us your Postcode\' : \'\'}}\" required></div></div><div class=\"purple-message-box fade\" ng-show=\"scope.story.person.country !== \'United Kingdom\' && form2.country.$dirty\">We’re sorry, we can only send Birthday Presents to a UK address. We’d still love to hear your story though – it will still be included in our celebrations!</div></form><form action=\"\" role=form name=form3 id=checkbox-form class=form-checkboxes><div class=\"form-group lhr-checkbox\" ng-class=\"{\'to-fix\': form3.isOver18.$error.required\n                && form3.isOver18.$dirty}\"><div class=lhr-checkbox--text><label>I am over 18 years of age.</label><div class=required-checkbox>*</div></div><input type=checkbox required name=isOver18 id=isOver18 ng-model=scope.checks.isOver18></div><div class=\"form-group lhr-checkbox\" ng-class=\"{\'to-fix\': form3.termsConditions.$error.required\n                && form3.termsConditions.$dirty}\"><div class=lhr-checkbox--text><label>I have read and agree with the <a class=link href=/page/terms target=_blank>terms and conditions</a>.</label><div class=required-checkbox>*</div></div><input type=checkbox required name=termsConditions id=termsConditions ng-model=scope.checks.termsConditions></div><div class=\"form-group lhr-checkbox\"><div class=lhr-checkbox--text><label>I would like to receive updates and offers from Heathrow from time to time.</label></div><input type=checkbox ng-model=scope.story.agree_marketing></div></form><button type=submit class=\"btn btn-submit form-group\" ng-click=\"scope.submitForm(form, form2, form3)\" ng-class=\"{\'disabled\':!scope.checks.isOver18 && !scope.checks.termsConditions}\"><div class=btn-text>Add Your Story</div><div class=icon-plane-takeoff></div></button><div class=mandatory>* Mandatory Fields</div></div><div ng-show=scope.isSubmitted class=success-submit><div class=logo-box><a href=/ ><img src=/static/assets/images/heath70_logo-main_@x2.png alt=\"70th anniversary logo\"></a></div><div class=\"hero-box has-content\"><div class=hero-box--text><div class=success-box--text-md ng-bind-html=scope.message.subTitle></div><h1 class=success-box--text-lg ng-bind-html=scope.message.title></h1></div></div><div class=\"success-box--text hero-box--content\" ng-repeat=\"line in scope.message.content\"><ng-bind-html ng-bind-html=line></ng-bind-html></div></div></div>");}]);
//# sourceMappingURL=../maps/scripts/app-9a165fe6ab.js.map
