/************************************************************************************************************************/
/*************************************************** routeResolver.js ***************************************************/
/************************************************************************************************************************/

'use strict';

define([], function() {

    var routeResolver = function() {

        this.$get = function() {
            return this;
        };

        this.routeConfig = function() {
            var viewsDirectory = '';
            var controllersDirectory = '/itc/js/ng-app/controllers/';

            var setBaseDirectories = function(viewsDir, controllersDir) {
                viewsDirectory = viewsDir;
                controllersDirectory = controllersDir;
            };

            var getViewsDirectory = function() {
                return viewsDirectory;
            };

            var getControllersDirectory = function() {
                return controllersDirectory;
            };
            
            var getControllerPath = function(filename) {
                //getGlobalPath is a global function defined on ngMainPage!
                var path = getGlobalPath(getControllersDirectory() + filename + '.js');
                return path;
            }

            return {
                setBaseDirectories: setBaseDirectories,
                getControllersDirectory: getControllersDirectory,
                getViewsDirectory: getViewsDirectory,
                getControllerPath: getControllerPath
            };
        }();

        this.route = function(routeConfig) {

            var resolve = function( config ) {
                
                var controllerPathName = config.controllerPath || '',
                    controllerName     = config.controllerName || '',
                    templatePath       = config.templatePath   || '',
                    reloadOnSearch     = (typeof config.reloadOnSearch === 'boolean') ? config.reloadOnSearch : true,
                    trackingConfig     = config.trackingConfig || { pageName: '', channel: '' },
                    pageConfig         = config.pageConfig || { };
            
                var routeDef = {
                    templateUrl:    getGlobalPath(templatePath), //getGlobalPath is a global function defined on ngMainPage!
                    controller:     controllerName,
                    trackingConfig: trackingConfig
                };

                if (reloadOnSearch === false) {
                    routeDef.reloadOnSearch = reloadOnSearch;
                }

                routeDef.resolve = {
                    load: ['$q', '$rootScope',
                        function($q, $rootScope) {
                            
                            // Create array of paths for dependencies
                            var dependencies = (controllerPathName instanceof Array) ?
                                _.map( controllerPathName, function(path) {
                                    return routeConfig.getControllerPath( path );
                                }) : [routeConfig.getControllerPath( controllerPathName )];
                            
                            // Applying tracking config for this route                           
                            applyTrackingMetadata( trackingConfig );

                            return resolveDependencies($q, $rootScope, dependencies);
                        }
                    ],
                    pageConfig: function() { return pageConfig; }
                };

                return routeDef;
            },

            resolveDependencies = function($q, $rootScope, dependencies) {
                var defer = $q.defer();
                require(dependencies, function() {
                    defer.resolve();
                    $rootScope.$apply()
                });

                return defer.promise;
            },
            
            //
            // Omniture functions --
            // Whenever we change routes, these functions take the trackingConfig 
            
            isProd = (location.hostname === "itunesconnect.apple.com") ? true : false,
            
            
            // Hier5 tells Omniture which "bucket" to place this pageview under (in the Omniture dashboard)
            // this function receives an integer, and returns a complete hier5 string.
            // Examples:
            //      ""   -> "appleitmsitcdev"
            //      "01" -> "appleitmsitc01dev,appleitmsitcdev"
            constructHier = function(val) {
                var val = val || '', hierString = '';
                    
                if (val !== '') {
                    hierString += 'appleitmsitc' + val + ((isProd)?'':'qa') + 'dev,';
                }
                
                hierString += 'appleitmsitc' + ((isProd)?'':'qa') + 'dev';
                
                return hierString;
            },
            
            // Using the pageName / channel defined in each route, set these on
            // the global Omniture object "s" before we resolve the route.
            // If these parameters are not provided, then reset those values to "".
            applyTrackingMetadata = function( trackingConfig ) {
                  var c = trackingConfig;
                  if (c === undefined) return false;
                  s.pageName = (c.pageName !== undefined) ? c.pageName : ''; // e.g. "App - Summary"
                  s.channel  = (c.channel  !== undefined) ? c.channel  : ''; // e.g. "Manage Your App"
                  s.hier5    = constructHier(c.hier5); // e.g. "appleitmsitcdev"
                  return trackingConfig;
            };

            return {
                resolve: resolve
            }
            
        }(this.routeConfig);
    };

    var servicesApp = angular.module('routeResolverServices', []);

    //Must be a provider since it will be injected into module.config()    
    servicesApp.provider('routeResolver', routeResolver);
});

