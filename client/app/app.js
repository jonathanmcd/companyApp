	var companyApp = angular.module('companyApp', ['ngRoute']);
	
    companyApp.config(['$routeProvider',
      function($routeProvider) {
		console.log('Inside routing');
        $routeProvider     
          .when('/about', {
            templateUrl: 'partials/about.html',
            controller: 'AboutCtrl'			  
          })
          .when('/course/cfr', {
            templateUrl: 'partials/cfr.html',
            controller: 'CourseCFRCtrl'
          })
          .when('/course/ofa', {
            templateUrl: 'partials/ofa.html',
            controller: 'CourseOFACtrl'
          })
          .when('/course/ofar', {
            templateUrl: 'partials/ofar.html',
            controller: 'CourseOFARCtrl'
          })
		  .when('/course/efa', {
            templateUrl: 'partials/efa.html',
            controller: 'CourseEFACtrl'
          })
          .when('/contact', {
            templateUrl: 'partials/contact.html',
            controller: 'ContactCtrl'
          })
          .when('/booking', {
            templateUrl: 'partials/booking.html',
            controller: 'BookingCtrl'
          })		  
          .when('/', {
			templateUrl: 'partials/home.html',
            controller: 'HomeCtrl'
          })  
          .otherwise({
            redirectTo: '/'
          });
      }]);
	
	companyApp.controller('HomeCtrl', function($rootScope, $scope) {
		console.log('Inside HomeCtrl');
		$rootScope.pageTitle = "First Aid Responder Training";
		$scope.firstName = "John";
		$scope.lastName = "Doe";
	});
	
	companyApp.controller('AboutCtrl', function($rootScope, $scope) {
		console.log('Inside AboutCtrl');		
		$rootScope.pageTitle = "About Us";		
	});	
	
	companyApp.controller('ContactCtrl', function($rootScope, $scope) {
		console.log('Inside ContactCtrl');		
		$rootScope.pageTitle = "Contact Us";		
	});		

	companyApp.controller('BookingCtrl', function($rootScope, $scope) {
		console.log('Inside BookingCtrl');		
		$rootScope.pageTitle = "Booking Form";		
	});	
	
	companyApp.controller('CourseCFRCtrl', function($rootScope, $scope) {
		console.log('Inside CourseCFRCtrl');		
		$rootScope.pageTitle = "Cardiac First Responder";		
	});	
	
	companyApp.controller('CourseOFACtrl', function($rootScope, $scope) {
		console.log('Inside CourseOFACtrl');		
		$rootScope.pageTitle = "Occupational First Aid";		
	});	
	
	companyApp.controller('CourseOFARCtrl', function($rootScope, $scope) {
		console.log('Inside CourseOFARCtrl');		
		$rootScope.pageTitle = "Occupational First Aid Refresher";		
	});	
	
	companyApp.controller('CourseEFACtrl', function($rootScope, $scope) {
		console.log('Inside CourseEFACtrl');		
		$rootScope.pageTitle = "Emergency First Aid";		
	});		
