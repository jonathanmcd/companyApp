var companyApp = angular.module('companyApp', ['ngRoute']);

companyApp.config(['$routeProvider',
  function($routeProvider) {
	console.log('[DEBUG] Inside routing');
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
	  .when('/course/upcoming', {
		templateUrl: 'partials/upcoming.html',
		controller: 'CourseUpcomingCtrl'
	  })
	  .when('/contact', {
		templateUrl: 'partials/contact.html',
		controller: 'ContactCtrl'
	  })
	  .when('/booking', {
		templateUrl: 'partials/booking.html',
		controller: 'BookingCtrl'
	  })
	  .when('/booking/:code_id', {
		templateUrl: 'partials/booking.html',
		controller: 'BookingCtrl'
	  })
	  .when('/', {
		templateUrl: 'partials/home.html',
		controller: 'HomeCtrl'
	  })
	  .when('/admin', {
		templateUrl: 'partials/admin/login.html',
		controller: 'AdminLoginCtrl'
	  })
	  .when('/admin/courses', {
		templateUrl: 'partials/admin/courses.html',
		controller: 'AdminCoursesCtrl'
	  })
	  .otherwise({
		redirectTo: '/'
	  });
}]);



companyApp.controller('AdminLoginCtrl', function($rootScope, $scope, $location, AdminUserService) {
	console.log('[START] AdminLoginCtrl');
	// Required for tracking virtual pageviews for Google Analytics
	ga('set', 'page', '/admin/login.html');
	ga('send', 'pageview');
	// Set web page title
	$rootScope.pageTitle = "Admin Login";
	$scope.submit = function() {
		if ($scope.username) {
			$scope.loginStatus = AdminUserService.validateUserLogin($scope.username, $scope.password)
			if($scope.loginStatus === 'success')
			{
				$location.path('/admin/courses');
			}
		}
	};
	console.log('[END] AdminLoginCtrl');
});

