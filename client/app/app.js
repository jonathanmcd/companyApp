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

companyApp.controller('AdminCoursesCtrl', function($rootScope, $scope, $routeParams, CoursesService) {
	console.log('[START] AdminCoursesCtrl');
	$rootScope.pageTitle = "Courses Administration";
	$scope.courses = CoursesService.getCoursesAll();
	console.log('$scope.courses.length=' + $scope.courses.length);	
	$scope.sortType = 'startdate'; // set the default sort type 
	$scope.sortReverse = false; // set the default sort order
	$scope.searchCourse = ''; // set the default search/filter term	
	$scope.viewCode = "maintainCourses";

	
	$scope.deleteCourse = function(course) {
		course.state = "deleted";
	}	
	$scope.deleteCourseUndo = function(course) {
		course.state = "normal";
	}	
	$scope.deleteCourseConfirm = function(course) {
		console.log('[START] deleteCourseConfirm('+course.code+') ');
		console.log('[DEBUG] Deleting at persistence level');		
		$scope.courses = CoursesService.deleteByCode(course.code);
		$scope.viewCode = "maintainCourses";
	}	
	$scope.addNewCourseView = function() {
		$scope.viewCode = "addNewCourseForm";
		$scope.courseTypes = CoursesService.getCourseTypesAll();
		$scope.courseStatuses = CoursesService.getCourseStatuses();
	}
	$scope.addNewCourseSubmit = function() {
		console.log('[START] addNewCourseSubmit(type_code='+$scope.newCourse.type_code+'::startdate='+$scope.newCourse.startdate+'::location='+$scope.newCourse.location+'::status='+$scope.newCourse.status);
		$scope.addNewCourseStatus = CoursesService.addNewCourse($scope.newCourse);
		$scope.viewCode = "maintainCourses";
		console.log('[END] addNewCourseSubmit()');		
	}
	$scope.viewCourse = function(course) {
		console.log('[START] addNewCourseSubmit(type_code='+course.type_code+') ');	
		$scope.viewCode = "viewCourse";
		course.state = "normal";
		$scope.course = course;
		console.log('[END] addNewCourseSubmit() ');	
	}
	$scope.viewAllCourses = function(course) {
		$scope.viewCode = "maintainCourses";
		course.state = "normal";
	}
	$scope.editCourse = function(course) {
		$scope.viewCode = "viewCourse";
		course.state = "edit";
		$scope.courseStatuses = CoursesService.getCourseStatuses();
	}
	$scope.cancelEdit = function(course) {
		$scope.viewCode = "viewCourse";
		course.state = "normal";
		$scope.course = course;
	}	
	$scope.saveCourse = function(editCourse) {
		console.log('[START] saveCourse(code='+editCourse.code+'::type_code='+editCourse.type_code+'::startdate='+editCourse.startdate+'::location='+editCourse.location+'::status='+editCourse.status);		
		CoursesService.editCourse(editCourse);
		$scope.viewCode = "viewCourse";
		editCourse.state = "normal";
		$scope.course = editCourse;
		console.log('[END] saveCourse() ');			
	}	
	
	console.log('[END] AdminCoursesCtrl');
});
	
companyApp.controller('HomeCtrl', function($rootScope, $scope) {
	console.log('[START] HomeCtrl');
	$rootScope.pageTitle = "First Aid Responder Training";
	console.log('[END] HomeCtrl');	
});

companyApp.controller('AboutCtrl', function($rootScope, $scope) {
	console.log('[START] AboutCtrl');	
	$rootScope.pageTitle = "About Us";	
	console.log('[END] AboutCtrl');	
});	

companyApp.controller('ContactCtrl', function($rootScope, $scope) {
	console.log('[START] ContactCtrl');
	$rootScope.pageTitle = "Contact Us";
	console.log('[END] ContactCtrl');
});		

