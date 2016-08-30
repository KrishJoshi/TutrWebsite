'use strict';

/**
 * @ngdoc directive
 * @name tutrApp.directive:image
 * @description
 * # image
 */
angular.module('tutrApp')
	.directive('myUpload', function() {
    return {
        link: function postLink(scope, element, attrs) {
            element.find("input").bind("change", function(changeEvent) {                        
                var reader = new FileReader();
                reader.onload = function(loadEvent) {
                    scope.$apply(function() {
                        scope[attrs.key] = loadEvent.target.result;                                
                    });
                }
                if (typeof(changeEvent.target.files[0]) === 'object') {
                    reader.readAsDataURL(changeEvent.target.files[0]);
                };
            });

        },
        controller: 'FileUploadCtrl',
        template:
                '<span class="btn btn-success fileinput-button">' +
                '<i class="glyphicon glyphicon-plus"></i>' +
                '<span>Replace Image</span>' +
                '<input type="file" accept="image/*" name="files[]" multiple="">' +
                '</span>',
        restrict: 'E'

    };
});