companyApp.controller('AdminCoursesCtrl', function($rootScope, $scope, $http, $routeParams, CoursesService) {
	console.log('[START] AdminCoursesCtrl');
	// Required for tracking virtual pageviews for Google Analytics
	ga('set', 'page', '/admin/courses.html');
	ga('send', 'pageview');
	$rootScope.pageTitle = "Courses Administration";
	$scope.courses = [ ];

	CoursesService.getCoursesAll().success(function(courses) {
		$scope.courses = courses;
    });

	console.log('$scope.courses.length=' + $scope.courses.length);
	$scope.sortType = 'startdate'; // set the default sort type
	$scope.sortReverse = false; // set the default sort order
	$scope.searchCourse = ''; // set the default search/filter term
	$scope.viewCourseCode = "allCourses";


	$scope.deleteCourse = function(course) {
		course.state = "delete";
	}
	$scope.deleteCourseUndo = function(course) {
		course.state = "normal";
	}
	$scope.deleteCourseConfirm = function(course) {
		console.log('[START] deleteCourseConfirm(course.code='+course.code+'::_id='+course._id+') ');
		CoursesService.deleteCourseById(course._id).success(function(status) {
			for(var index = 0; index<$scope.courses.length; index++)
			{
				if ($scope.courses[index].code == course.code)
				{
					$scope.courses.splice(index, 1);
					course.state = "normal";
				}
			}
		});
		$scope.viewCourseCode = "allCourses";

	}
	$scope.saveCourse = function(editCourse) {
		console.log('[START] saveCourse(_id='+editCourse._id+'::code='+editCourse.code+'::type_code='+editCourse.type_code+'::startdate='+editCourse.startdate+'::location='+editCourse.location+'::status='+editCourse.status);
		CoursesService.editCourse(editCourse).success(function(updated_course) {
			editCourse.state = "normal";
		});
		$scope.viewCourseCode = "viewCourse";
		$scope.course = editCourse;
		console.log('[END] saveCourse() ');
	}
	$scope.addCourse = function() {
		$scope.viewCourseCode = "addNewCourse";
		$scope.courseTypes = CoursesService.getCourseTypesAll();
		$scope.courseStatuses = CoursesService.getCourseStatuses();
	}
	$scope.addNewCourseSubmit = function(course) {
		console.log('[START] addNewCourseSubmit(type_code='+$scope.newCourse.type_code+'::startdate='+$scope.newCourse.startdate+'::location='+$scope.newCourse.location+'::status='+$scope.newCourse.status);
		CoursesService.addNewCourse($scope.newCourse).success(function(new_course) {
			console.log('[DEBUG] Add new worked');
			$scope.courses.push(new_course);
			$scope.newCourse = { };
		});
		$scope.viewCourseCode = "allCourses";

		// THIS NEXT BIT IS VERY IMPORTANT
		// Need to get a fresh list of all courses so NEW course id will be brought back, else we will get errors because it cannot detect the new mongo object id.
		CoursesService.getCoursesAll().success(function(courses) {
			$scope.courses = courses;
	    });		
		console.log('[END] addNewCourseSubmit()');
	}

	$scope.viewCourse = function(course) {
		console.log('[START] viewCourse(type_code='+course.type_code+') ');
		$scope.viewCourseCode = "viewCourse";
		course.state = "normal";
		$scope.course = course;
		$scope.sortType = 'id'; // set the default sort type
		$scope.sortReverse = false; // set the default sort order
		$scope.searchCourse = ''; // set the default search/filter term
		console.log('[END] viewCourse() ');
	}
	$scope.viewAllCourses = function(course) {
		$scope.viewCourseCode = "allCourses";
		course.state = "normal";
	}
	$scope.editCourse = function(course) {
		$scope.viewCourseCode = "viewCourse";
		course.state = "edit";
		course.oldStartdate = course.startdate;
		course.oldLocation = course.location;
		course.oldStatus = course.status;
		$scope.courseStatuses = CoursesService.getCourseStatuses();
	}
	$scope.cancelEdit = function(course) {
		$scope.viewCourseCode = "viewCourse";
		course.state = "normal";
		course.startdate = course.oldStartdate;
		course.location = course.oldLocation;
		course.status = course.oldStatus;
	}

	// ############## STUDENT RELATED FUNCTIONS #######################
	$scope.addStudent = function() {
		$scope.viewCourseCode = "viewCourse";
		$scope.viewStudentCode = "addNewStudent";
		$scope.studentStatuses = CoursesService.getStudentStatuses();
		console.log('[DEBUG] addStudent() - $scope.studentStatuses.length=' + $scope.studentStatuses.length);
	}
	$scope.cancelAddStudent = function() {
		$scope.viewCourseCode = "viewCourse";
		$scope.viewStudentCode = "";
	}
	$scope.deleteStudent = function(student) {
		student.state = "delete";
	}
	$scope.deleteStudentUndo = function(student) {
		student.state = "normal";
	}
	$scope.deleteStudentConfirm = function(course,student) {
		console.log('[START] deleteStudentConfirm(courseCode='+course.code+'::student_id='+student.id+') ');
		student.state = "normal";
		console.log('[DEBUG] Deleting at persistence level');
		CoursesService.deleteStudent(course._id, student).success(function(status) {
			for (var index = 0 ; index < course.students.length ; index += 1) {
				if (course.students[index]._id == student._id)
				{
					course.students.splice(index, 1);
				}
			}
		});
		//$scope.courses = CoursesService.deleteStudent(course,student);
		$scope.viewCourseCode = "viewCourse";
	}
	$scope.addNewStudentSubmit = function() {
		//$scope.newStudent.code = $scope.course.code;
		console.log('[START] addNewStudentSubmit ($scope.course._id='+$scope.course._id
		+'\n::$scope.newBooking.name='+$scope.newStudent.name+'::$scope.newBooking.email='+$scope.newStudent.email
		+'\n::$scope.newBooking.phone='+$scope.newStudent.phone+'::$scope.newBooking.address='+$scope.newStudent.address);
		CoursesService.addNewStudent($scope.course._id, $scope.newStudent).success(function(newlyAddedStudent) {
			console.log('[DEBUG] Add new student');
			$scope.course.students.push(newlyAddedStudent);
			$scope.newStudent = { };
		});
		$scope.viewCourseCode = "viewCourse";
		$scope.viewStudentCode = "";
		console.log('[END] addNewStudentSubmit()');
	}

	$scope.editStudent = function(student) {
		console.log('[START] editStudent() ');
		student.oldName = student.name;
		student.oldEmail = student.email;
		student.oldAddress = student.address;
		student.oldPhoneNumber = student.phone_number;
		student.oldStatus = student.status;
		student.state = "edit";
		console.log('[END] editStudent() ');
	}
	$scope.saveEditStudent = function(course,student) {
		console.log('[START] saveEditStudent(course._id='+course._id
		+'\n::student.name='+student.name+'::student.email='+student.email
		+'\n::student.phone='+student.phone+'::student.address='+student.address);
		CoursesService.editStudent(course,student).success(function(updatedStudent) {
			student.state = "normal";
		});
		console.log('[END] saveEditStudent() ');
	}
	$scope.cancelEditStudent = function(student) {
		console.log('[START] cancelEditStudent() ');
		student.name = student.oldName;
		student.email = student.oldEmail;
		student.address = student.oldAddress;
		student.phone_number = student.oldPhoneNumber;
		student.status = student.oldStatus;
		student.state = "normal";
		console.log('[END] cancelEditStudent() ');
	}
	console.log('[END] AdminCoursesCtrl');
});

