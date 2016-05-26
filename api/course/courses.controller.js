var _ = require('lodash')
//var datastore = require('../datastore');
var Course = require('./course.model');
var shortId = require('shortid');


function handleError(res, err) {
      return res.send(500, err);
}

// Get list of courses
exports.getCourseByCode = function(req, res) {
	console.log("[START] courses.controller.js (MONGO) - getCourseByCode(req.params.code="+req.params.code+")");
	Course.findOne({"code":req.params.code},function (err, course) {
            if(err) { return handleError(res, err); }
            console.log("[DEBUG] course.code=" + course.code);
            return res.json(200, course);
	});
} ;

exports.getCoursesAll = function(req, res) {
	console.log("[START] courses.controller.js (MONGO) - getCoursesAll()");
	Course.find(function (err, courses) {
            if(err) { return handleError(res, err); }
            console.log("[DEBUG] courses.length=" + courses.length);
            return res.json(200, courses);
	});
} ;

exports.getCoursesOpen = function(req, res) {
	console.log("[START] courses.controller.js (MONGO) - getCoursesOpen()");
	// Only Courses with a status of OPEN should be shown to members of the public.
	Course.find({"status":"OPEN"},function (err, courses) {
            if(err) { return handleError(res, err); }

            return res.json(200, courses);
	});
} ;

exports.getCoursesOpenDistinctTypeCodes = function(req, res) {
	console.log("[START] courses.controller.js (MONGO) - getCoursesOpenDistinctTypeCodes()");
	// Only Courses with a status of OPEN should be shown to members of the public.
	//Course.find({"status":"OPEN"},function (err, courses) {
	Course.distinct("type_code",{"status":"OPEN"},function (err, courseTypes) {	
            if(err) { return handleError(res, err); }
            return res.json(200, courseTypes);
	});
} ;

exports.getCoursesOpenByCodeType = function(req, res) {
	console.log("[START] courses.controller.js (MONGO) - getCoursesOpenByCodeType(req.params.type_code="+req.params.type_code+")");
	// Only Courses with a status of OPEN should be shown to members of the public.
	Course.find({"status":"OPEN","type_code":req.params.type_code},function (err, courses) {
            if(err) { return handleError(res, err); }
            return res.json(200, courses);
	});
} ;

// Creates a new course
exports.createCourse = function(req, res) {
	console.log("[START] courses.controller.js (MONGO) - exports.createCourse(type_code=" + req.body.type_code
	+ "::name="+req.body.name+ "::startdate="+req.body.startdate
	+ "::location="+req.body.location+ "::status="+req.body.status+")");
	var course = {
	   code:  req.body.type_code +'-'+ shortId.generate(),
	   type_code: req.body.type_code,
	   name: req.body.name,
	   startdate: req.body.startdate,
	   max_of_students: 4, //defaulting for now.
	   location: req.body.location,
	   status: req.body.status,
	   students: []
	};
	console.log("[DEBUG] course.code=" + course.code);
    //datastore.courses.push(course)
	Course.create(course, function(err, course) {
          if (err) { return handleError(res, err); }
          return res.json(201, course);
    });
    return res.json(201, course);
};

// Add a student to a course
exports.createCourseStudent = function(req, res) {
	console.log("[START] courses.controller.js (MONGO) - exports.createCourseStudent(req.params.id=" + req.params.id + "::req.body.name="+req.body.name+")");
	Course.findById(req.params.id, function (err, course) {
		var student = {
              name: req.body.name,
              email: req.body.email,
              phone: req.body.phone,
              address: req.body.address,
              status: 'draft' 
		}
		course.students.push(student);
		course.save(function (err) {
			if(err) { return handleError(res, err); }
			var last = _.last(course.students)
			if (last != undefined) {
				return res.json(200, last);
			} else {
				return res.send(500,"Database error");
			}
		});
  });
};

// Update an existing course
exports.updateCourse = function(req, res) {
	console.log("[START] courses.controller.js (MONGO) - exports.updateCourse(req.params.id=" + req.params.id + ")");
	Course.findById(req.params.id, function (err, course) {
		course.code =  req.body.code;
		course.type_code = req.body.type_code;
		course.name = req.body.name;
		course.startdate = req.body.startdate;
		//course.max_of_students = req.body.max_of_students; // not part of update for now.
		course.location = req.body.location;
		course.status = req.body.status;
		course.save(function (err) {
			if(err) { return handleError(res, err); }
			return res.send(200, 'Update successful');
		});
	});
 }

exports.updateCourseStudent = function(req, res) {
	console.log("[START] courses.controller.js (MONGO) - exports.updateCourseStudent(req.params.id=" + req.params.id + ")");
    Course.findById(req.params.id, function (err, course) {
    	console.log("[DEBUG] course.students.length=" + course.students.length);
		for (var index = 0 ; index < course.students.length ; index += 1) {
			if (course.students[index]._id == req.body._id)
			{
				console.log("[DEBUG] Student "+course.students[index].name +" detected on Course (" + course.code + ")");
            	course.students[index].name = req.body.name;
            	course.students[index].email = req.body.email;
            	course.students[index].phone = req.body.phone;
            	course.students[index].address = req.body.address;
            	course.students[index].status = req.body.status;			
			}
		}
		console.log("[DEBUG] Saving Course " + course.code);
		course.save(function (err) {
			if(err) { return handleError(res, err); }
			return res.send(200, 'Edit student was successful');
		});
    })
};

// Deletes a course
exports.deleteCourse = function(req, res) {
	console.log("[START] courses.controller.js (MONGO) - exports.deleteCourse(req.params.id=" + req.params.id + ")");
    Course.findById(req.params.id, function (err, course) {
    	course.remove(function (err) {
			if(err) { return handleError(res, err); }
                return res.send(200,'Deleted');
		});
    })
};

// Deletes a student from a course - basically we are removing an object from the student array within the Course object
exports.deleteCourseStudent = function(req, res) {
	console.log("[START] courses.controller.js (MONGO) - exports.deleteCourseStudent(req.params.id=" + req.params.id + "::req.body.id="+req.body.id+")");
    Course.findById(req.params.id, function (err, course) {
    	console.log("[DEBUG] course.students.length=" + course.students.length);
		for (var index = 0 ; index < course.students.length ; index += 1) {
			console.log("[DEBUG] course.students["+index+"].id="+course.students[index].id);
			if (course.students[index].id == req.body.id)
			{
				console.log("[DEBUG] Student "+course.students[index].name +" detected on Course (" + course.code + ")");
				course.students.splice(index, 1);
			}
		}
		course.save(function (err) {
			if(err) { return handleError(res, err); }
			return res.send(200, 'Delete student was successful');
		});
    })
};