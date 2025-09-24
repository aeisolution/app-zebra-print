var app = angular.module('app');

app.directive('moDateInput', function ($window) {
    return {
        require: '^ngModel',
        restrict: 'A',
        link: function (scope, elm, attrs, ctrl) {

            var moment = $window.moment;
            var dateFormat = attrs.moDateInput;
            attrs.$observe('moDateInput', function (newValue) {
                if (dateFormat == newValue || !ctrl.$modelValue) return;
                dateFormat = newValue;
                ctrl.$modelValue = new Date(ctrl.$setViewValue);
            });
            ctrl.$formatters.unshift(function (modelValue) {
                if (!dateFormat || !modelValue) {
                    return null;
                }
                else {
                    return moment(modelValue).format(dateFormat);
                }
            });
            ctrl.$parsers.unshift(function (viewValue) {
                var date = moment(viewValue, dateFormat);
                if (date && date.isValid() && date.year() > 1850) {
                    return date.toDate();
                }else{
                }
            });
        }
    };
});
