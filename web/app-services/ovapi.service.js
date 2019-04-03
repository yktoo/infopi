(function () {
    'use strict';

    angular
        .module('app')
        .factory('OvapiService', OvapiService);

    OvapiService.$inject = ['$http', '$q'];
    function OvapiService($http, $q) {
        return {
            getBusData: getBusData
        };

        /**
         * Requests latest bus data for a specific bus stop.
         * @param stopCode string Bus stop code.
         * @returns Promise resolving the bus data.
         */
        function getBusData(stopCode) {
            return $http
                .get('/ovapi', {params: {stop_code: stopCode}})
                .then(handleSuccess, handleError)
                .then(function (data) {
                    var passes = [];
                    // Extract and "flatten" the passes
                    angular.forEach(data, function (stop) {
                        angular.forEach(stop.Passes, function (pass) {
                            passes.push(pass);
                        });
                    });
                    // Sort passes by target departure time
                    return passes.sort(function (a, b) {
                        return a.TargetDepartureTime < b.TargetDepartureTime ?
                            -1 :
                            (a.TargetDepartureTime > b.TargetDepartureTime);
                    });
                });
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
