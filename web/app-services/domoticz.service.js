(function () {
    'use strict';

    angular
        .module('app')
        .factory('DomoticzService', DomoticzService);

    DomoticzService.$inject = ['$http'];
    function DomoticzService($http) {

        /**
         * Runs a REST request on Domoticz server.
         */
        return function (url, type, params) {
            return $http
                .get(url + 'json.htm', {params: angular.extend({type: type}, params)})
                .then(handleSuccess, handleError);
        };

        // Private functions

        function handleSuccess(response) {
            return response.data;
        }

        function handleError(response) {
            return $q.reject(response.data.message || response.data.errorMessage || response.statusText);
        }

    }

})();