companyApp.controller('HomeCtrl', function($rootScope, $scope) {
	console.log('[START] HomeCtrl');
	$rootScope.pageTitle = "First Aid Responder Training";
	ga('set', 'page', '/home.html');
	ga('send', 'pageview');
	console.log('[END] HomeCtrl');
});

companyApp.controller('AboutCtrl', function($rootScope, $scope) {
	console.log('[START] AboutCtrl');
	$rootScope.pageTitle = "About Us";
	ga('set', 'page', '/about.html');
	ga('send', 'pageview');
	console.log('[END] AboutCtrl');
});

companyApp.controller('ContactCtrl', function($rootScope, $scope) {
	console.log('[START] ContactCtrl()');
	// Required for tracking virtual pageviews for Google Analytics
	ga('set', 'page', '/contact.html');
	ga('send', 'pageview');
	// Set web page title
	$rootScope.pageTitle = "Contact Us";
	$scope.submitContactStatus ='';
	$scope.contactSubmit = function() {
		console.log('[START] contactSubmit(name='+$scope.contact.name+'::email='+$scope.contact.email+'::phone='+$scope.contact.phone+'::comment='+$scope.contact.comment+') ');
		$scope.submitContactStatus = 'success';
		// TO DO hook up to mailgun and Send email

		console.log('[END] contactSubmit() ');
	}
	console.log('[END] ContactCtrl');
});

