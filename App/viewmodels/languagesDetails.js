define(['plugins/router', 'durandal/app', 'knockout'], function (router, app, ko) {
	var viewModel = function() {
		console.log("Initiated director presentation...");
		
		var self = this;
		var languageUri = 'http://192.168.160.39/api/Languages/' + location.hash.split('/')[1];
		self.languageInfo = ko.observableArray();
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
		
		getLanguage = function() {
			console.log("CALL: get director...");
			ajaxHelper(languageUri, 'GET').done(function(data) {
				self.languageInfo(data);
			});	
		}
		
		getLanguage();
	}	
	
	return viewModel;
});
