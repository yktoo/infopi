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
            return 'http://buienradar.nl/image/' +
                '?type=forecast3hourszozw' +
                '&fn=buienradarnl-1x1-ani700-verwachting-3uur.gif' +
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
