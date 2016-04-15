(function () {
    'use strict';

    angular
        .module('app')
        .directive('trainTimes', TrainTimes);

    TrainTimes.$inject = ['$interval', 'NsApiService'];
    function TrainTimes($interval, NsApiService) {
        return {
            scope:       {},
            templateUrl: 'app-services/trainTimes.tpl.html',
            link:        link
        };

        function link(scope, element, attrs) {
            var timeoutId = null;

            // Stop polling on destroy
            element.on('$destroy', function() {
                timeoutId && $interval.cancel(timeoutId);
            });

            // Subscribe to periodic updates
            timeoutId = $interval(update, attrs.interval || 30000);
            update();

            function update() {
                NsApiService.getTrainTimes(attrs.trainTimes).then(handleSuccess, handleError);
            }

            function handleSuccess(data) {
                scope.trains = data;
            }

            function handleError(reason) {
                scope.trains = [{time: 'N/A', delay: '', dest: reason, type: '', platf: ''}];
            }

        }

    }

})();
