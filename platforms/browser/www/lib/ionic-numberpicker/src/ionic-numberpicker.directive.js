//By Milk Can LLC
//https://github.com/milkcan

(function () {
  'use strict';

  angular.module('ionic-numberpicker')
    .directive('ionicNumberpicker', ionicNumberpicker);

  ionicNumberpicker.$inject = ['$ionicPopup'];
  function ionicNumberpicker($ionicPopup) {
    return {
      restrict: 'AE',
      replace: true,
      scope: {
        inputObj: "=inputObj"
      },
      link: function (scope, element, attrs) {

        //set up base variables and options for customization
        scope.inputValue = scope.inputObj.inputValue ? scope.inputObj.inputValue : 0;
        scope.minValue = typeof(scope.inputObj.minValue !== 'undefined') ? scope.inputObj.minValue : -9007199254740991;
        scope.maxValue = typeof(scope.inputObj.maxValue !== 'undefined') ? scope.inputObj.maxValue : 9007199254740991;
        scope.precision = scope.inputObj.precision ? scope.inputObj.precision : 3;
        scope.format = scope.inputObj.format ? scope.inputObj.format : 'DECIMAL';
        scope.unit = scope.inputObj.unit ? scope.inputObj.unit : '';
        scope.titleLabel = scope.inputObj.titleLabel ? scope.inputObj.titleLabel : 'Number Picker';
        scope.setLabel = scope.inputObj.setLabel ? scope.inputObj.setLabel : 'Set';
        scope.closeLabel = scope.inputObj.closeLabel ? scope.inputObj.closeLabel : 'Close';
        scope.decimalStep = scope.inputObj.decimalStep ? scope.inputObj.decimalStep : .25;
        scope.decimalCharacter = scope.inputObj.decimalCharacter ? scope.inputObj.decimalCharacter : '.';
        scope.setButtonType = scope.inputObj.setButtonType ? scope.inputObj.setButtonType : 'button-positive';
        scope.closeButtonType = scope.inputObj.closeButtonType ? scope.inputObj.closeButtonType : 'button-stable';

        scope.wholeNumber = 0;
        scope.decimalNumber = 0;
        scope.isNegative = false;
        scope.numericValue = Number(scope.wholeNumber + '.' + scope.decimalNumber);

        //Changing the style
        scope.changeFormat = function () {
          scope.format = (scope.format === "DECIMAL") ? "WHOLE" : "DECIMAL";
        };

        scope.decimalDisplay = function() {
          var sValue = scope.decimalNumber.toString();
          var index = sValue.indexOf(".");
          return sValue.substring(index + 1);
        }

        //Increasing the whole number
        scope.increaseWhole = function () {
          scope.numericValue += 1;
          scope.wholeNumber = findWholeNumber(scope.numericValue);
          scope.decimalNumber = strip(scope.numericValue % 1);

          scope.checkMax();
        };

        //Decreasing the whole number
        scope.decreaseWhole = function () {
          scope.numericValue -= 1;
          scope.wholeNumber = findWholeNumber(scope.numericValue);
          scope.decimalNumber = strip(scope.numericValue % 1);

          scope.checkMin();
        };

        //Increasing the decimal number
        scope.increaseDecimal = function () {
          scope.numericValue += scope.decimalStep;
          scope.wholeNumber = findWholeNumber(scope.numericValue);
          scope.decimalNumber = strip(scope.numericValue % 1);

          scope.checkMax();
        };

        //Decreasing the decimal number
        scope.decreaseDecimal = function () {
          scope.numericValue -= scope.decimalStep;
          scope.wholeNumber = findWholeNumber(scope.numericValue);
          scope.decimalNumber = strip(scope.numericValue % 1);

          scope.checkMin();
        };

        function strip(number, precision) {
          var returnVal = (parseFloat(number).toFixed(scope.precision));
          return returnVal;
        }

        function findWholeNumber(number) {
          var returnVal = 0;

          if (number >= 0) {
            scope.isNegative = false;
            returnVal = Math.floor(number);
          } else {
            scope.isNegative = true;
            returnVal = Math.ceil(number);
          }

          return Math.abs(returnVal);
        }

        //Make sure number is not too high
        scope.checkMax = function() {
          if (scope.numericValue >= scope.maxValue) {
            scope.numericValue = scope.maxValue;
            scope.wholeNumber = findWholeNumber(scope.numericValue);
            scope.decimalNumber = strip(scope.numericValue % 1);
          }
        }

        //Make sure number is not too low
        scope.checkMin = function() {
          if (scope.numericValue <= scope.minValue) {
            scope.numericValue = scope.minValue;
            scope.wholeNumber = findWholeNumber(scope.numericValue);
            scope.decimalNumber = strip(scope.numericValue % 1);
          }
        }

        //onclick of the button
        element.on("click", function () {
          if (scope.format == 'DECIMAL') {

            //Get Values from Initial Number
            scope.wholeNumber = findWholeNumber(Number(scope.inputValue));
            scope.decimalNumber = scope.inputValue % 1;
            scope.numericValue = Number(scope.wholeNumber) + Number(strip(scope.decimalNumber, scope.precision));
            scope.decimalNumber = strip(scope.numericValue % 1);

            $ionicPopup.show({
              templateUrl: 'ionic-numberpicker-decimal.html',
              title: scope.titleLabel,
              subTitle: '',
              scope: scope,
              buttons: [
                {
                  text: scope.closeLabel,
                  type: scope.closeButtonType,
                  onTap: function (e) {
                    scope.inputObj.callback(undefined);
                  }
                },
                {
                  text: scope.setLabel,
                  type: scope.setButtonType,
                  onTap: function (e) {
                    scope.loadingContent = true;
        
                    scope.numericValue = Number(scope.wholeNumber) + Number(strip(scope.decimalNumber, scope.precision));
                    scope.inputObj.callback(scope.numericValue);
                  }
                }
              ]
            });

          } else {
            //Get Values from Initial Number
            scope.wholeNumber = findWholeNumber(scope.inputValue);
            scope.decimalNumber = 0;
            scope.numericValue = Number(findWholeNumber(scope.wholeNumber)) + Number(strip(scope.decimalNumber, scope.precision));

            $ionicPopup.show({
              templateUrl: 'ionic-numberpicker-whole.html',
              title: scope.titleLabel,
              subTitle: '',
              scope: scope,
              buttons: [
                {
                  text: scope.closeLabel,
                  type: scope.closeButtonType,
                  onTap: function (e) {
                    scope.inputObj.callback(undefined);
                  }
                },
                {
                  text: scope.setLabel,
                  type: scope.setButtonType,
                  onTap: function (e) {
                    scope.loadingContent = true;

                    scope.inputObj.callback(scope.wholeNumber);
                  }
                }
              ]
            });
          }
        });
      }
    };
  }
})();