companyApp.controller('BookingCtrl', function($rootScope, $scope, $routeParams, CoursesService) {
	console.log('[START] BookingCtrl');
	// Required for tracking virtual pageviews for Google Analytics
	ga('set', 'page', '/booking.html');
	ga('send', 'pageview');
	// Set web page title
	$rootScope.pageTitle = "Booking Form";
	$scope.addBookingStatus = '';
	$scope.displayAll = true;
	if(typeof $routeParams.code_id != 'undefined')
	{
		console.log('[DEBUG] Parameter detected - $routeParams.code_id=' + $routeParams.code_id);
		// TO FIX
		CoursesService.getCourseOpenByCode($routeParams.code_id).success(function(course) {
			$scope.course = course;
			console.log(' :BookingCtrl: Course found. course.type_code=' + course.type_code + '::code=' + course.code);
			if(typeof $scope.course == 'undefined')
			{
				console.log('[WARNING] $routeParams.code_id is NOT a valid course "open" to the public!');
				// problem detected so we want to display all OPEN courses.
			}
			else
			{
				$scope.displayAll = false;
				console.log('[DEBUG] type_code=' + $scope.course.type_code + '::code=' + $scope.course.code + '::location=' + $scope.course.location
					+ '::startDate=' + $scope.course.startdate+ '::status=' + $scope.course.status);
			}	
			if($scope.displayAll == true)
			{
				console.log('[DEBUG] :BookingCtrl: Getting all OPEN courses to display.');
				CoursesService.getCoursesOpen().success(function(courses) {
					$scope.courses = courses;
					console.log('[DEBUG] :BookingCtrl: $scope.courses.length=' + $scope.courses.length);
		    	});	
		    	// FIX
				//$scope.courseTypes = CoursesService.getCourseTypesOpen($scope.courses);
				CoursesService.getCourseOpenDistinctTypeCodes().success(function(courseTypes) {
					$scope.courseTypes = courseTypes;
					console.log('[DEBUG] :BookingCtrl: $scope.courseTypes.length=' + $scope.courseTypes.length);
		    	});			

			}					
	    });			

	}

	// CoursesService.getCoursesOpenByType('CFR').success(function(courses) {
	// 	$scope.courses = courses;
	// 	console.log(' :CourseCFRCtrl: $scope.courses.length=' + $scope.courses.length);
 //    });	

	if($scope.displayAll == true && typeof $routeParams.code_id == 'undefined')
	{
		console.log('[DEBUG] :BookingCtrl: Getting all OPEN courses to display. - $routeParams.code_id == undefined');
		CoursesService.getCoursesOpen().success(function(courses) {
			$scope.courses = courses;
			console.log('[DEBUG] :BookingCtrl: $scope.courses.length=' + $scope.courses.length);
    	});	
    	// FIX
		//$scope.courseTypes = CoursesService.getCourseTypesOpen($scope.courses);
		CoursesService.getCourseOpenDistinctTypeCodes().success(function(courseTypes) {
			$scope.courseTypes = courseTypes;
			console.log('[DEBUG] :BookingCtrl: $scope.courseTypes.length=' + $scope.courseTypes.length);
    	});			

	}
	$scope.addBooking = function() {
		console.log('[DEBUG] addBooking ($scope.course._id='+$scope.course._id
		+'\n::$scope.newBooking.name='+$scope.newBooking.name+'::$scope.newBooking.email='+$scope.newBooking.email
		+'\n::$scope.newBooking.phone='+$scope.newBooking.phone+'::$scope.newBooking.address='+$scope.newBooking.address);
		CoursesService.addNewStudent($scope.course._id, $scope.newBooking).success(function(newlyAddedStudent) {
			console.log('[DEBUG] New student added to course ' + $scope.course.code);
			$scope.course.students.push(newlyAddedStudent);
			$scope.newBooking = { };
			console.log('[DEBUG] Changing addBookingStatus to success.');
			$scope.addBookingStatus == 'success';
		});
		// console.log('[DEBUG] $scope.newBooking.code='+$scope.newBooking.code+'::newBooking.type_code='+$scope.newBooking.type_code
		// +'\n::$scope.newBooking.name='+$scope.newBooking.name+'::$scope.newBooking.email='+$scope.newBooking.email
		// +'\n::$scope.newBooking.phone='+$scope.newBooking.phone+'::$scope.newBooking.address='+$scope.newBooking.address
		// +'\n::$scope.course.type_code=' + $scope.course.type_code + '::$scope.course.code=' + $scope.course.code);
		// // Have to do this for now to set these values which I was expecting to have been set on the web page.
		// $scope.newBooking.code = $scope.course.code;
		// $scope.newBooking.type_code = $scope.course.type_code;
		// $scope.addBookingStatus = CoursesService.addNewStudent($scope.newBooking);
	}
	console.log('[END] BookingCtrl');
})
.filter('unique', function() { // Need this to remove duplication from dropdown select menu
  return function(courses, type_code) {
	console.log('[START] unique');
    var uniqueCourses =[];
    courses.forEach(function(course){
      if(course.type_code === type_code)
        uniqueCourses.push(course);
    });
    return uniqueCourses;
	console.log('[END] unique');
  };
});


