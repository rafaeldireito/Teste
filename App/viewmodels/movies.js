define(['plugins/http', 'durandal/app', 'knockout'], function (http, app, ko) {
	function sumArray(arr1, arr2) {
		var aux = [];
		for (i = 0; i < arr1.length; i++) {aux.push(arr1[i])}
		for (i = 0; i < arr2.length; i++) {aux.push(arr2[i])}
		return aux;
	}
	
	function haveOne(obj1, obj2) {
		for (i = 0; i < obj1.length; i++) {
			for (j = 0; j < obj2.length; j++) {
				console.log(obj1[i]["genreName"]);
				console.log(obj2[j].id);
				if (obj1[i]["genreName"] == obj2[j].id) return true;
			}
		}
		return false;
	}
	
	var ViewModel = function () {
		
		var self = this;
		var searchMoviesUri = 'http://192.168.160.39/api/Movies/Search/';
		var moviesUri = 'http://192.168.160.39/api/Movies';
		var moviesCountUri = 'http://192.168.160.39/api/Movies/Count';
		var genresUri = 'http://192.168.160.39/api/Genres';
		var genresCountUri = 'http://192.168.160.39/api/Genres/Count';
		var genreList = [];		
		var isSmall = false;
		var auxIsSmall = false;
		self.searchText = ko.observable("");
		self.movies = ko.observableArray();
		self.genres = ko.observableArray();
		self.dropCount = ko.observable();
		self.genresCount = ko.observable(null);
		self.moviesCount = ko.observable(null);
		self.movie = ko.observableArray();
		self.error = ko.observable();
		was = false;
		
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
		
		resetStatus = function() {}
		
		checkDrop = function() {
			console.log(parseInt(window.innerWidth));
			if (parseInt(window.innerWidth) < 1200) isSmall = true;
			else isSmall = false;
			if (isSmall) {
				$("#checkGroup").hide();
				$("#drop").show();
				$("#drop").css("width",	$("#searchBar").css("width") + "px !important");
			} else {
				$("#checkGroup").show();
				$("#drop").hide();
			}
		}
		
		self.searchTextGood = ko.computed(function () {
			return (self.searchText().length < 3)
		}, self);

		autocomplete = function() {
			console.log("CALL: searchAuto");
			if (self.searchText().length >= 3) {
				restoreGenres();
				ajaxHelper(searchMoviesUri + self.searchText(), 'GET').done(function (data) {
					self.movies(data);
					getPosts();
				});
				was = true;
			} else if (was) {
				restoreGenres();
				getAllMovies();
				was = false;
			}
		};

		getPosts = function() {
			self.movie([]);
			for (i = 0; i < self.movies().length; i++) {
				ajaxHelper(moviesUri + '/' + self.movies()[i]["movieID"], 'GET').done(function(data) {
					self.movie().push({
						"movie_title": data[0]["movie_title"],
						"movieID": data[0]["movieID"],
						"poster": data[0]["poster"]
					});
					console.log(self.movie());
					self.movies(self.movie());
				});
			}
		}

		getAllMovies = function () {
			console.log('CALL: getAllDirectors...')
			ajaxHelper(moviesCountUri, 'GET').done(function (data) {
				self.moviesCount(data);
			});
			ajaxHelper(moviesUri, 'GET').done(function (data) {
				self.movies(data);
				getPosts();
			});
		};

		restoreGenres = function() {
			ajaxHelper(genresUri, 'GET').done(function (data) {
				self.genres(data);
			});
		}

		init = function() {
			getAllMovies();
			ajaxHelper(genresCountUri, 'GET').done(function (data) {
				self.genresCount("Genres[" + data.toString() + "]:");
				self.dropCount("Genres[" + data.toString() + "]");
			});
			restoreGenres();
			checkDrop();
		}

		clearMovies = function () {
			getAllMovies();
			self.searchText("");
		};

		searchMovies = function () {
			console.log('CALL: searchDirectors...')
			ajaxHelper(searchMoviesUri + self.searchText(), 'GET').done(function (data) {
				self.movies(data);
				getPosts();
			});
		}

		var lastLength = 0;
		setInterval(function() {
			checkDrop();
			if (isSmall != auxIsSmall) {
				auxIsSmall = isSmall;
				restoreGenres();
			}
			var obj = $("input[type='checkbox']:checked");
			if (obj.length != lastLength) {
				if (obj.length == 0) getAllMovies()
				else {
					for (i = 0; i < obj.length; i++) {
						if (i == 0) self.movies([]);
						ajaxHelper(genresUri + '/' + (obj[i]).value.toString()).done(function(data) {
							var mv = data[0]["movies"];
							self.movies(sumArray(self.movies(), mv));
							getPosts();
						});
					}
				}
				lastLength = obj.length;
			}
		}, 100);
	
		init();
	};

	return ViewModel;
});
