(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$interval', 'NsApiService', 'BuienRadarService', 'FxService'];
    function HomeController($interval, NsApiService, BuienRadarService, FxService) {
        var vm = this;
        var trainDepTimesStation = 'htnc'; // Houten Castellum
        var travelAdvFromStation = 'htnc'; // Houten Castellum
        var travelAdvToStation   = 'asb';  // Houten Amsterdam Bijlmer Arena
        var buienRadarStationId  = '6260'; // Meetstation De Bilt

        // Publish VM properties
        vm.updateNow            = updateNow;
        vm.updateWeather        = updateWeather;
        vm.updateDepartureTimes = updateDepartureTimes;
        vm.updateTravelAdvice   = updateTravelAdvice;
        vm.updateFx             = updateFx;
        vm.fx                   = [
            {ccy: 'EUR', label: '€'},
            {ccy: 'USD', label: '$'},
            {ccy: 'GBP', label: '£'},
            {ccy: 'JPY', label: '¥'},
            {ccy: 'CHF', label: 'Fr'}];

        // Initially update the data
        init();

        function updateNow() {
            vm.now = new Date();
        }

        function updateWeather() {
            BuienRadarService.getWeather(buienRadarStationId).then(function (data) { vm.weather = data; });
            vm.radarMapUrl = BuienRadarService.getRadarMapUrl();
        }

        function updateDepartureTimes() {
            NsApiService.getTrainTimes(trainDepTimesStation).then(function (data) { vm.trainDepartureTimes = data});
        }

        function updateTravelAdvice() {
            NsApiService
                .getTravelAdvice({
                    from: travelAdvFromStation,
                    to:   travelAdvToStation,
                    prev: 1,
                    next: 5
                })
                .then(function (data) {
                    vm.travelAdvices = data;
                });
        }

        function updateFx() {
            var curRates, prevRates;
            // Get quotes for today (or the last working day before today)
            FxService.getFxRates('RUB')
                .then(function (data) {
                    curRates = data;
                    // Get quotes for the day before
                    return FxService.getFxRates('RUB', new Date(new Date(data.date) - 1000 * 3600 * 24));
                })
                .then(function (data) {
                    prevRates = data;
                    // Calculate reciprocals and moves and store them in vm.fx
                    vm.fx.forEach(function (e) {
                        var curVal  = 1/(curRates.rates[e.ccy] || null);
                        var prevVal = prevRates.rates[e.ccy] ? 1/prevRates.rates[e.ccy] : curVal;
                        e.rate = curVal;
                        e.move = Math.abs(curVal - prevVal);
                        e.movedUp   = curVal > prevVal;
                        e.movedDown = curVal < prevVal;
                    });
                });
        }

        // Private functions

        function init() {
            updateNow();
            updateWeather();
            updateDepartureTimes();
            updateTravelAdvice();
            updateFx();
            // Schedule regular updates
            $interval(updateNow,            10 * 1000);       // 10 sec
            $interval(updateWeather,        10 * 60 * 1000);  // 10 min
            $interval(updateDepartureTimes, 30 * 1000);       // 30 sec
            $interval(updateTravelAdvice,   1  * 60 * 1000);  // 1 min
            $interval(updateFx,             60 * 60 * 1000);  // 1 hour
        }

    }

})();
