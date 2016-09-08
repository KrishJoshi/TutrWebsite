'use strict';

/**
 * @ngdoc function
 * @name tutrApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the tutrApp
 */


// TODO: Add saved message
angular.module('tutrApp')
  .controller('ProfileCtrl', function ($scope, $q, $rootScope, UserService, subjectService, growl) {
	$scope.model = {'email':'', 'first_name':'', 'last_name':'', 'gender':'', 'hourrate':'', 'subjects':'', 'education':'', 'degree':'', 'postcode':'', 'location':'', 'name_of_university':'', 'availability_from': '', 'availability_to': '', 'about':'', 'role':'', 'avatar':''};
	UserService.profile().then(function(data){
  		$scope.model = data;
  		console.log(data)
  		//$scope.model.avatar = $scope.link
  		
  	            
	var currentUser = $scope.model;
    var userBackup = angular.copy($rootScope.currentUser);
    var subjectsBackup = $scope.model.subjects || [];
    var typeBackup;
    $scope.userSubjects = [];
    // Start and End time
    if(typeof($rootScope.currentUser.availability) === "string") {
      $rootScope.currentUser.availability = {startTime:"", endTime:""};
    }

    // Get subject list for auto suggest

     $scope.subjectobjects = [];
     $scope.subjects = [];
    subjectService.getAllSubjects().then(function (result) {
      for (var i = 0; i < result.data.length; i++) {
        var subject = result.data[i];
        $scope.subjects.push(subject.name);
         console.log(subject.name)
      }
      $scope.subjectobjects.push(result.data);
 console.log(result.data)
    });
    /*var getSubject = function (subjectId) {
      subjectService.getSubjectById(subjectId).then(function (subject) {
        var subjectText = {text: subject.name};
        $scope.userSubjects.push(subjectText);
        
console.log(subjectText)
      });
    };
*/
    // Parse user's subjects
    for (var i = 0; i < subjectsBackup.length; i++) {
      var subject = subjectsBackup[i];
      //getSubject(subject.id);
        var subjectText = {text: subject.name};
        $scope.userSubjects.push(subjectText);
        
    }

  	});
  	
  	
     $scope.updateProfile = function(formData, model){
		 var subjects = [];
        for (var i = 0; i < $scope.userSubjects.length; i++) {
          var subject = $scope.userSubjects[i];
           console.log(subject.text)
           console.log($scope.subjectobjects)
  var result = $scope.subjectobjects[0].reduce(function(prev, curr) { return (curr.name === subject.text) ? curr : prev; }, null);  
subjects.push(result);

         }
         
 console.log(model)
	model.subjects=subjects
	 
 
 console.log(model)
 UserService.updateProfile(model)
        .then(function(data){
        	// success case
        	console.log(data)
        	 //growl.success("User changes saved successfully!");
        },function(data){
        	// error case
        	//growl.error(data);
        });
      
    }
   
        
  

   /* // Get user type
    UserService.getRoleByUser(currentUser).then(function (userTypeForServer) {
      typeBackup = userTypeForServer.name;
      $scope.currentUserType = userTypeForServer.name;
    }, function (error) {
      console.log(error);
    });*/

    $scope.addLocation = function () {
      console.log("run");
      var deferred = $q.defer();
      if ($rootScope.currentUser.postCode !== userBackup.postCode) {
        var locationApi = "http://maps.googleapis.com/maps/api/geocode/json?address={{postCode}},+UK&sensor=false";
        $.get(locationApi.replace("{{postCode}}", $rootScope.currentUser.postCode), function (returnData) {
          if (returnData.status === 'OK') {

            var loc = returnData.results[0].geometry.location;
            console.log(loc);
            $rootScope.currentUser.location = new Parse.GeoPoint({latitude: loc.lat, longitude: loc.lng});
            deferred.resolve();
          } else {
            deferred.resolve();
          }
        });
      } else {
        deferred.resolve();
      }
      return deferred.promise;
    };
    // TODO: if error then show a error

  

    // Saving function
    $scope.save = function () {
      currentUser = $rootScope.currentUser;
      var savePromises = [];

  
      // Location
      savePromises.push(locationAddition());

      // Subjects
      savePromises.push(addNewSubjects());


      // Lets save
      $q.all(savePromises).then(function () {
        Parse.User.current().set($rootScope.currentUser).save(null, {
          success: function (returnData) {
            console.log(returnData);
            growl.success("User changes saved successfully!");
          }, error: function (error) {
            growl.error(error);
          }
        });
      });

    };

    $scope.cancel = function () {

      $rootScope.currentUser = userBackup;
      $scope.newImage = null;
      growl.info("User changes were discarded");
    };
  });
