define(['plugins/router', 'durandal/app'], function (router, app) {
    return {
        router: router,
        activate: function () {
            router.map([
                { route: '', title: 'Home', moduleId: 'viewmodels/welcome', nav: true, menu: '<span>  <i class="fa fa-home" style="font-size:20px"></i>&nbsp Home</span>'},
                { route: 'diretores', moduleId: 'viewmodels/diretores', nav: true, menu: '<span>  <i class="fa fa-user" style="font-size:20px"></i>&nbsp Directors</span>'},
                { route: 'atores', moduleId: 'viewmodels/atores', nav: true, menu: '<span>  <i class="fa fa-users" style="font-size:20px"></i>&nbsp Actors</span>'},
				{ route: 'movies', moduleId: 'viewmodels/movies', nav: true, menu: '<span>  <i class="fa fa-film" style="font-size:20px"></i>&nbsp Movies</span>'},
				{ route: 'countries', moduleId: 'viewmodels/countries', nav: true, menu: '<span>  &nbsp<i class="fa fa-globe" style="font-size:20px"></i>&nbsp Countries</span>' },
				{ route: 'languages', moduleId: 'viewmodels/languages', nav: true, menu: '<span>   &nbsp<i class="fa fa-language" style="font-size:20px"></i>&nbsp Languages</span>' },
                { route: 'diretoresDetails/:id', moduleId: 'viewmodels/diretoresDetails', nav: false},
				{ route: 'atoresDetails/:id', moduleId: 'viewmodels/atoresDetails', nav: false},
				{ route: 'moviesDetails/:id', moduleId: 'viewmodels/moviesDetails', nav: false},
				{ route: 'languagesDetails/:id', moduleId: 'viewmodels/languagesDetails', nav: false},
				{ route: 'countriesDetails/:id', moduleId: 'viewmodels/countriesDetails', nav: false}
            ]).buildNavigationModel();
            
            return router.activate();
        }
    };
});
