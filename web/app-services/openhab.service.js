(function () {
    'use strict';

    angular
        .module('app')
        .factory('OpenHabService', OpenHabService);

    OpenHabService.$inject = ['$http', '$q'];
    function OpenHabService($http, $q) {

        /**
         * Runs a REST request on the OpenHAB server.
         */
        return function (base_url, item) {
            return $http
                .get(base_url + '/rest/items/' + item, {params: {}})
                .then(handleSuccess, handleError);
        };

        // Private functions

        function handleSuccess(response) {
            return response.data;
        }

        function handleError(response) {
            return $q.reject(response.data ?
                response.data.message || response.data.errorMessage :
                response.statusText);
        }

    }

})();
