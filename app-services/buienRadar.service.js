(function () {
    'use strict';

    angular
        .module('app')
        .factory('BuienRadarService', BuienRadarService);

    BuienRadarService.$inject = ['$http', '$q'];
    function BuienRadarService($http, $q) {
        return {
            getWeather: getWeather
        };

        function getWeather(stationId) {
            return $http
                .get('/buienradar', {params: {station: stationId}})
                .then(handleSuccess, handleError);
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