companyApp.controller('BookingCtrl', function($rootScope, $scope, $routeParams, CoursesService) {
	console.log('[START] BookingCtrl');	
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
		+'\n::$scope.newBooking.phone='+$scope.newBooking.phone+'::$scope.newBooking.address1='+$scope.newBooking.address1);		
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




companyApp.factory('CoursesService', [function(){
	function Course(code_in, type_code_in, name_in, startdate_in, max_of_students_in, location_in, status_in) {
		this.code = code_in;
		this.type_code = type_code_in;
		this.name = name_in;
		this.startdate = startdate_in;
		this.max_of_students = max_of_students_in;
		this.location = location_in;
		this.status = status_in; //'draft'; // Other status's are open, closed, onhold
		this.students = [ ];	
		this.addStudent = function(p_id, p_name, p_email, p_phone, p_address) {
				var student = {id :p_id, name : p_name, email : p_email, phone : p_phone, address : p_address, guid : generateUUID()};
				if(this.students.length < this.max_of_students)
					student.status = 'enrolled'
				else
				{
					student.status = 'waiting'
				}
				this.students.push(student);
		}
		//this.deleteStudent
		//this.editStudent
		this.displayInfo = function () {
			return 'CourseCode=' + this.code + '::CourseName='+this.name+'::StartDate='+this.startdate+'::MaxNumStudents='+this.max_of_students;
		}
		this.displayStudents = function () {
			var studentsString = '';
			for (var i = 0 ; i < this.students.length ; i += 1) {
				studentsString = studentsString + 'id=' + this.students[i].id + '::status=' + this.students[i].status+ '::name=' + this.students[i].name
				+ '::email=' + this.students[i].email+ '::phone=' + this.students[i].phone
				+ '::address=' + this.students[i].address
				//+ '::guid=' + this.students[i].guid
				+ '\n';
			}	
			return studentsString;
		}
	}
	
	function generateUUID(){
		var d = new Date().getTime();
		if(window.performance && typeof window.performance.now === "function"){
			d += performance.now(); //use high-precision timer if available
		}
		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = (d + Math.random()*16)%16 | 0;
			d = Math.floor(d/16);
			return (c=='x' ? r : (r&0x3|0x8)).toString(16);
		});
		return uuid;
	}
	
	var courses = [ ];	
	var course1 = new Course('OFA-1','OFA','OCCUPATIONAL FIRST AID','2016-05-13',4,'Waterford City','open')
	course1.addStudent(1, 'Jonathan McDonald','jon@home.ie','0872223345','13 Jump St, Cork Rd, Waterford')
	course1.addStudent(2, 'Joe Soap','soap@test.ie','00511122323','17 Leap St, Limerick Rd, Waterford')
	course1.addStudent(3, 'Gemma Smith','gemma@dublin.ie','017438349','16 Posh St, St Stephens Green, Dublin 2')
	course1.addStudent(4, 'Graham Little','little@iol.ie','051426172','1 Lower Road, Waterford')
	course1.addStudent(5, 'Guys Bigglesworth','guys@ireland.ie','0882345768','15 Groover Ave, Kilkenny')
	courses.push(course1);

	var course2 = new Course('CFR-1','CFR','Cardiac First Responder','2014-05-17',3,'Kilkenny City','closed')
	course2.addStudent(1, 'Jenny Smith','jen@home.ie','087443423','26 Jump St, Cork Rd, Waterford')
	course2.addStudent(2, 'John Quinn','quinn@home.ie','00511122323','27 Leap St, Limerick Rd, Waterford')
	course2.addStudent(3, 'Tommy Murphy','tommy@dublin.ie','013245452','27 Posh St, St Stephens Green, Dublin 2')
	course2.addStudent(4, 'Graham Little','little@iol.ie','051426172','2 Lower Road, Waterford')
	course2.addStudent(5, 'Jane Doyle','jane@doyle.ie','0882345768','25 Groover Ave, Cork')
	courses.push(course2);

	var course3 = new Course('OFA-2','OFA','OCCUPATIONAL FIRST AID','2016-05-30',3,'Kilkenny City','closed')
	course3.addStudent(1, 'Mandy Jones','mandy@waterford.ie','0872223345','37 Jump St, Cork Rd, Waterford')
	course3.addStudent(2, 'Jason Smith','smithy@test.ie','08512132342','31 Leap St, Limerick Rd, Waterford')
	course3.addStudent(3, 'Gemma Powell','gemma@dublin.ie','017438349','388 Posh St, St Stephens Green, Dublin 2')
	course3.addStudent(4, 'Annette Kelly','kelly@iol.ie','021627932','3 Lower Road, Waterford')
	course3.addStudent(5, 'Shay Forristal','shay@se2.ie','061376483','35 Groover Ave, Kilkenny')
	course3.addStudent(6, 'Jimmy Allen','jimmy@test.ie','0612312312','39 Misery Lane, Wexford')	
	courses.push(course3);

	var course4 = new Course('OFA-3','OFA','OCCUPATIONAL FIRST AID','2016-06-14',4,'Waterford City','open')
	course4.addStudent(1, 'Timmy Mallet','timmy@waterford.ie','0872223345','47 Jump St, Cork Rd, Waterford')
	course4.addStudent(2, 'Jason Smith','smithy@test.ie','08512132342','49 Leap St, Limerick Rd, Waterford')
	course4.addStudent(3, 'Gemma Powell','gemma@dublin.ie','017438349','423 Posh St, St Stephens Green, Dublin 2')
	course4.addStudent(4, 'Annette Kelly','kelly@iol.ie','021627932','4 Lower Road, Waterford')
	course4.addStudent(5, 'Shay Forristal','shay@se2.ie','061376483','45 Groover Ave, Kilkenny')
	courses.push(course4);

	var course5 = new Course('CFR-2','CFR','Cardiac First Responder','2016-06-01',4,'Waterford City','draft')
	course5.addStudent(1, 'Seamus Grant','seamus@home.ie','0872223345','15 Lower Glanmire Rd, Cork')
	course5.addStudent(2, 'Brian Linton','brian@test.ie','0051213213','25 Leap St, Limerick Rd, Waterford')
	course5.addStudent(3, 'Lisa Morris','lisa@dublin.ie','017438349','5 Posh St, St Stephens Green, Dublin 2')
	courses.push(course5);	
	
	var course6 = new Course('OFAR-1','OFAR','OCCUPATIONAL FIRST AID REFRESHER','2017-01-17',4,'Limerick City','open')
	course4.addStudent(1, 'Peter Mullet','peter@mullet.ie','0872223345','67 Jump St, Cork Rd, Limerick')
	course4.addStudent(2, 'Gavin Smith','smithy@test.ie','08512132342','6 Leap St, Limerick Rd, Limerick')
	course4.addStudent(3, 'Mark Owens','Mark@limerick.ie','017438349','690 Posh St, Lower Drive Rd, Limerick')
	courses.push(course6);	
	
	var course7 = new Course('OFAR-2','OFAR','OCCUPATIONAL FIRST AID REFRESHER','2018-06-14',4,'Waterford City','draft')
	course7.addStudent(1, 'Timmy Mallet','timmy@waterford.ie','0872223345','47 Jump St, Cork Rd, Waterford')
	course7.addStudent(2, 'Jason Smith','smithy@test.ie','08512132342','49 Leap St, Limerick Rd, Waterford')
	course7.addStudent(3, 'Gemma Powell','gemma@dublin.ie','017438349','423 Posh St, St Stephens Green, Dublin 2')
	courses.push(course7);	

	var course8 = new Course('CFR-3','CFR','Cardiac First Responder','2016-12-23',4,'Waterford City','open')
	course8.addStudent(1, 'Liam Alyward','seamus@home.ie','0872223345','15 Lower Glanmire Rd, Cork')
	course8.addStudent(2, '','brian@test.ie','0051213213','25 Leap St, Limerick Rd, Waterford')
	course8.addStudent(3, '','lisa@dublin.ie','017438349','5 Posh St, St Stephens Green, Dublin 2')
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
	var courseStatus = {code :'CLOSED', desc : 'Closed/finished no longer open for public enrollment'};	
	courseStatuses.push(courseStatus);	

	
	
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
		 getCoursesAll : function() {
			console.log('[INSIDE] getCoursesAll');		
			return courses
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
		 deleteByCode : function(code) {
			console.log('[START] deleteByCode("'+code+'") ');
			for(var index = 0; index<courses.length; index++)	{	
				if (courses[index].code == code) 
				{				
					courses.splice(index, 1);			
				}				
			}		
			console.log('[END] deleteByCode() ');
			return courses;	
		 },
		 getCourseStatuses : function() {
			console.log('[INSIDE] getCourseStatuses');		
			return courseStatuses;		
		 },				 
		 addNewStudent : function(newBooking) {
			console.log('[START] addNewStudent(code='+newBooking.code+'::type_code='+newBooking.type_code
			+'\n::name='+newBooking.name+'::email='+newBooking.email
			+'\n::phone='+newBooking.phone+'::address1='+newBooking.address1+') ');
			for(var index = 0; index<courses.length; index++)	{
				console.log('[DEBUG] courses['+index+'].code=' + courses[index].code);
				if (courses[index].code == newBooking.code) 
				{		

					console.log('[DEBUG] courses[index].students.length=' + courses[index].students.length); 
					var newStudentId = courses[index].students.length + 1;
					console.log('[DEBUG] newStudentId=' + newStudentId); 					
					console.log('[DEBUG] BEFORE ' + courses[index].displayInfo());
					console.log('[DEBUG] BEFORE ' + courses[index].displayStudents());
					courses[index].addStudent(newStudentId, newBooking.name, newBooking.email, newBooking.phone, newBooking.address1);					
					console.log('[DEBUG] AFTER ' + courses[index].displayInfo());
					console.log('[DEBUG] AFTER ' + courses[index].displayStudents());	
				}				
			}		
			console.log('[END] addNewStudent()');
			return 'success';	
		 },
		 addNewCourse : function(newCourse) {
			console.log('[START] addNewCourse(type_code='+newCourse.type_code+'::startdate='+newCourse.startdate+'::location='+newCourse.location+'::status='+newCourse.status+'); ');
			var courseTypeDesc = getCourseTypeDesc(newCourse.type_code);
			var courseNew = new Course(newCourse.type_code+'-'+(courses.length+1), newCourse.type_code, courseTypeDesc, newCourse.startdate,4, newCourse.location, newCourse.status)
			console.log('[DEBUG] BEFORE courses.length='+courses.length);
			courses.push(courseNew);
			console.log('[DEBUG] AFTER courses.length='+courses.length);
			console.log('[END] addNewCourse()');
			return 'success';	
		 },
		 editCourse : function(editCourse) {
			console.log('[START] editCourse(code='+editCourse.code+'::type_code='+editCourse.type_code+'::startdate='+editCourse.startdate+'::location='+editCourse.location+'::status='+editCourse.status+'); ');
			for(var index = 0; index<courses.length; index++)	{	
				if (courses[index].code == editCourse.code) 
				{	
					console.log('[DEBUG] Code match found, updating Course details'); 			
					courses[index].startdate = editCourse.startdate;
					courses[index].location = editCourse.location;
					courses[index].status = editCourse.status;
				}				
			}	
			console.log('[END] editCourse()');
			return 'success';	
		 }		 	 
	}
	return api
}])