companyApp.controller('CourseCFRCtrl', function($rootScope, $scope, CoursesService) {
	console.log('[START] CourseCFRCtrl');
	// Required for tracking virtual pageviews for Google Analytics
	ga('set', 'page', '/cfr.html');
	ga('send', 'pageview');
	// Set web page title
	$rootScope.pageTitle = "Cardiac First Responder";
	CoursesService.getCoursesOpenByType('CFR').success(function(courses) {
		$scope.courses = courses;
		console.log(' :CourseCFRCtrl: $scope.courses.length=' + $scope.courses.length);
    });		
	$scope.sortType = 'startdate'; // set the default sort type
	$scope.sortReverse = false; // set the default sort order
	$scope.searchCourse = ''; // set the default search/filter term
	console.log('[END] CourseCFRCtrl');
});

companyApp.controller('CourseOFACtrl', function($rootScope, $scope, CoursesService) {
	console.log('[START] CourseOFACtrl');
	// Required for tracking virtual pageviews for Google Analytics
	ga('set', 'page', '/ofa.html');
	ga('send', 'pageview');
	// Set web page title
	$rootScope.pageTitle = "Occupational First Aid";
	CoursesService.getCoursesOpenByType('OFA').success(function(courses) {
		$scope.courses = courses;
		console.log(' :CourseOFACtrl: $scope.courses.length=' + $scope.courses.length);
    });			
	$scope.sortType = 'startdate'; // set the default sort type
	$scope.sortReverse = false; // set the default sort order
	$scope.searchCourse = ''; // set the default search/filter term
	console.log('[END] CourseOFACtrl');
});

companyApp.controller('CourseOFARCtrl', function($rootScope, $scope, CoursesService) {
	console.log('[START] CourseOFARCtrl');
	// Required for tracking virtual pageviews for Google Analytics
	ga('set', 'page', '/ofar.html');
	ga('send', 'pageview');
	// Set web page title
	$rootScope.pageTitle = "Occupational First Aid Refresher";
	CoursesService.getCoursesOpenByType('OFAR').success(function(courses) {
		$scope.courses = courses;
		console.log(' :CourseOFARCtrl: $scope.courses.length=' + $scope.courses.length);
    });			
	$scope.sortType = 'startdate'; // set the default sort type
	$scope.sortReverse = false; // set the default sort order
	$scope.searchCourse = ''; // set the default search/filter term
	console.log('[END] CourseOFARCtrl');
});

companyApp.controller('CourseEFACtrl', function($rootScope, $scope, CoursesService) {
	console.log('[START] CourseEFACtrl');
	// Required for tracking virtual pageviews for Google Analytics
	ga('set', 'page', '/efa.html');
	ga('send', 'pageview');
	// Set web page title
	$rootScope.pageTitle = "Emergency First Aid";
	CoursesService.getCoursesOpenByType('EFA').success(function(courses) {
		$scope.courses = courses;
		console.log(' :CourseEFACtrl: $scope.courses.length=' + $scope.courses.length);
    });		
	$scope.sortType = 'startdate'; // set the default sort type
	$scope.sortReverse = false; // set the default sort order
	$scope.searchCourse = ''; // set the default search/filter term
	console.log('[END] CourseEFACtrl');
});

