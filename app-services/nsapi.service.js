(function () {
    'use strict';

    angular
        .module('app')
        .factory('NsApiService', NsApiService);

    NsApiService.$inject = ['$http', '$q'];
    function NsApiService($http, $q) {
        return {
            getTrainTimes: getTrainTimes
        };

        function getTrainTimes(stationId) {
            return $http.get(
                'http://webservices.ns.nl/ns-api-avt?station=ut',
                {params: {station: stationId}}
                {
                    headers: {
                        'Authorization': 'Basic !!!!!!!!!!!!!'
                    }
                })
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
