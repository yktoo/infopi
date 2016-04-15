(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$interval', 'WeatherService'];
    function HomeController($interval, WeatherService) {
        var vm = this;
        var weatherCityId = '1811978';

        // Publish VM properties
        vm.updateNow     = updateNow;
        vm.updateWeather = updateWeather;

        // Initially update the data
        init();

        function updateNow() {
            vm.now = new Date();
        }

        function updateWeather() {
            WeatherService.getWeather(weatherCityId).then(function (data) { vm.weather = data; });
        }

        // Private functions

        function init() {
            updateNow();
            updateWeather();
            // Schedule regular updates
            $interval(updateNow,     10 * 1000);       // 10 sec
            $interval(updateWeather, 10 * 60 * 1000);  // 10 min
        }

    }

})();
