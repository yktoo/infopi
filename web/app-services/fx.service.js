(function () {
    'use strict';

    angular
        .module('app')
        .factory('FxService', FxService);

    FxService.$inject = ['$http', '$q', '$filter'];
    function FxService($http, $q, $filter) {
        var _cache = {};
        return {
            getFxRates: getFxRates
        };

        /**
         * Requests latest FX rates from fixer.io.
         * @param base string Base currency, default is EUR.
         * @param date string Date to get the rates on (Date or string in the format 'yyyy-MM-dd'). If null/undefined,
         *                    defaults to the latest available date.
         * @returns Promise resolving the FX data.
         */
        function getFxRates(base, date) {
            // Format the date if needed
            if (date instanceof Date) date = $filter('date')(date, 'yyyy-MM-dd');
            // Check if cached data is available (never for the 'latest' quote)
            return date && _cache[date] ?
                $q.when(_cache[date]) :
                $http
                    .get('http://api.fixer.io/' + (date || 'latest'), {params: {base: base || 'EUR'}})
                    .then(handleSuccess, handleError);
        }

        // Private functions

        function handleSuccess(response) {
            var fx = response.data;
            // Cache the data
            _cache[fx.date] = fx;
            return fx;
        }

        function handleError(response) {
            return $q.reject(response.data.message || response.data.errorMessage || response.statusText);
        }

    }

})();
