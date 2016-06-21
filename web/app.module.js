(function () {
    'use strict';

    angular.module('app', [])
        .config(function($sceDelegateProvider) {
            $sceDelegateProvider.resourceUrlWhitelist([
                // Allow same origin resource loads
                'self',
                // Allow loading from buienradar
                'http://www.buienradar.nl/**'
            ]);
        });

})();
