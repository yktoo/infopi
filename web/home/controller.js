(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$interval', 'NsApiService', 'BuienRadarService', 'OvapiService', 'FxService', 'CryptoService', 'DomoticzService'];
    function HomeController($interval, NsApiService, BuienRadarService, OvapiService, FxService, CryptoService, DomoticzService) {
        var vm = this;
        var trainDepTimesStation = 'htnc';   // Houten Castellum
        var travelAdvFromStation = 'htnc';   // Houten Castellum
        var travelAdvToStation   = 'gvc';    // Den Haag Centraal
        var ovapiBusStopCode     = 'hoterv'; // De Erven/De Schaft
        var buienRadarStationId  = '6260';   // Meetstation De Bilt
        var domoticzUrl          = 'http://pihub/';

        // Publish VM properties
        vm.updateNow            = updateNow;
        vm.updateWeather        = updateWeather;
        vm.updateDepartureTimes = updateDepartureTimes;
        vm.updateTravelAdvice   = updateTravelAdvice;
        vm.updateBusData        = updateBusData;
        vm.updateFx             = updateFx;
        vm.fx                   = [
            {ccy: 'EUR', label: '€'},
            {ccy: 'USD', label: '$'},
            {ccy: 'GBP', label: '£'},
            {ccy: 'JPY', label: '¥'},
            {ccy: 'CHF', label: 'Fr'}];
        vm.updateSensors        = updateSensors;

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

        function updateBusData() {
            OvapiService.getBusData(ovapiBusStopCode).then(function (data) { vm.busData = data});
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
            // Get cryptocurrency rates
            CryptoService.getRates('BTC,ETH', 'EUR')
                .then(function (data) {
                    vm.cryptoRates = [
                        {label: 'ETH', rate: data.ETH.EUR},
                        {label: 'BTC', rate: data.BTC.EUR}
                    ];
                })
        }

        function updateSensors() {
            DomoticzService(domoticzUrl, 'devices', {used: true})
                .then(function (data) {
                    // "result" should be an array of device entries
                    vm.sensors = data.result;
                    // Store the SecurityPanel as a separate object
                    vm.securityPanel = {};
                    for (var i = 0; i < vm.sensors.length; i++)
                        if (vm.sensors[i].Name === 'SecurityPanel') {
                            vm.securityPanel = vm.sensors[i];
                            break;
                        }
                });
        }

        // Private functions

        function init() {
            // Initially update the data
            updateNow();
            updateWeather();
            updateDepartureTimes();
            updateTravelAdvice();
            updateBusData();
            updateFx();
            updateSensors();
            // Schedule regular updates
            $interval(updateNow,            10 * 1000);       // 10 sec
            $interval(updateWeather,        10 * 60 * 1000);  // 10 min
            $interval(updateDepartureTimes, 30 * 1000);       // 30 sec
            $interval(updateTravelAdvice,   1  * 60 * 1000);  // 1 min
            $interval(updateBusData,        30 * 1000);       // 30 sec
            $interval(updateFx,             60 * 60 * 1000);  // 1 hour
            $interval(updateSensors,        10 * 1000);       // 10 sec
        }

    }

})();