companyApp.controller('CourseUpcomingCtrl', function($rootScope, $scope, CoursesService) {
	console.log('[START] CourseUpcomingCtrl');
	// Required for tracking virtual pageviews for Google Analytics
	ga('set', 'page', '/upcoming.html');
	ga('send', 'pageview');
	// Set web page title
	$rootScope.pageTitle = "Upcoming Courses";
	CoursesService.getCoursesOpen().success(function(courses) {
		$scope.courses = courses;
		console.log(' :CourseUpcomingCtrl: $scope.courses.length=' + $scope.courses.length);
    });	
	$scope.sortType = 'startdate'; // set the default sort type
	$scope.sortReverse = false; // set the default sort order
	$scope.searchCourse = ''; // set the default search/filter term
	console.log('[END] CourseUpcomingCtrl');
});

companyApp.factory('AdminUserService', [function(){
	function AdminUser(username_in, password_in) {
		this.username = username_in;
		this.password = password_in;
	}
	var adminUsers = [ ];
	var adminUser1 = new AdminUser('admin','test123');
	adminUsers.push(adminUser1);
	var adminUser2 = new AdminUser('jonathan','hello123');
	adminUsers.push(adminUser2);

	var api = {
		 validateUserLogin : function(username_in, password_in) {
			console.log('[INSIDE] validateUserLogin(username_in='+username_in+', password_in='+password_in+')');
			loginStatus = 'invalidUsername'; ///assume we have invalid user to start
			adminUsers.forEach(function(adminUser){
				if( adminUser.username.toUpperCase() == username_in.toUpperCase() )
				{
					loginStatus = 'invalidPassword'; // next let's assume invalid password until proven otherwise
					if( adminUser.password == password_in )
					{
						loginStatus = 'success'; // Yippeee!! we have a valid user and password.
					}
				}
			} )
			return loginStatus;
		 },
	}
	return api
}])

