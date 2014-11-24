/************************************************************************************************************************/
/*********************************************** manage_users_services.js ***********************************************/
/************************************************************************************************************************/

define(['app'], function (itcApp) {
	itcApp.factory('manageUsersService',function($http){
		var myService = {
			loadItcUserList: function() {
				return $http.get(global_itc_path + '/ra/users/itc',{cache:false}).then(function (response) {
					return response.data;
				}, function(error) { return error; });
			},
			deleteItcUsers: function(usersToDelete) {
				return $http.post(global_itc_path + '/ra/users/itc/delete',usersToDelete).then(function (response) {
					return response.data;
				}, function(error) { return error; });
			},
			loadItcUserDetails: function(username) {
				return $http.get(global_itc_path + '/ra/users/itc/'+username+'/details',{cache:false}).then(function (response) {
					return response.data;
				}, function(error) { return error; });
			},
			saveItcUserDetails: function(username,userdetails) {
				return $http.post(global_itc_path + '/ra/users/itc/'+username+'/details',userdetails).then(function (response) {
					return response.data;
				}, function(error) { return error; });
			},
			loadItcUserRoles: function(username) {
				return $http.get(global_itc_path + '/ra/users/itc/'+username+'/roles',{cache:false}).then(function (response) {
					return response.data;
				}, function(error) { return error; });
			},
			saveItcUserRoles: function(username,userdetails) {
				return $http.post(global_itc_path + '/ra/users/itc/'+username+'/roles',userdetails).then(function (response) {
					return response.data;
				}, function(error) { return error; });
			},
			loadItcUserNotifications: function(username) {
				return $http.get(global_itc_path + '/ra/users/itc/'+username+'/notifications',{cache:false}).then(function (response) {
					return response.data;
				}, function(error) { return error; });
			},
			saveItcUserNotifications: function(username,userdetails) {
				return $http.post(global_itc_path + '/ra/users/itc/'+username+'/notifications',userdetails).then(function (response) {
					return response.data;
				}, function(error) { return error; });
			},
			loadItcUserAccess: function(username) {
				return $http.get(global_itc_path + '/ra/users/itc/'+username+'/access',{cache:false}).then(function (response) {
					return response.data;
				}, function(error) { return error; });
			},
			saveItcUserAccess: function(username,userdetails) {
				return $http.post(global_itc_path + '/ra/users/itc/'+username+'/access',userdetails).then(function (response) {
					return response.data;
				}, function(error) { return error; });
			},
			createItcUserStart: function() {
				return $http.get(global_itc_path + '/ra/users/itc/create').then(function (response) {
					return response.data;
				}, function(error) { return error; });
			},
			createItcUserDetails: function(userdetails) {
				return $http.post(global_itc_path + '/ra/users/itc/create/validate/details',userdetails).then(function (response) {
					return response.data;
				}, function(error) { return error; });
			},
			createItcUserRoles: function(userdetails) {
				return $http.post(global_itc_path + '/ra/users/itc/create/validate/roles',userdetails).then(function (response) {
					return response.data;
				}, function(error) { return error; });
			},
			createItcUserAccess: function(userdetails) {
				return $http.post(global_itc_path + '/ra/users/itc/create/validate/access',userdetails).then(function (response) {
					return response.data;
				}, function(error) { return error; });
			},
			createItcUserEnd: function(userdetails) {
				return $http.post(global_itc_path + '/ra/users/itc/create',userdetails).then(function (response) {
					return response.data;
				}, function(error) { return error; });
			},
			loadSandboxUsers: function() {
				return $http.get(global_itc_path + '/ra/users/iap',{cache:false}).then(function (response) {
					return response.data;
				}, function(error) { return error; });
			},
			createSandboxUserStart: function() {
				return $http.get(global_itc_path + '/ra/users/iap/add').then(function (response) {
					return response.data;
				}, function(error) { return error; });
			},
			createSandboxUserEnd: function(userdetails) {
				return $http.post(global_itc_path + '/ra/users/iap/add',userdetails).then(function (response) {
					return response.data;
				}, function(error) { return error; });
			},
			deleteSandboxUsers: function(usersToDelete) {
				return $http.post(global_itc_path + '/ra/users/iap/delete',usersToDelete).then(function(response){
					return response.data;
				}, function(error) { return error; });
			},
			getArtistPage: function(username) {
				return $http.get(global_itc_path + '/ra/users/itc/'+username+'/artists',{cache:false}).then(function (response) {
					return response.data;
				}, function(error) { return error; });
			},
			getArtistAssign: function(username) {
				return $http.get(global_itc_path + '/ra/users/itc/'+username+'/artists/assign',{cache:false}).then(function (response) {
					return response.data;
				}, function(error) { return error; });
			},
			assignArtists: function(username,artists) {
				return $http.post(global_itc_path + '/ra/users/itc/'+username+'/artists/assign',artists).then(function(response){
					return response.data;
				}, function(error) { return error; });
			},

			getArtistAssignCreate: function() {
				return $http.get(global_itc_path + '/ra/users/itc/create/validate/artists/assign',{cache:false}).then(function (response) {
					return response.data;
				}, function(error) { return error; });
			},
			assignArtistsCreate: function(artists) {
				return $http.post(global_itc_path + '/ra/users/itc/create/validate/artists/assign',artists).then(function(response){
					return response.data;
				}, function(error) { return error; });
			},
			removeArtists: function(username,artists) { 
				return $http.post(global_itc_path + '/ra/users/itc/'+username+'/artists/remove',artists).then(function(response){
					return response.data;
				}, function(error) { return error; });
			},
			getReviewRequest: function() {
				return $http.get(global_itc_path + '/ra/users/itc/artists/assign/dispute',{cache:false}).then(function (response) {
					return response.data;
				}, function(error) { return error; });
			},
			postReviewRequest: function(requestReview) {
				return $http.post(global_itc_path + '/ra/users/itc/artists/assign/dispute',requestReview).then(function (response) {
					return response.data;
				}, function(error) { return error; });
			},
			testFlightInternalList: function() {
				return $http.get(global_itc_path + '/ra/users/pre/int',{cache:false}).then(function (response) {
					return response.data;
				}, function(error) { return error; });
			},
			postTestFlightInternalList: function(testers) {
				return $http.post(global_itc_path + '/ra/users/pre/int',testers).then(function (response) {
					return response.data;
				}, function(error) { return error; });
			},
			testFlightExternalList: function() {
				return $http.get(global_itc_path + '/ra/users/pre/ext',{cache:false}).then(function (response) {
					return response.data;
				}, function(error) { return error; });
			},
			deleteTestFlightExternalTesters: function(usersToDelete) {
				return $http.post(global_itc_path + '/ra/users/pre/ext/delete',usersToDelete).then(function (response) {
					return response.data;
				}, function(error) { return error; });
			},
			getCreateGroupsList: function() {
				return $http.get(global_itc_path + '/ra/users/pre/ext/groups/create',{cache:false}).then(function (response) {
					return response.data;
				}, function(error) { return error; });
			},
			postCreateGroupsList: function(newGroup) {
				return $http.post(global_itc_path + '/ra/users/pre/ext/groups/create',newGroup).then(function (response) {
					return response.data;
				}, function(error) { return error; });
			},
			getEditGroups: function() {
				return $http.get(global_itc_path + '/ra/users/pre/ext/groups/edit',{cache:false}).then(function (response) {
					return response.data;
				}, function(error) { return error; });
			},
			postEditGroups: function(bulkGroups) {
				return $http.post(global_itc_path + '/ra/users/pre/ext/groups/edit',bulkGroups).then(function (response) {
					return response.data;
				}, function(error) { return error; });
			},
			editGroupMembershipStart: function(testers) {
				return $http.post(global_itc_path + '/ra/users/pre/ext/groups/membership',testers).then(function (response) {
					return response.data;
				}, function(error) { return error; });
			},
			editGroupMembershipSave: function(membership) {
				return $http.post(global_itc_path + '/ra/users/pre/ext/groups/membership/save',membership).then(function (response) {
					return response.data;
				}, function(error) { return error; });
			}

		};
		return myService;
	});
});

