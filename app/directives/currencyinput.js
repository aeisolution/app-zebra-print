var app = angular.module('app');

const localStringToNumber =  function( s ){
  return Number(String(s).replace(/[^0-9.,-]+/g,""));
}

// app.directive('format', ['$filter', function ($filter) {
//     return {
//         require: '^ngModel',
//         link: function (scope, elem, attrs, ctrl) {
//             if (!ctrl) return;

//             if (!ctrl) return;

//             ctrl.$formatters.unshift(function (a) {
//               var value = isNaN(ctrl.$modelValue) ? null : $filter(attrs.format)(ctrl.$modelValue);
//               if(typeof(value)=='string') {
//                 value = value.replace(/,/g,'');
//               }
//               return value == null ? null : parseFloat(value).toFixed(2);
//             });

//             elem.bind('focus', function(e) {
//               var value = e.target.value;
//               e.target.value = value ? localStringToNumber(value) : '';
//             });

//             elem.bind('blur', function(e) {
//               var value = e.target.value;
//               e.target.value = parseFloat(value).toFixed(2);
//             });


//         }
//     };
// }]);

// app.filter('comma2decimal', [
//   function() { // should be altered to suit your needs
//       return function(input) {
//       var ret=(input)?input.toString().trim().replace(",","."):null;
//           return parseFloat(ret);
//       };
//   }]);

//   app.filter('decimal2comma', [
//     function() {// should be altered to suit your needs
//         return function(input) {
//             var ret=(input)?input.toString().replace(".",","):null;
//             if(ret){
//                 var decArr=ret.split(",");
//                 if(decArr.length>1){
//                     var dec=decArr[1].length;
//                     if(dec===1){ret+="0";}
//                 }//this is to show prices like 12,20 and not 12,2
//             }
//             return ret;
//         };
//     }]);

// app.directive('price', ['$filter',
//   function($filter) {
//   return {
//       restrict:'A',
//       require: 'ngModel',
//       link: function(scope, element, attrs, ngModelController) {
//           ngModelController.$parsers.push(function(data) {
//               //convert data from view format to model format

//               data=$filter('comma2decimal')(data);

//               return data;
//           });

//           ngModelController.$formatters.push(function(data) {
//               //convert data from model format to view format

//               data=$filter('decimal2comma')(data);

//               return data;
//           });
//       }
//   };}]);