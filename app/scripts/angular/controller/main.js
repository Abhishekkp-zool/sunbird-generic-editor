/**
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */
'use strict';

angular.module('editorApp', ['ngDialog', 'oc.lazyLoad', 'Scope.safeApply']).config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);
angular.module('editorApp').controller('popupController', ['ngDialog', '$ocLazyLoad', function(ngDialog, $ocLazyLoad) {
    function loadNgModules(templatePath, controllerPath) {
        return $ocLazyLoad.load([
            { type: 'html', path: templatePath },
            { type: 'js', path: controllerPath }
        ]);
    };

    function openModal(config, callback) {
        if (config && callback) config.preCloseCallback = callback;
        if (config) ngDialog.open(config);
    };
    org.ekstep.contenteditor.api.getService('popup').initService(loadNgModules, openModal);
}]);
angular.module('editorApp').controller('MainCtrl', ['$scope', '$ocLazyLoad', '$location',
    function($scope, $ocLazyLoad, $location) { 

        $scope.loadNgModules = function(templatePath, controllerPath) {
            var files = [];
            if (templatePath) files.push({ type: 'html', path: templatePath });
            if (controllerPath) files.push({ type: 'js', path: controllerPath });
            if (files.length) return $ocLazyLoad.load(files)
        };  

        org.ekstep.contenteditor.containerManager.initialize({loadNgModules: $scope.loadNgModules, scope: $scope });        

        // container scope starts
        $scope.editorContainer = undefined;
        $scope.addToContainer = function(container) {
            $scope.editorContainer = container;
            $scope.$safeApply();            
        }
        // container scope ends

        document.title = 'Generic-Editor';

        /** Initialize base editor */
        var context = org.ekstep.contenteditor.getWindowContext();
        context.uid = context.user ? context.user.id : context.uid;
        context.etags = context.etags || {};
        context.etags.app = context.app || context.etags.app || [];
        context.etags.partner = context.partner || context.etags.partner || [];
        context.etags.dims = context.dims || context.etags.dims || [];
        
        var config = org.ekstep.contenteditor.getWindowConfig();
        config.absURL = $location.protocol() + '://' + $location.host() + ':' + $location.port() // Required

        config.genericeditorPlugins = config.plugins || org.ekstep.contenteditor.config.plugins;
        config.plugins = [        
            { "id": "org.ekstep.genericeditor", "ver": "1.0", "type": "plugin" }
        ]
        org.ekstep.contenteditor.init(context, config, $scope, undefined, function() {
            $scope.contentService = org.ekstep.contenteditor.api.getService(ServiceConstants.CONTENT_SERVICE);            
            $scope.popupService = org.ekstep.contenteditor.api.getService(ServiceConstants.POPUP_SERVICE);            
        });           
    }
]);
