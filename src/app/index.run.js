(function() {
  'use strict';

  angular
    .module('threebund')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
