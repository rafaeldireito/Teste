define(['plugins/http', 'durandal/app', 'knockout'], function (http, app, ko) {
	
	var ViewModel = function () {
		
		var self = this;
		var searchCountriesUri = 'http://192.168.160.39/api/Countries/Search/'
		var countriesUri = 'http://192.168.160.39/api/Countries';
		var countriesCountUri = 'http://192.168.160.39/api/Countries/Count';
		
		self.searchText = ko.observable("");
		self.countries = ko.observableArray();
		self.countriesCount = ko.observable(null);
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
		
		resetStatus = function() {} //necessario pra funcionar

		autocomplete = function() {
			console.log("CALL: searchAuto");
			if (self.searchText().length >= 3) {
				ajaxHelper(searchCountriesUri + self.searchText(), 'GET').done(function (data) {
					self.countries(data);
				});
			} else getAllCountries();
		};

		self.searchTextGood = ko.computed(function () {
			return (self.searchText().length < 3)
		}, self);

		getAllCountries = function () {
			console.log('CALL: getAllActors...')
			ajaxHelper(countriesCountUri, 'GET').done(function (data) {
				self.countriesCount(data);
			});
			ajaxHelper(countriesUri, 'GET').done(function (data) {
				self.countries(data);
				console.log(data);
			});
		};

		clearCountries = function () {
			getAllCountries();
			self.searchText("");
		};

		searchCountries = function () {
			console.log('CALL: searchActors...')
			ajaxHelper(searchCountriesUri + self.searchText(), 'GET').done(function (data) {
				self.countries(data);
			});
		}

		getAllCountries();
	};

	return ViewModel;
});
