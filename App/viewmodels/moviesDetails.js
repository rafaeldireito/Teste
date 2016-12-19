define(['plugins/router', 'durandal/app', 'knockout'], function (router, app, ko) {
	var viewModel = function() {
		console.log("Initiated director presentation...");
		
		var self = this;
		var movieUri = 'http://192.168.160.39/api/Movies/' + location.hash.split('/')[1];
		self.movieInfo = ko.observableArray();
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
		
		getMovie = function() {
			console.log("CALL: get director...");
			ajaxHelper(movieUri, 'GET').done(function(data) {
				self.movieInfo(data);
			});	
		}
		
		getMovie();
	}	
	
	return viewModel;
});