companyApp.factory('CoursesService', ['$http', function($http){
	// Populate the type of Courses
	var courseTypes = [ ];
	var courseType = {code :'CFR', name : 'Cardiac First Responder'};
	courseTypes.push(courseType);
	var courseType = {code :'OFA', name : 'OCCUPATIONAL FIRST AID'};
	courseTypes.push(courseType);
	var courseType = {code :'OFAR', name : 'OCCUPATIONAL FIRST AID REFRESHER'};
	courseTypes.push(courseType);
	var courseType = {code :'EFA', name : 'Emergency First Aid'};
	courseTypes.push(courseType);

	// Populate the different types of Courses statuses
	var courseStatuses = [ ];
	var courseStatus = {code :'DRAFT', desc : 'Not yet ready for public enrollment'};
	courseStatuses.push(courseStatus);
	var courseStatus = {code :'OPEN', desc : 'Open for public enrollment'};
	courseStatuses.push(courseStatus);
	var courseStatus = {code :'CLOSED', desc : 'No longer open for public enrollment'};
	courseStatuses.push(courseStatus);

	// Populate the different types of Student statuses
	var studentStatuses = [ ];
	var studentStatus = {code :'ENROLLED', desc : 'Student has enrolled in the course.'};
	studentStatuses.push(studentStatus);
	var courseStatus = {code :'PAID', desc : 'Student has paid fee.'};
	studentStatuses.push(studentStatus);
	var courseStatus = {code :'WAITING', desc : 'Waiting list - Course is full.'};
	studentStatuses.push(studentStatus);
	var courseStatus = {code :'CANCELLED', desc : 'Student has cancelled booking.'};
	studentStatuses.push(studentStatus);


	function getCourseTypeDesc(type_code) {
		console.log('[START] getCourseTypeDesc(type_code=' + type_code+ ')');
		var courseTypeDesc = '??????';
		courseTypes.forEach(function(courseType){
			if(courseType.code == type_code)
			{
					courseTypeDesc = courseType.name;
			}
		} )
		console.log('[END] getCourseTypeDesc()');
		return courseTypeDesc;
	}

	var api = {
		 // ##############################
		 //   MONGO RELATED FUNCTIONS
		 // ##############################
		 getCoursesAll : function() {
			console.log('[INSIDE] getCoursesAll - MONGO');
			return $http.get('/api/courses')
		 },
		 deleteCourseById : function(id) {
			console.log('[START] deleteCourseById("'+id+'") - MONGO');
			return $http.delete('/api/courses/' + id)
		 },
		 deleteStudent : function(course_id,student) {
			console.log('[START] deleteStudent(course_id='+course_id+'::student.id='+student.id+') - MONGO');
			// DO NOT use $http.delete because we are now deleting an parent course record, we are deleting an array student record, therefore we need use EDIT/PUT
			return $http.put('/api/courses/delete/' + course_id + '/students',student);
		 },
		 editCourse : function(course) {
			console.log('[START] editCourse (_id='+course._id+'::code='+course.code+'::type_code='+course.type_code+'::startdate='+course.startdate+'::location='+course.location+'::status='+course.status+')  - MONGO');
			return $http.put('/api/courses/' + course._id, course)
		 },
		 editStudent : function(course,student) {
			console.log('[START] editStudent(code='+course.code+'::student.id='+student.id+'::student._id=' + student._id +') - MONGO');
			return $http.put('/api/courses/' + course._id + '/students',student);
		 },		 		 
		 addNewCourse : function(newCourse) {
			console.log('[START] addNewCourse(type_code='+newCourse.type_code+'::startdate='+newCourse.startdate+'::location='+newCourse.location+'::status='+newCourse.status+') - MONGO');
			var courseTypeDesc = getCourseTypeDesc(newCourse.type_code);
			var courseNewFinal = new Course(newCourse.type_code+'-'+(courses.length+1), newCourse.type_code, courseTypeDesc, newCourse.startdate,4, newCourse.location, newCourse.status)
			console.log('[DEBUG] BEFORE courses.length='+courses.length);
			return $http.post('/api/courses',courseNewFinal);
		 },
		 addNewStudent : function(id, student) {
			console.log('[START] addNewStudent(id='+id  //+'::type_code='+newBooking.type_code
			+'\n::name='+student.name+'::email='+student.email
			+'\n::phone='+student.phone+'::address='+student.address+') ');
        	return $http.post('/api/courses/' + id + '/students' ,student);
		 },
		 getCoursesOpen : function() {
			console.log('[INSIDE] getCoursesOpen - MONGO');
			return $http.get('/api/courses/open')
		 },
		 getCoursesOpenByType : function(type_code) {
			console.log('[INSIDE] getCoursesOpenByType(type_code='+type_code+') - MONGO');
			return $http.get('/api/courses/open/' + type_code)
		 },
		 getCourseOpenDistinctTypeCodes : function() {
			console.log('[INSIDE] getCourseOpenDistinctTypeCodes - MONGO');
			return $http.get('/api/courses/open/distinctTypeCodes')		 	
		 },
		 getCourseOpenByCode : function(code) {
			console.log('[INSIDE] getCourseOpenByCode(code='+code+') - MONGO');
			return $http.get('/api/courses/' + code)		 	
		 },

		 // ########################################
		 //   LOCAL STATIC DATA RELATED FUNCTIONS
		 // ########################################
		 getCourseTypesAll : function() {
			console.log('[INSIDE] getCourseTypesAll');
			return courseTypes;
		 },		 
		 getCourseById : function(id) {
			var result = null
			courses.forEach(function(course){
			   if (course.id == id) {
				  result  = course
				}
			} )
			return result
		 },
		 getCourseStatuses : function() {
			console.log('[INSIDE] getCourseStatuses');
			return courseStatuses;
		 },
		 getStudentStatuses : function() {
			return studentStatuses;
		 },
	}
	return api
}])
