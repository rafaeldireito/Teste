define(['plugins/router', 'durandal/app', 'knockout'], function (router, app, ko) {
	var viewModel = function() {
		console.log("Initiated director presentation...");
		
		var self = this;
		var countryUri = 'http://192.168.160.39/api/Countries/' + location.hash.split('/')[1];
		self.countryInfo = ko.observableArray();
		self.error = ko.observable();
		self.heightImg = ko.observable("230px");
		self.widthImg = ko.observable("170px");
		
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
		
		getCountry = function() {
			console.log("CALL: get director...");
			ajaxHelper(countryUri, 'GET').done(function(data) {
				self.countryInfo(data);
			});	
		}
		
		getCountry();
	}	
	
	return viewModel;
});
