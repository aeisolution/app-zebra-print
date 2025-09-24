var app = angular.module('app');

app.directive('dateInputDir', function ($window) {
    return {
        restrict: 'C',
        link: function (scope, elm, attrs, ctrl) {
            elm.datepicker({
                format: 'dd/mm/yyyy',
                autoclose: true,
                todayHighlight: true,
                orientation: "bottom auto"
              });
        }
    };
});
