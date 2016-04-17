(function () {
    'use strict';

    angular
        .module('app')
        .factory('NsApiService', NsApiService);

    NsApiService.$inject = ['$http', '$q'];
    function NsApiService($http, $q) {
        return {
            getTrainTimes:   getTrainTimes,
            getTravelAdvice: getTravelAdvice
        };

        /**
         * Requests train time table for the given station.
         * @param stationId str ID of the station to request time table for.
         * @returns Promise resolving the time table.
         */
        function getTrainTimes(stationId) {
            return $http
                .get('/ns/dep-times', {params: {station: stationId}})
                .then(handleSuccess, handleError);
        }

        /**
         * Requests travel advice.
         * @param params Object Request parameters contaning following members:
         *   from    Code/name of the departure station. Required.
         *   to      Code/name of the arrival station. Required.
         *   via     Code/name of the en route station.
         *   prev    Required number of past advices. Default and maximum is 5.
         *   next    Required number of future advices. Default and maximum is 5.
         *   time    ISO8601 formatted date/time, e.g. '2012-02-21T15:50'.
         *   isDep   Boolean, true - dateTime is departure time (default), false - it's arrival time.
         *   hsl     Boolean, whether to include high-speed trains. Default is true.
         *   annCard Boolean, whether the user has an annual travel card. Default is false.
         * @returns Promise resolving the travel advice object.
         */
        function getTravelAdvice(params) {
            return $http
                .get(
                    '/ns/travel-advice',
                    {
                        params: {
                            from_st:      params.from,
                            to_st:        params.to,
                            via_st:       params.via,
                            num_prev:     params.prev,
                            num_next:     params.next,
                            time:         params.time,
                            is_departure: params.isDep,
                            hsl:          params.hsl,
                            ann_card:     params.annCard
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
