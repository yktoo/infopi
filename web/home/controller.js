(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$interval', 'NsApiService', 'BuienRadarService', 'OvapiService', 'FxService', 'CryptoService', 'OpenHabService'];
    function HomeController($interval, NsApiService, BuienRadarService, OvapiService, FxService, CryptoService, OpenHabService) {
        var vm = this;
        var trainDepTimesStation1 = 'htnc';   // Houten Castellum
        var trainDepTimesStation2 = 'ut';     // Utrecht Centraal
        var ovapiBusStopCode      = 'hoterv'; // De Erven/De Schaft
        var buienRadarStationId   = '6260';   // Meetstation De Bilt
        var openHabServerUrl      = 'http://pihub:8080';

        // Publish VM properties
        vm.updateNow            = updateNow;
        vm.updateWeather        = updateWeather;
        vm.updateDepartureTimes = updateDepartureTimes;
        vm.updateBusData        = updateBusData;
        vm.updateFx             = updateFx;
        vm.fx                   = [
            {ccy: 'EUR', label: '€'},
            {ccy: 'USD', label: '$'},
            {ccy: 'GBP', label: '£'},
            {ccy: 'JPY', label: '¥'},
            {ccy: 'CHF', label: 'Fr'}];
        vm.updateSecurity       = updateSecurity;

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
            NsApiService.getTrainTimes(trainDepTimesStation1).then(function (data) { vm.trainDepartureTimes1 = data});
            NsApiService.getTrainTimes(trainDepTimesStation2).then(function (data) { vm.trainDepartureTimes2 = data});
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
                    // Calculate moves and store them in vm.fx
                    vm.fx.forEach(function (e) {
                        var curVal  = curRates.rates[e.ccy] || null;
                        var prevVal = prevRates.rates[e.ccy] || curVal;
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

        function updateSecurity() {
            OpenHabService(openHabServerUrl, 'gSecurity')
                .then(function (data) {
                    // Read members of the gSecurity group
                    vm.securityDevices = data.members;
                    // Store the securityAccessControl as a separate object
                    vm.securityAccessControl = {};
                    for (var i = 0; i < vm.securityDevices.length; i++)
                        if (vm.securityDevices[i].name === 'GF_Hallway_RfidKeypad_AccessControl') {
                            vm.securityAccessControl = vm.securityDevices[i];
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
            updateBusData();
            updateFx();
            updateSecurity();
            // Schedule regular updates
            $interval(updateNow,            10 * 1000);       // 10 sec
            $interval(updateWeather,        10 * 60 * 1000);  // 10 min
            $interval(updateDepartureTimes, 30 * 1000);       // 30 sec
            $interval(updateBusData,        30 * 1000);       // 30 sec
            $interval(updateFx,             60 * 60 * 1000);  // 1 hour
            $interval(updateSecurity,       10 * 1000);       // 10 sec
        }

    }

})();
