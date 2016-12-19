define(['plugins/http', 'durandal/app', 'knockout'], function (http, app, ko) {
	function reverseOf(obj, min, max) {
		lista = [];
		counter = 0;
		position = 0;
		for (i = min; i <= max; i++) {
			lista.push(i);
			if (i == obj) position = counter;  //(window.innerWidth * i / $("img").length).toString()
			counter++;
		}
		lista.reverse();
		console.log(lista[position]);
		return lista[position];
	}
	
	var viewModel = function() {
		
		var urls = [
			{"url": "dcComics.jpg"},
			{"url": "spman.jpg"},
			{"url": "joker.jpg"},
			{"url": "batman.jpg"}
		];
		
		var modalHtml = [
			'<img id="cImg" class="col-lg-offset-1 col-lg-10 col-xs-12" data-bind="attr: {src: url}, style: {height: imgHeight}" style="top: 5px; position: relative; margin-bottom:5px; width:100%"/>',
			'<div class="col-lg-1 arrows" data-bind="click: moveBack, event: {mouseover: setPointer, mouseout: setDefault}"><h3><i class="fa fa-reply"></i></h3></div>',
			'<div class="col-lg-1 arrows" data-bind="click: moveForward, event: {mouseover: setPointer, mouseout: setDefault}"><h3><i class="fa fa-share"></i></h3></div>'
		]
		var self = this;
		self.heightFile = ko.observable((window.innerHeight - 50).toString() + "px");
		self.backSize = ko.observable(window.innerWidth.toString() + "px " + (window.innerHeight - 50).toString() + "px");
		self.barLocation = ko.observable((window.innerHeight / 2 - 50).toString() + "px");
		self.currentBack = ko.observable(urls[0]["url"]);
		self.url = ko.observable(self.currentBack());
		self.imgWidth = ko.observable();
		self.imgHeight = ko.observable();
		self.modalImg = ko.observable();
		var cPosition = 0;
		var hideSearch = true;
		var searchOnDirectors = 'http://192.168.160.39/api/Directors/Search/';
		var searchOnMovies = 'http://192.168.160.39/api/Movies/Search/';
		var searchOnActors = 'http://192.168.160.39/api/Actors/Search/';
		self.directors = ko.observableArray();
		self.actors = ko.observableArray();
		self.movies = ko.observableArray();
		self.searchText = ko.observable("");
		self.error = ko.observable();
		
		var initial = setInterval(function() {
			init();
			clearInterval(initial);
		}, 100);
		
		
		resetStatus = function() {
			hideSearch = true;
		}
		
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
		
		returnMain = function() {
			hideSearch = true;
			init();
		}

		self.searchTextGood = ko.computed(function () {
			return (self.searchText().length < 3)
		}, self);

		getAll = function() {
			ajaxHelper(searchOnDirectors + self.searchText(), 'GET').done(function (data) {
				self.directors(data);
			});		
			ajaxHelper(searchOnMovies + self.searchText(), 'GET').done(function (data) {
				self.movies(data);
			});
			ajaxHelper(searchOnActors + self.searchText(), 'GET').done(function (data) {
				self.actors(data);
			});
			hideSearch = false;
			console.log(self.backSize());
			init();
		}
		
		$(window).resize(function() {
			self.heightFile((window.innerHeight - 50).toString() + "px");
			self.barLocation((window.innerHeight / 2 - $("#bar").css("height") / 2 - 25).toString() + "px");
			self.barLocation((window.innerHeight / 2 - 50).toString() + "px");
			adjustSizes();
		});
		
		setPointer = function() {
			var obj = $("div[class='col-lg-1 arrows']");
			obj.css("cursor", "pointer");
		}
		
		setDefault = function() {
			var obj = $("div[class='col-lg-1 arrows']");
			obj.css("cursor", "default");
		}
		
		moveBack  = function() {
			cPosition--;
			if (cPosition < 0) cPosition = urls.length - 1;
			self.url(urls[cPosition]['url']);
		}

		moveForward = function() {
			cPosition++;
			if (cPosition >= urls.length) cPosition = 0;
			self.url(urls[cPosition]['url']);
		}

		exitModal = function() {
			self.currentBack(self.currentBack());
			self.url(self.currentBack());
		}

		selectAsBack = function() {
			self.currentBack(urls[cPosition]['url']);
			self.url(self.currentBack())
		}
		
		adjustSizes = function() {
			console.log(modalHtml[0] + modalHtml[1] + modalHtml[2]);
			if (parseInt(window.innerHeight) > parseInt(window.innerWidth)) self.modalImg(modalHtml[0] + modalHtml[1] + modalHtml[2]);
			else self.modalImg(modalHtml[1] + modalHtml[0] + modalHtml[2]);
			self.imgHeight((window.innerHeight / 2).toString() + "px");
			self.imgWidth((window.innerWidth / 2).toString() + "px");
			$("div[class='col-lg-1 col-xs-1 arrows']").css("margin-top", (parseInt(self.imgHeight()) / 2 - parseInt($("div[class='col-lg-1 arrows']").css("height")) / 2).toString() + "px");
		}
		
		function init(){
			if (hideSearch) {
				$("div[id='welcome']").show();
				$("div[id='all']").hide();
			} else {
				$("div[id='all']").show();
				$("div[id='welcome']").hide();
				$("#all").css("min-height", self.heightFile());
				$("#all-container").css("min-height", self.heightFile());
			}
		}
	}
	return viewModel;
});
