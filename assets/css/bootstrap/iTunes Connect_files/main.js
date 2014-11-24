/************************************************************************************************************************/
/******************************************************* main.js ********************************************************/
/************************************************************************************************************************/

require.config({
    waitSeconds: 0,
    paths: {
        'app': global_itc_path + '/wa/route?noext'
    }
});

require([
    'app',
    getGlobalPath('/itc/js/ng-app/directives/form_elements.js'), //not tied to itcApp
    getGlobalPath('/itc/js/ng-app/directives/global_directives.js'), //not tied to itcApp
    getGlobalPath('/itc/js/ng-app/services/routeResolver.js'), //not tied to itcApp
    getGlobalPath('/itc/js/ng-app/services/global_services.js'), //not tied to itcApp
    getGlobalPath('/itc/js/ng-app/filters/global_filters.js'), //not tied to itcApp
    getGlobalPath('/itc/js/ng-app/lib/angular-file-upload2/angular-file-upload-shim.js'), //not tied to itcApp
    getGlobalPath('/itc/js/ng-app/lib/angular-file-upload2/angular-file-upload.js'), //not tied to itcApp
    getGlobalPath('/itc/js/ng-app/lib/angular-file-upload2/upload.js'), //not tied to itcApp
    getGlobalPath('/itc/js/ng-app/lib/angular-animate.js'), //not tied to itcApp
    getGlobalPath('/itc/js/ng-app/controllers/page-wrapper_cntrl.js'),
    getGlobalPath('/itc/js/ng-app/services/app_services.js'),
    getGlobalPath('/itc/js/ng-app/services/prerelease_services.js'),
    getGlobalPath('/itc/js/ng-app/directives/homepage_directives.js'),
    getGlobalPath('/itc/js/ng-app/directives/app_iap_directives.js'),
    getGlobalPath('/itc/js/ng-app/bindonce.js'),
    getGlobalPath('/itc/js/ng-app/directives/ui-sortable.js'),
    getGlobalPath('/itc/js/ng-app/filters/angular-filter.js'),
    getGlobalPath('/itc/js/ng-app/services/manage_users_services.js'),
    getGlobalPath('/itc/js/ng-app/directives/app_directives.js'),

    getGlobalPath('/itc/js/ng-app/filters/app_filters.js'),
    getGlobalPath('/itc/js/ng-app/utilities.js'),
    
    getGlobalPath('/itc/js/ng-app/lib/angulartics.js'),       // Angular analytics library
    getGlobalPath('/itc/js/ng-app/lib/angulartics-adobe.js'), // Plugin for Omniture
    getGlobalPath('/itc/js/ng-app/lib/angular-sanitize.js'),

    /* for app trailer */
    getGlobalPath('/itc/js/ng-app/directives/drop_directive.js'),
    getGlobalPath('/itc/js/ng-app/directives/snapshot_directive.js'),
    getGlobalPath('/itc/js/ng-app/directives/video_snapshot_grab_directive.js'),
    getGlobalPath('/itc/js/ng-app/directives/centering_directives.js'),
    getGlobalPath('/itc/js/ng-app/directives/menu_item_pill_directive.js'),
    getGlobalPath('/itc/js/ng-app/directives/image_slideshow_directive.js'),
    getGlobalPath('/itc/js/ng-app/directives/simple_image_directive.js'),
    getGlobalPath('/itc/js/ng-app/directives/simple_drop_directive.js'),
    getGlobalPath('/itc/js/ng-app/directives/simple_image_drop_combo_directive.js'),
    getGlobalPath('/itc/js/ng-app/directives/simple_fileicon_directive.js'),
    getGlobalPath('/itc/js/ng-app/directives/simple_filedrop_directive.js'),
    getGlobalPath('/itc/js/ng-app/directives/simple_file_drop_combo_directive.js'),
    getGlobalPath('/itc/js/ng-app/directives/snapshot_errors_directive.js'),
    
    getGlobalPath('/itc/js/ng-app/directives/prerelease_directives.js')
],function () {
    angular.bootstrap(document, ['itcApp', 'ngAnimate']);
});


