var app = angular.module('app');

app.directive('numbersOnly', function ($window) {
    return {
        require: '^ngModel',
        link: function (scope, elm, attrs, ctrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');
                    if (transformedInput !== text) {
                        ctrl.$setViewValue(transformedInput);
                        ctrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }            
            ctrl.$parsers.push(fromUser);
        }
    };
});

app.directive('letersOnly', function ($window) {
    return {
        require: '^ngModel',
        link: function (scope, elm, attrs, ctrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^a-zA-Z]/g, '');
                    if (transformedInput !== text) {
                        ctrl.$setViewValue(transformedInput);
                        ctrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }            
            ctrl.$parsers.push(fromUser);
        }
    };
});

app.directive('cleanOnDisable', function ($window) {
    return {
        require: '^ngModel',
        restrict: 'A',
        link: function (scope, elm, attrs, ctrl) {
            scope.$watch(function () {
                if (elm[0].disabled) {
                    ctrl.$setViewValue(undefined);
                    ctrl.$render();
                }
            });
        }
    };
});

app.directive('cleanOnHideRequired', function ($window) {
    return {
        require: '^ngModel',
        restrict: 'A',
        link: function (scope, elm, attrs, ctrl) {
            scope.$watch(function () {
                if (!elm.context.attributes.required) {
                    ctrl.$setViewValue(undefined);
                    ctrl.$render();
                }
            });
        }
    };
});
