(function () {
    'use strict';

    angular
        .module('app')
        .factory('CryptoService', CryptoService);

    CryptoService.$inject = ['$http'];
    function CryptoService($http) {
        return {
            getRates: getRates
        };

        /**
         * Requests latest cryptocurrency rates from cryptocompare.com.
         * @param fsyms string Cryptocurrency symbols to get quotes for, comma-separated, eg. 'BTC,ETH'.
         * @param tsyms string Currencies to provide quotes for, comma-separated, eg. 'EUR,USD'.
         * @returns Promise resolving the rate data.
         */
        function getRates(fsyms, tsyms) {
            return $http
                    .get('https://min-api.cryptocompare.com/data/pricemulti', {params: {fsyms: fsyms, tsyms: tsyms}})
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
