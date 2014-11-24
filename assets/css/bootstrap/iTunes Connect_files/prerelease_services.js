/************************************************************************************************************************/
/************************************************ prerelease_services.js ************************************************/
/************************************************************************************************************************/

define(['app'], function (itcApp) {

    itcApp.factory( 'preReleaseBuildsDataService', function($http){
        return {
            load: function(adamId) {
                return $http.get(global_itc_path + '/ra/apps/'+adamId+'/trains/',{cache:false}).then(function (response) {
                    return response.data;
                }, function(error) { return error; });
            },
            save: function(adamId, payload) {
                return $http.post(global_itc_path + '/ra/apps/'+adamId+'/trains/', payload).then(function (response) {
                    return response.data;
                }, function(error) { return error; });
            },
            devReject: function(adamId, train, build) {
                return $http.post(global_itc_path + '/ra/apps/'+adamId+'/trains/'+train+'/builds/'+build+'/reject', {}).then(function (response) {
                    return response.data;
                }, function(error) { return error; });
            }
        };
    });

    itcApp.factory('buildTestersService',function($http){
        var myService = {
            load: function(adamId,train,build) {
                return $http.get(global_itc_path + '/ra/apps/'+adamId+'/trains/'+train+'/builds/'+build+'/testers').then(function (response) {
                    //console.log("LOAD TESTERS");
                    //console.log(response.data);
                    return response.data;
                }, function(error) { return error; });
                // return promise;
            },
            loadTestInfo: function(adamId,train,build) {
                var promise = $http.get(global_itc_path + '/ra/apps/'+adamId+'/trains/'+train+'/builds/'+build+'/testInformation').then(function (response) {
                    //console.log("LOAD TEST INFO");
                    //console.log(response.data);
                    return response.data;
                });
                return promise;
            },
            saveTestInfo: function(adamId,train,build,testinfodata) {
                var promise = $http.post(global_itc_path + '/ra/apps/'+adamId+'/trains/'+train+'/builds/'+build+'/testInformation',testinfodata).then(function (response) {
                    //console.log("SAVE TEST INFO");
                    //console.log(response.data);
                    return response.data;
                });
                return promise;
            },
            loadExportInfo: function(adamId,train,build) {
                var promise = $http.get(global_itc_path + '/ra/apps/'+adamId+'/trains/'+train+'/builds/'+build+'/exportcompliance').then(function (response) {
                    console.log("EXPORT INFO");
                    console.log(response.data);
                    return response.data;
                });
                return promise;
            },
            saveExportInfo: function(adamId,train,build,exportinfodata) {
                var promise = $http.post(global_itc_path + '/ra/apps/'+adamId+'/trains/'+train+'/builds/'+build+'/exportcompliance',exportinfodata).then(function (response) {
                    console.log("EXPORT INFO Save");
                    console.log(response.data);
                    return response.data;
                });
                return promise;
            }
        };
        return myService;
    });



    itcApp.factory( 'preReleaseTestersDataService', function($http){
        return {
            // INTERNAL TESTERS
            getInternalTesters: function(adamId) {
                return $http.get(global_itc_path + '/ra/user/internalTesters/'+adamId+'/').then(function (response) {
                    return response.data;
                }, function(error) { return error; });
            },
            saveInternalTesters: function(adamId, payload) {
                return $http.post(global_itc_path + '/ra/user/internalTesters/'+adamId+'/', payload).then( function(response) {
                    return response.data;
                }, function (error) { return error; })
            },
            inviteInternalTesters: function(adamId) {
                return $http.post(global_itc_path + '/ra/apps/'+adamId+'/sendInternalInvites/', {}).then( function(response) {
                    return response.data;
                }, function(error) { return error; });
            },
            inviteExternalTesters: function(adamId, build) {
                
                return $http.post(global_itc_path + '/ra/user/externalTesters/'+adamId+'/invite/', build).then( function(response) {
                    return response.data;
                }, function(error) { return error; });
                
                // return "not implemented yet";
                // return $http.get(global_itc_path + '/ra/apps/'+adamId+'/sendExternalInvites/').then( function(response) {
                //     return response.data;
                // }, function(error) { return error; });
            },
            // EXTERNAL TESTERS
            getExternalTesters: function(adamId) {
                return $http.get(global_itc_path + '/ra/user/externalTesters/'+adamId+'/').then(function (response) {
                    return response.data;
                }, function(error) { return error; });
            },
            saveExternalTesters: function(adamId, payload) {
                return $http.post(global_itc_path + '/ra/user/externalTesters/'+adamId+'/', payload).then( function(response) {
                    return response.data;
                }, function (error) { return error; })
            },
            getExistingExternalTesters: function(adamId) {
                return $http.get(global_itc_path + '/ra/user/existingExternalTesters/'+adamId+'/').then(function (response) {
                    return response.data;
                }, function(error) { return error; });
            }
        };
    });
    
    // Build: Build Details
    itcApp.factory( 'buildDetailsService', function($http){
        return {
            load: function(adamId, trainVersion, buildVersion) {
                return $http.get(global_itc_path + '/ra/apps/'+adamId+'/trains/'+trainVersion+'/builds/'+buildVersion+'/details').then(function (response) {
                    return response.data;
                }, function(error) { return error; });
            }
        };
    });
    
    // Build: Test Information
    itcApp.factory( 'buildTestInformationService', function($http){
        return {
            load: function(adamId, trainVersion, buildVersion) {
                return $http.get(global_itc_path + '/ra/apps/'+adamId+'/trains/'+trainVersion+'/builds/'+buildVersion+'/testInformation').then(function (response) {
                    return response.data;
                }, function(error) { return error; });
            }
        };
    });
    
    // For storing build metadata between Angular views
    itcApp.factory( 'currentAppService', function() {
        return {
            setApp: function(data) {
               
            },
            setBuild: function(trainVersion, buildVersion) {
                localStorage.setItem( 'trainVersion', trainVersion);
                localStorage.setItem( 'buildVersion', buildVersion);
                return (trainVersion, buildVersion);
            },
            getTrainVersion: function() {
                return localStorage.getItem('trainVersion') || '';
            },
            getBuildVersion: function() {
                return localStorage.getItem('buildVersion') || '';
            },
        };
    });

    //submit for beta review service
    itcApp.factory('submitForBetaReviewService',function($http){
        var myService = {
            submitForReview: function(adamId,trainVersion,buildVersion,buildSubmission) {
                var promise;
                if (buildSubmission !== undefined) {
                    promise = $http.post(global_itc_path + '/ra/apps/' + adamId + '/trains/'+
                    trainVersion +'/builds/'+ buildVersion +'/submit/start',buildSubmission).then(function(response) {
                        return response.data;
                    },function(reason) {
                        return reason;
                    });
                } else {
                    promise = $http.get(global_itc_path + '/ra/apps/' + adamId + '/trains/'+
                    trainVersion +'/builds/'+ buildVersion +'/submit/start',{cache:false}).then(function(response) {
                        return response.data;
                    },function(reason) {
                        return reason;
                    });
                }
                return promise;
            },
            finalizeSubmitForReview: function(adamId,trainVersion,buildVersion,buildSubmission) {
                var promise = $http.post(global_itc_path + '/ra/apps/' + adamId + '/trains/'+
                    trainVersion +'/builds/'+ buildVersion +'/submit/complete',buildSubmission).then(function(response) {
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



});

