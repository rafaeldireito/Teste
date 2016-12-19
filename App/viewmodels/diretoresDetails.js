define(['plugins/router', 'durandal/app', 'knockout'], function (router, app, ko) {
	var viewModel = function() {
		console.log("Initiated director presentation...");
		
		var self = this;
		var diretorUri = 'http://192.168.160.39/api/Directors/' + location.hash.split('/')[1];
		self.diretorInfo = ko.observableArray();
		self.error = ko.observable();
		
		function ajaxHelper(uri, method, data) {
			self.error(''); // Clear error message
			return $.ajax({
				type: method,
				url: uri,
				dataType: 'json',
				contentType: 'application/json',
				data: data ? JSON.stringify(data) : null,
				error: function (jqXHR, textStatus, errorThrown) {
					console.log("AJAX Call[" + uri + "] Fail...");
					self.error(errorThrown);
				}
			});
		}
		
		getDirector = function() {
			console.log("CALL: get director...");
			ajaxHelper(diretorUri, 'GET').done(function(data) {
				self.diretorInfo(data);
			});	
		}
		
		getDirector();
	}	
	
	return viewModel;
});
