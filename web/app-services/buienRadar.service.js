(function () {
    'use strict';

    angular
        .module('app')
        .factory('BuienRadarService', BuienRadarService);

    BuienRadarService.$inject = ['$http', '$q'];
    function BuienRadarService($http, $q) {
        return {
            getWeather:     getWeather,
            getRadarMapUrl: getRadarMapUrl
        };

        function getWeather(stationId) {
            return $http
                .get('/buienradar', {params: {station: stationId}})
                .then(handleSuccess, handleError);
        }

        function getRadarMapUrl() {
            return 'http://www.buienradar.nl/lokalebuienradar/' +
                '?lat=52.02833&lng=5.16806'+
                '&overname=2' +
                '&zoom=8' +
                '&size=3' +
                '&voor=1' +
                '&random=' + Math.random();
        }

        // Private functions

        function handleSuccess(response) {
            return response.data;
        }

        function handleError(response) {
            return $q.reject(response.data.message || response.data.errorMessage || response.statusText);
        }

    }

})();
