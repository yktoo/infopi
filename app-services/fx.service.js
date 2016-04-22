(function () {
    'use strict';

    angular
        .module('app')
        .factory('FxService', FxService);

    FxService.$inject = ['$http', '$q'];
    function FxService($http, $q) {
        return {
            getFxRates: getFxRates
        };

        /**
         * Requests latest FX rates from fixer.io.
         * @param base string Base currency, default is EUR.
         * @returns Promise resolving the FX data.
         */
        function getFxRates(base) {
            return $http
                .get('http://api.fixer.io/latest', {params: {base: base || 'EUR'}})
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
