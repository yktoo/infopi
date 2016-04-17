(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$interval', 'NsApiService', 'BuienRadarService'];
    function HomeController($interval, NsApiService, BuienRadarService) {
        var vm = this;
        var buienRadarStationId = '6260'; // Meetstation De Bilt

        // Publish VM properties
        vm.updateNow          = updateNow;
        vm.updateWeather      = updateWeather;
        vm.updateTravelAdvice = updateTravelAdvice;

        // Initially update the data
        init();

        function updateNow() {
            vm.now = new Date();
        }

        function updateWeather() {
            BuienRadarService.getWeather(buienRadarStationId).then(function (data) { vm.weather = data; });
        }

        function updateTravelAdvice() {
            NsApiService
                .getTravelAdvice({
                    from: 'htnc', // Houten Castellum
                    to:   'asb',  // Amsterdam Bijlmer Arena
                    prev: 1,
                    next: 5
                })
                .then(function (data) {
                    vm.travelAdvices = data;
                });
        }

        // Private functions

        function init() {
            updateNow();
            updateWeather();
            updateTravelAdvice();
            // Schedule regular updates
            $interval(updateNow,          10 * 1000);       // 10 sec
            $interval(updateWeather,      10 * 60 * 1000);  // 10 min
            $interval(updateTravelAdvice, 1  * 60 * 1000);  // 1 min
        }

    }

})();
