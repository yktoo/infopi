(function () {
    'use strict';

    angular
        .module('app')
        .factory('WeatherService', WeatherService);

    WeatherService.$inject = ['$http', '$q'];
    function WeatherService($http, $q) {
        return {
            getWeather: getWeather
        };

        function getWeather(cityId) {
            return $http
                .get('/weather/' + cityId)
                .then(handleSuccess, handleError);
        }

        // Private functions

        function handleSuccess(response) {
            var data = response.data;
            data.updated = new Date();
            return data;
        }

        function handleError(response) {
            return $q.reject(response.data.message || response.data.errorMessage || response.statusText);
        }

    }

})();
