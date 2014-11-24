/************************************************************************************************************************/
/*************************************************** app_services.js ****************************************************/
/************************************************************************************************************************/

define(['app'], function (itcApp) {
  
  /*
  USAGE: get and set...
  For creating a new app (appType = ios)
  */
  itcApp.factory('createAppService',function($http){
    var myService = {
      load: function(appType) {
        var promise = $http.get(global_itc_path + '/ra/apps/create/?appType='+appType,{ cache: false}).then(function (response) {
          console.log("CREATE APP - LOAD DATA");
          console.log(response.data);
          return response.data;
        });
        // Return the promise to the controller
        return promise;
      },
      create: function(appType, appDetails) {
          var promise = $http.post(global_itc_path + '/ra/apps/create/?appType=' + appType, appDetails).then(function(response) {
            console.log("CREATE APP - SAVE DATA");
            console.log(response.data);
            return response.data;
          },function(reason) {
            return reason;
          });
          // Return the promise to the controller
          return promise
        }
    };
    return myService;
  });

  itcApp.factory('updateAppService',function($http){
    var myService = {
      load:function(adamId) {
        var promise = $http.get(global_itc_path + '/ra/apps/'+adamId+'/update').then(function (response) {
          return response.data;
        });
        return promise;
      },
      save:function(adamId,appdata) {
        var promise = $http.post(global_itc_path + '/ra/apps/'+adamId+'/update',appdata).then(function (response) {
          return response.data;
        });
        return promise;
      }
    }
    return myService;
  });

    /*
    USAGE: create new version
    */
    itcApp.service('createAppVersionService',function($http){
      var myService = {
        create: function(adamId, versionNum) {
          var promise = $http.post(global_itc_path + '/ra/apps/version/create/' + adamId, versionNum).then(function(response) {
            console.log("CREATE APP Version");
            console.log(response.data);
            return response.data;
          },function(reason) {
            return reason;
          });
          // Return the promise to the controller
          return promise
        }
      };
      return myService;
    });

   /*
    USAGE: Delete an app
    */
    itcApp.service('deleteAppService',function($http){
      var myService = {
        delete: function(link) {
          var promise = $http.post(link).then(function(response) {
            console.log(response.data);
            return response.data;
          },function(reason) {
            return reason;
          });
          // Return the promise to the controller
          return promise;
        }
    };
      return myService;
    }); 

    /*
    USAGE: Dev reject an app
    */
    itcApp.service('devRejectAppService',function($http){
      var myService = {
        reject: function(adamId) {
          var promise = $http.post(global_itc_path + '/ra/apps/version/reject/' + adamId).then(function(response) {
            console.log(response.data);
            return response.data;
          },function(reason) {
            return reason;
          });
          // Return the promise to the controller
          return promise;
        }
    };
      return myService;
    }); 

  /*
  USAGE: two functions:
  async(adamId) -> get all IAPs associated with given App AdamId
  excludedIap(adamId) -> get all IAPs from provider not associated to a particular App (AdamId)
  */
  itcApp.factory('iapDataService', function($http) {
    var myService = {
      async: function(adamId) {
        var promise = $http.get(global_itc_path + '/ra/addons/list?appAdamId='+adamId).then(function (response) {
          console.log("IAP DATA SERVICE RESPONSE >>>>");
          console.log(response.data);
          return response.data;
        },function(reason){
          //error handling
          return reason;
        });
        // Return the promise to the controller
        return promise;
      },
      excludedIap: function(adamId) {
        var promise = $http.get(global_itc_path + '/ra/addons/list').then(function (response) {
          //response.data
          var excludedData = [];
          console.log(response.data);
          angular.forEach(response.data.data, function(value){
              var include = true;
              angular.forEach(value.purpleSoftwareAdamIds, function(value){
                  if (value===adamId) {
                      include = false;
                  }
              });
              if (include) {
                  excludedData.push(value);
              }
          });
          console.log("IAP DATA SERVICE (EXCLUSION) RESPONSE >>>>");
          console.log(excludedData);
          return excludedData;
        });
        return promise;
      },
      iapDetails: function(addonAdamId) {
        var promise = $http.get(global_itc_path + '/ra/addon/detail/'+addonAdamId).then(function (response) {
          console.log("IAP DETAILS DATA SERVICE RESPONSE >>>>");
          console.log(response.data);
          return response.data;
        });
        // Return the promise to the controller
        return promise;
      }
    };
    return myService;
  });

  /*
  USAGE: async(adamId) -> Returns app summary data for app AdamID 
  */
  itcApp.factory('appSummaryService',function($http){
    var myService = {
      async: function(adamId) {
        var promise = $http.get(global_itc_path + '/ra/apps/summary/'+adamId).then(function (response) {
          console.log("APP SUMMARY SERVICE RESPONSE >>>>");
          console.log(response.data);
          return response.data;
        },function(reason){
          return reason;
        });
        // Return the promise to the controller
        return promise;
      }
    };
    return myService;
  });

  /*
  USAGE: three functions
  async(adamId) -> Returns app detail data for app AdamID **ONLY APP OVERVIEW**
  versionInfo(adamId,[true/false/null(blank)]) -> return version info if second parameter is not included - version returned will be either inFlightVersion if it exists, or live version if no inFlightVersion exists
  getBuildCandidates -> returns list of available build candidates to attach to an app version
  */
  itcApp.factory('appDetailsService',function($http){
    var myService = {
        async: function(adamId) {
            var promise = $http.get(global_itc_path + '/ra/apps/detail/'+adamId,{cache:false}).then(function (response) {
                // console.log("APP DETAIL SUMMARY SERVICE RESPONSE >>>>");
                // console.log(response.data);
                return response.data;
            },function(reason){
                return reason;
            });
            // Return the promise to the controller
            return promise;
        },
        versionInfo: function(adamId,isLive) {
            var requestLive = "";
            if (isLive !== undefined && isLive) {
                requestLive = "?v=live";
            }
            var promise = $http.get(global_itc_path + '/ra/apps/version/'+adamId+requestLive,{cache:false}).then(function (response) {
                    // console.log("APP VERSION INFO SERVICE RESPONSE >>>>");
                    // console.log(response.data);
                    return response.data;
                },function(reason){
                    return reason;
            });
            // Return the promise to the controller
            return promise;
        },
        getBuildCandidates: function(adamId) {
            var promise = $http.get(global_itc_path + '/ra/apps/version/candidateBuilds/' + adamId).then(function(response) {
            console.log("Build candidates >>>>");
            console.log(response.data);
            return response.data;
          },function(reason) {
            return reason;
          });
          // Return the promise to the controller
          return promise
        }
    };
    return myService;
  });

  /*
  USAGE: async(adamId) -> Returns addon details addon AdamID 
  */
  itcApp.factory('iapDetailService',function($http){
    var myService = {
      async: function(adamId) {
        var promise = $http.get(global_itc_path + '/ra/addon/detail/'+adamId).then(function (response) {
          console.log("IAP DETAIL SERVICE RESPONSE >>>>");
          console.log(response.data);
          return response.data;
        });
        // Return the promise to the controller
        return promise;
      }
    };
    return myService;
  });
  
  /*
  USAGE: async() -> Returns app trailer reference data 
   */
  itcApp.factory('appVersionReferenceDataService', function($http) {
    var myService = {
      async: function() {
        var promise = $http.get(global_itc_path + '/ra/apps/version/ref').then(function (response) {
          // console.log("APP VERSION REFERENCE DATA SERVICE RESPONSE >>>>");
          // console.log(response.data);
          return response.data;
        },function(reason){
          return reason;
        });
        // Return the promise to the controller
        return promise;
      }
    };
    return myService;
  });

  /*
    Usage: Save Version Details - (note to Karen) this is for screenshots and trailer only
  */
  itcApp.service('saveVersionDetailsService',function($http){
    var myService = {
      async: function(adamId, versionDetails) {
        var promise = $http.post(global_itc_path + '/ra/apps/version/details/save/' + adamId, versionDetails).then(function(response) {
          console.log("SAVE VERSION DETAILS SERVICE RESPONSE >>>>");
          console.log(response.data);
          return response.data;
        },function(reason) {
          return reason;
        });
        // Return the promise to the controller
        return promise
      }
    };
	    return myService;
	  });

    /*
      Usage: Save Version - and submit for review
    */
    itcApp.service('saveVersionService',function($http){
      var myService = {
        async: function(adamId, versionDetails,isLive) {
          var requestLive = "";
          if (isLive !== undefined && isLive) {
              requestLive = "?v=live";
          }
          var promise = $http.post(global_itc_path + '/ra/apps/version/save/' + adamId+requestLive, versionDetails).then(function(response) {
            return response.data;
          },function(reason) {
            return reason;
          });
          // Return the promise to the controller
          return promise
        },
        submitForReview: function(adamId,versionDetails) {
          var promise = $http.post(global_itc_path + '/ra/apps/' + adamId + '/version/submit/start', versionDetails).then(function(response) {
            return response.data;
          },function(reason) {
            return reason;
          });
          // Return the promise to the controller
          return promise;
        },
        finalizeSubmitForReview: function(adamId,versionDetails) {
          var promise = $http.post(global_itc_path + '/ra/apps/' + adamId + '/version/submit/complete', versionDetails).then(function(response) {
            return response.data;
          },function(reason) {
            return reason;
          });
          // Return the promise to the controller
          return promise;
        },
        releaseVer:function(adamId) {
          var promise = $http.post(global_itc_path + '/ra/apps/'+adamId+'/releaseToStore',adamId).then(function(response) {
            console.log("THIS IS THE DATA");
            console.log(response.data);
            return response.data;
          });
          return promise;
        }
    };
      return myService;
    });


  /*
  USAGE: async() -> Returns manage apps summary data
  */
  itcApp.factory('loadManageAppsDataService',function($http){
    var manageAppsService = {
      async: function() {
        var promise = $http.get(global_itc_path + '/ra/apps/manageyourapps/summary').
          success(function (data, status, headers, config) {
            console.log(">>> loadManageAppsDataService: ", data);
            return data;
          }).
          error(function (data, status, headers, config) {
            return data;
          });
        return promise;
      }
    };
    return manageAppsService;
  });

  itcApp.service('bundleDataService',function($http){
    var bundleService = {
      approvedAppList: function() {
        var promise = $http.get(global_itc_path + '/ra/apps/approved/list?appType=ios').
          success(function (data, status, headers, config) {
            console.log(">>> bundleDataService approvedAppList: ", data);
            return data;
          }).
          error(function (data, status, headers, config) {
            return data;
          });
        return promise;
      },

      reference: function(adamIdList) {
        var promise = $http.get(global_itc_path + '/ra/appbundles/metareference', {params: {adamIds: adamIdList }}).
          success(function (data, status, headers, config) {
            console.log(">>> bundleDataService reference: ", data);
            return data;
          }).
          error(function (data, status, headers, config) {
            return data;
          });
        return promise;
      },

      create: function(bundleData) {
        var promise = $http.post(global_itc_path + '/ra/appbundles/createOrUpdate', bundleData).then(function(response) {
          // log('posting to /ra/appbundles/createOrUpdate:', bundleData);
          // log(JSON.stringify(bundleData))
          console.log(">>> bundleDataService create: ", response);
          return response;
        },function(reason) {
          return reason;
        });
        return promise
      },
      submit: function(bundleAdamId) {
        var promise = $http.post(global_itc_path + '/ra/appbundles/submit/' + bundleAdamId).then(function(response) {
          console.log(">>> bundleDataService submit: ", response);
          return response;
        },function(reason) {
          return reason;
        });
        return promise
      },
      remove: function(bundleAdamId) {
        var promise = $http.post(global_itc_path + '/ra/appbundles/devreject/' + bundleAdamId).then(function(response) {
          console.log(">>> bundleDataService devreject: ", response);
          return response;
        },function(reason) {
          return reason;
        });
        return promise
      },
      detail: function(bundleAdamId) {
        var promise = $http.get(global_itc_path + '/ra/appbundles/metadetail/' + bundleAdamId).then(function(response) {
          console.log(">>> bundleDataService detail: ", response);
          return response;
        },function(reason) {
          return reason;
        });
        return promise
      },
      icon: function(bundleAdamId) {
        var promise = $http.get(global_itc_path + '/ra/appbundles/icon/' + bundleAdamId).then(function(response) {
          console.log(">>> bundleDataService icon: ", response);
          return response;
        },function(reason) {
          return reason;
        });
        return promise
      },
      pricing: function(selectedPriceTier) {
        var promise = $http.get(global_itc_path + '/ra/appbundles/pricetier/' + selectedPriceTier).then(function(response) {
          console.log(">>> bundleDataService pricing: ", response);
          return response;
        },function(reason) {
          return reason;
        });
        return promise
      },
      contentStatus: function(bundleAdamId) {
        var promise = $http.get(global_itc_path + '/ra/appbundles/status/' + bundleAdamId).then(function(response) {
          console.log(">>> bundleDataService contentStatus: ", response);
          return response;
        },function(reason) {
          return reason;
        });
        return promise
      }
    };
    return bundleService;
  });

  itcApp.factory('manageAppsStateService', ['$rootScope', function ($rootScope) {

    var service = {
      
      selectedType: 'All Types',
      selectedStatus: 'all',

      SaveState: function () {
        sessionStorage.manageAppsStateService.type = service.selectedType;
        sessionStorage.manageAppsStateService.status = service.selectedStatus;
      },

      RestoreState: function () {
        service.selectedType = sessionStorage.manageAppsStateService.type;
        service.selectedStatus = sessionStorage.manageAppsStateService.status;
      }

    };

    $rootScope.$on("savestate", service.SaveState);
    $rootScope.$on("restorestate", service.RestoreState);

    return service;

  }]);


});


