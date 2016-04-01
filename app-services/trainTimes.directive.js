(function () {
    'use strict';

    angular
        .module('app')
        .directive('trainTimes', TrainTimes);

    TrainTimes.$inject = ['$interval', 'NsApiService'];
    function TrainTimes($interval, NsApiService) {
        return {
            restrict:    'E',
            scope:       {title: '@', stationId: '@'},
            templateUrl: 'app-services/trainTimes.tpl.html',
            link:        link
        };

        function link(scope, element, attrs) {
            var timeoutId;

            // Stop polling on destroy
            element.on('$destroy', function() {
                $interval.cancel(timeoutId);
            });

            // Subscribe to periodic updates
            timeoutId = $interval(update, 1000);
            update();

            function update() {
                NsApiService.getTrainTimes(attrs.stationId)
                    .then(handleTrainTimes, handleError);
            }

            function handleTrainTimes(data) {
                scope.trains = [{time: new Date(), delay: attrs.stationId}];

            }

            function handleError(reason) {
                scope.trains = [{time: reason}];
            }

        }

    }

})();
