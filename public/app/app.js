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
	$scope.addNewCourseSubmit = function() {
		console.log('[START] addNewCourseSubmit(type_code='+$scope.newCourse.type_code+'::startdate='+$scope.newCourse.startdate+'::location='+$scope.newCourse.location+'::status='+$scope.newCourse.status);
		CoursesService.addNewCourse($scope.newCourse).success(function(new_course) {
			console.log('[DEBUG] Add new worked');
			$scope.courses.push(new_course);
			$scope.newCourse = { };
		});
		$scope.viewCourseCode = "allCourses";
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
		CoursesService.deleteStudent(course._id, student._id).success(function(status) {
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
		console.log('[START] addNewStudentSubmit v3($scope.course._id='+$scope.course._id
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
    $scope.addComment = function(){
            if($scope.comment.body === '') { return; }
            var comment = {
                body: $scope.comment.body,
                author: $scope.comment.author
            }
            PostsService.addPostComment($scope.post.id, comment )
                .success(function(added_comment) {
                    $scope.post.comments.push(added_comment)
                    $scope.comment = {} ;
                })
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
		console.log('[START] saveEditStudent() ');
		student.state = "normal";
		$scope.courses = CoursesService.editStudent(course,student);
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
		$scope.course = CoursesService.getCourseOpenByCode($routeParams.code_id);
		if (!$scope.course)
		{
			console.log('[WARNING] $routeParams.code_id is NOT a valid course "open" to the public!');
			// problem detected so we want to display all OPEN courses.
		}
		else
		{
			$scope.displayAll = false;
			console.log('[DEBUG] ' + $scope.course.displayInfo());
		}
	}
	if($scope.displayAll == true)
	{
		console.log('[DEBUG] Getting all OPEN courses to display.');
		$scope.courses = CoursesService.getCoursesOpen();
		$scope.courseTypes = CoursesService.getCourseTypesOpen();
		console.log(' :CourseCFRCtrl: $scope.courseTypes.length=' + $scope.courseTypes.length);
	}
	$scope.addBooking = function() {
		console.log('[DEBUG] $scope.newBooking.code='+$scope.newBooking.code+'::newBooking.type_code='+$scope.newBooking.type_code
		+'\n::$scope.newBooking.name='+$scope.newBooking.name+'::$scope.newBooking.email='+$scope.newBooking.email
		+'\n::$scope.newBooking.phone='+$scope.newBooking.phone+'::$scope.newBooking.address='+$scope.newBooking.address);
		$scope.addBookingStatus = CoursesService.addNewStudent($scope.newBooking);
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
	$scope.courses = CoursesService.getCoursesOpenByType('CFR');
	console.log(' :CourseCFRCtrl: $scope.courses.length=' + $scope.courses.length);
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
	$scope.courses = CoursesService.getCoursesOpenByType('OFA');
	console.log(' :CourseOFACtrl: $scope.courses.length=' + $scope.courses.length);
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
	$scope.courses = CoursesService.getCoursesOpenByType('OFAR');
	console.log(' :CourseOFARCtrl: $scope.courses.length=' + $scope.courses.length);
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
	$scope.courses = CoursesService.getCoursesOpenByType('EFR');
	console.log(' :CourseEFACtrl: $scope.courses.length=' + $scope.courses.length);
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
	$scope.courses = CoursesService.getCoursesOpen();
	console.log(' :CourseUpcomingCtrl: $scope.courses.length=' + $scope.courses.length);
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



companyApp.factory('CoursesServiceX', ['$http', function($http){
   var api = {
     getPosts : function() {
           return $http.get('/api/posts')
     },
     addPost : function(post) {
          return $http.post('/api/posts',post)
     },
     addPostComment : function(post_id, comment) {
          return $http.post('/api/posts/' + post_id + '/comments' ,
                            comment)
     },
     upvotePost : function(post_id, new_upvote_count ) {
          return $http.post('/api/posts/' + post_id + '/upvotes',
                     {upvotes: new_upvote_count })
     },
     upvotePostComment : function(post_id, comment_id, new_upvote_count ) {
          return $http.post( '/api/posts/' +
                      post_id + '/comments/' +  comment_id + '/upvotes',
                     {upvotes: new_upvote_count })
     },
     getPost : function(post_id) {
        return $http.get('/api/posts/' + post_id )
     }
  }
  return api
}])



companyApp.factory('CoursesService', ['$http', function($http){
	function Course(code_in, type_code_in, name_in, startdate_in, max_of_students_in, location_in, status_in) {
		this.code = code_in;
		this.type_code = type_code_in;
		this.name = name_in;
		this.startdate = startdate_in;
		this.max_of_students = max_of_students_in;
		this.location = location_in;
		this.status = status_in; //'draft'; // Other status's are open, closed, onhold
		this.students = [ ];

		this.addStudent = function(p_name, p_email, p_phone, p_address) {
				console.log('[START] Course.addStudent(p_name='+p_name+'::p_email='+p_email+'::p_phone='+p_phone+'::p_phone='+p_address);
				// Determine new student id - get max student id and add 1
				var maxStudentId = 0;
				console.log('[DEBUG] - maxStudentId='+maxStudentId);

				for (var index = 0 ; index < this.students.length ; index += 1) {
					console.log('[DEBUG] - students['+index+'].id='+this.students[index].id);
					if (this.students[index].id > maxStudentId)
					{
						maxStudentId = this.students[index].id;
						console.log('[DEBUG] - NEW maxStudentId='+maxStudentId);
					}
				}
				var newStudentId = maxStudentId + 1;
				console.log('[DEBUG] newStudentId='+newStudentId);
				// create student object
				var student = {id :newStudentId, name : p_name, email : p_email, phone : p_phone, address : p_address};
				if(this.students.length < this.max_of_students)
					student.status = 'enrolled'
				else
				{
					student.status = 'waiting'
				}
				// Add student object to students array
				this.students.push(student);
				console.log('[END] Course.addStudent()');
		}
		this.deleteStudent = function(p_id) {
			console.log('[DEBUG] Course.deleteStudent(p_id='+p_id+')');
			for (var index = 0 ; index < this.students.length ; index += 1) {
				if (this.students[index].id == p_id)
				{
					this.students.splice(index, 1);
				}
			}
		}
		this.editStudent = function(p_student) {
			console.log('[DEBUG] Course.editStudent(student.id='+p_student.id+'::students.length='+this.students.length+')');
			for(var index = 0; index<this.students.length; index++)	{
				console.log('[DEBUG] students['+index+'].code=' + this.students[index].id);
				if (this.students[index].id == p_student.id)
				{
					console.log('[DEBUG] Updating ' +p_student.name+ ' (id='+this.students[index].id+')');
					this.students[index].name = p_student.name;
					this.students[index].email = p_student.email;
					this.students[index].phone = p_student.phone;
					this.students[index].address = p_student.address;
					this.students[index].status = p_student.status;
				}
			}
		}
		this.displayInfo = function () {
			return 'CourseCode=' + this.code + '::CourseName='+this.name+'::StartDate='+this.startdate+'::MaxNumStudents='+this.max_of_students;
		}
		this.displayStudents = function () {
			var studentsString = '';
			for (var i = 0 ; i < this.students.length ; i += 1) {
				studentsString = studentsString + 'id=' + this.students[i].id + '::status=' + this.students[i].status+ '::name=' + this.students[i].name
				+ '::email=' + this.students[i].email+ '::phone=' + this.students[i].phone
				+ '::address=' + this.students[i].address
				+ '\n';
			}
			return studentsString;
		}
	}


	var courses = [ ];
	var course1 = new Course('OFA-1','OFA','OCCUPATIONAL FIRST AID','2016-05-13',4,'Waterford City','open')
	course1.addStudent('Jonathan McDonald','jon@home.ie','0872223345','13 Jump St, Cork Rd, Waterford')
	course1.addStudent('Joe Soap','soap@test.ie','00511122323','17 Leap St, Limerick Rd, Waterford')
	course1.addStudent('Gemma Smith','gemma@dublin.ie','017438349','16 Posh St, St Stephens Green, Dublin 2')
	course1.addStudent('Graham Little','little@iol.ie','051426172','1 Lower Road, Waterford')
	course1.addStudent('Guys Bigglesworth','guys@ireland.ie','0882345768','15 Groover Ave, Kilkenny')
	courses.push(course1);

	var course2 = new Course('CFR-1','CFR','Cardiac First Responder','2014-05-17',3,'Kilkenny City','closed')
	course2.addStudent('Jenny Smith','jen@home.ie','087443423','26 Jump St, Cork Rd, Waterford')
	course2.addStudent('John Quinn','quinn@home.ie','00511122323','27 Leap St, Limerick Rd, Waterford')
	course2.addStudent('Tommy Murphy','tommy@dublin.ie','013245452','27 Posh St, St Stephens Green, Dublin 2')
	course2.addStudent('Graham Little','little@iol.ie','051426172','2 Lower Road, Waterford')
	course2.addStudent('Jane Doyle','jane@doyle.ie','0882345768','25 Groover Ave, Cork')
	courses.push(course2);

	var course3 = new Course('OFA-2','OFA','OCCUPATIONAL FIRST AID','2016-05-30',3,'Kilkenny City','closed')
	course3.addStudent('Mandy Jones','mandy@waterford.ie','0872223345','37 Jump St, Cork Rd, Waterford')
	course3.addStudent('Jason Smith','smithy@test.ie','08512132342','31 Leap St, Limerick Rd, Waterford')
	course3.addStudent('Gemma Powell','gemma@dublin.ie','017438349','388 Posh St, St Stephens Green, Dublin 2')
	course3.addStudent('Annette Kelly','kelly@iol.ie','021627932','3 Lower Road, Waterford')
	course3.addStudent('Shay Forristal','shay@se2.ie','061376483','35 Groover Ave, Kilkenny')
	course3.addStudent('Jimmy Allen','jimmy@test.ie','0612312312','39 Misery Lane, Wexford')
	courses.push(course3);

	var course4 = new Course('OFA-3','OFA','OCCUPATIONAL FIRST AID','2016-06-14',4,'Waterford City','open')
	course4.addStudent('Timmy Mallet','timmy@waterford.ie','0872223345','47 Jump St, Cork Rd, Waterford')
	course4.addStudent('Jason Smith','smithy@test.ie','08512132342','49 Leap St, Limerick Rd, Waterford')
	course4.addStudent('Gemma Powell','gemma@dublin.ie','017438349','423 Posh St, St Stephens Green, Dublin 2')
	course4.addStudent('Annette Kelly','kelly@iol.ie','021627932','4 Lower Road, Waterford')
	course4.addStudent('Shay Forristal','shay@se2.ie','061376483','45 Groover Ave, Kilkenny')
	courses.push(course4);

	var course5 = new Course('CFR-2','CFR','Cardiac First Responder','2016-06-01',4,'Waterford City','draft')
	course5.addStudent('Seamus Grant','seamus@home.ie','0872223345','15 Lower Glanmire Rd, Cork')
	course5.addStudent('Brian Linton','brian@test.ie','0051213213','25 Leap St, Limerick Rd, Waterford')
	course5.addStudent('Lisa Morris','lisa@dublin.ie','017438349','5 Posh St, St Stephens Green, Dublin 2')
	courses.push(course5);

	var course6 = new Course('OFAR-1','OFAR','OCCUPATIONAL FIRST AID REFRESHER','2017-01-17',4,'Limerick City','open')
	courses.push(course6);

	var course7 = new Course('OFAR-2','OFAR','OCCUPATIONAL FIRST AID REFRESHER','2018-06-14',4,'Waterford City','draft')
	course7.addStudent('Timmy Mallet','timmy@waterford.ie','0872223345','47 Jump St, Cork Rd, Waterford')
	course7.addStudent('Jason Smith','smithy@test.ie','08512132342','49 Leap St, Limerick Rd, Waterford')
	course7.addStudent('Gemma Powell','gemma@dublin.ie','017438349','423 Posh St, St Stephens Green, Dublin 2')
	courses.push(course7);

	var course8 = new Course('CFR-3','CFR','Cardiac First Responder','2016-12-23',4,'Waterford City','open')
	course8.addStudent('Liam Alyward','seamus@home.ie','0872223345','15 Lower Glanmire Rd, Cork')
	course8.addStudent('Dudley Moore','brian@test.ie','0051213213','25 Leap St, Limerick Rd, Waterford')
	course8.addStudent('Lisa Doyle','lisa@dublin.ie','017438349','5 Posh St, St Stephens Green, Dublin 2')
	courses.push(course8);

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




	function isTypeCodeUnique(arrCourseTypes,searchCode){
		console.log('[START] isTypeCodeUnique (arrCourseTypes.length='+arrCourseTypes.length+'::searchCode='+searchCode+')');
		blTypeCodeUnique = true;

		arrCourseTypes.forEach(function(courseType){
				if(courseType.code == searchCode)
				{
					console.log('[DEBUG] match found in arrCourseTypes '+searchCode+' -- return false');
					blTypeCodeUnique = false;
				}
			} )
		console.log('[END] isTypeCodeUnique (blTypeCodeUnique ' + blTypeCodeUnique + ')');
		return blTypeCodeUnique;
	}

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
		 // UPDATED
		 getCoursesAll : function() {
			console.log('[INSIDE] getCoursesAll - MONGO UPDATE2');
			return $http.get('/api/courses')
		 },
		 // UPDATED
		 deleteCourseById : function(id) {
			console.log('[START] deleteCourseById("'+id+'") - MONGO UPDATE');
			return $http.delete('/api/courses/' + id)
			//console.log('[END] deleteCourseById(status='+status+') ');
		 },
		 deleteStudent : function(course_id,student_id) {
			console.log('[START] deleteStudent(course_id='+course_id+'::student_id='+student_id+') ');
			return $http.delete('/api/courses/' + course_id, student_id);
			console.log('[END] deleteStudent()');
			return courses;
		 },
		  // UPDATED
		 editCourse : function(course) {
			console.log('[START] editCourse v2 (_id='+course._id+'::code='+course.code+'::type_code='+course.type_code+'::startdate='+course.startdate+'::location='+course.location+'::status='+course.status+'); ');
			return $http.put('/api/courses/' + course._id, course)
		 },
		 // UPDATED
		 addNewCourse : function(newCourse) {
			console.log('[START] addNewCourse(type_code='+newCourse.type_code+'::startdate='+newCourse.startdate+'::location='+newCourse.location+'::status='+newCourse.status+') - MONGO UPDATE ');
			var courseTypeDesc = getCourseTypeDesc(newCourse.type_code);
			var courseNewFinal = new Course(newCourse.type_code+'-'+(courses.length+1), newCourse.type_code, courseTypeDesc, newCourse.startdate,4, newCourse.location, newCourse.status)
			console.log('[DEBUG] BEFORE courses.length='+courses.length);
			return $http.post('/api/courses',courseNewFinal);
			//courses.push(courseNew);
			//console.log('[DEBUG] AFTER courses.length='+courses.length);
			//console.log('[END] addNewCourse()');
			//return 'success';
		 },
		 // UPDATED
		 addNewStudent : function(id, student) {
			console.log('[START] addNewStudent(id='+id  //+'::type_code='+newBooking.type_code
			+'\n::name='+student.name+'::email='+student.email
			+'\n::phone='+student.phone+'::address='+student.address+') ');
          return $http.post('/api/courses/' + id + '/students' ,student);
			//for(var index = 0; index<courses.length; index++)	{
			//	console.log('[DEBUG] courses['+index+'].code=' + courses[index].code);
			//	if (courses[index].code == newBooking.code)
			//	{
			//
			//		console.log('[DEBUG] courses[index].students.length=' + courses[index].students.length);
			//		console.log('[DEBUG] BEFORE ' + courses[index].displayInfo());
			//		console.log('[DEBUG] BEFORE ' + courses[index].displayStudents());
			//		courses[index].addStudent(newBooking.name, newBooking.email, newBooking.phone, newBooking.address);
			//		console.log('[DEBUG] AFTER ' + courses[index].displayInfo());
			//		console.log('[DEBUG] AFTER ' + courses[index].displayStudents());
			//	}
			//}
			//console.log('[END] addNewStudent()');
			//return 'success';
		 },
		 getCoursesOpen : function() {
			console.log('[INSIDE] getCoursesOpen');
			var coursesOpen = [ ];
			courses.forEach(function(course){
				console.log('[DEBUG] course.code='+course.code+'::course.status=' + course.status);
				if(course.status.toUpperCase() === 'OPEN')
				{
					coursesOpen.push(course);
				}
			} )
			return coursesOpen;
		 },
		 getCoursesOpenByType : function(type_code) {
			console.log('[INSIDE] getCoursesOpenByType(type_code=' + type_code+ ')');
			var coursesOpen = [ ];
			courses.forEach(function(course){
				if( (course.type_code == type_code) && (course.status.toUpperCase() === 'OPEN') )
				{
					coursesOpen.push(course);
				}
			} )
			return coursesOpen;
		 },
		 getCourseTypesAll : function() {
			console.log('[INSIDE] getCourseTypesAll');
			return courseTypes;
		 },
		 getCourseTypesOpen : function() {
			// We can only display Course Types that are in status of OPEN so students can enrol into.
			console.log('[INSIDE] getCourseTypesOpen');
			var courseTypes = [ ];
			courses.forEach(function(course){
				if( course.status.toUpperCase() === 'OPEN' )
				{
					if(isTypeCodeUnique(courseTypes,course.type_code))
					{
						var courseType = {code :course.type_code, name : course.name};
						courseTypes.push(courseType);
					}
				}
			} )
			return courseTypes;
		 },
		 getCourseOpenByCode : function(code) {
			console.log('[INSIDE] getCourseOpenByCode(code=' + code+ ')');
			var result = null
			courses.forEach(function(course){
			   console.log('[DEBUG] course.code='+course.code+'::course.status=' + course.status);
			   if( (course.code == code) && (course.status.toUpperCase() === 'OPEN') ) {
				  result  = course
				}
			} )
			return result
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
		 editStudent : function(course,student) {
			console.log('[START] editStudent(code='+course.code+'::student.id='+student.id+') ');
			for(var index = 0; index<courses.length; index++)	{
				console.log('[DEBUG] courses['+index+'].code=' + courses[index].code);
				if (courses[index].code == course.code)
				{
					console.log('[DEBUG] Updating ' +student.name+ ' (id='+student.id+') from course=' + courses[index].code);
					courses[index].editStudent(student);
				}
			}
			console.log('[END] editStudent()');
			return courses;
		 }

	}
	return api
}])
