var _ = require('lodash')
var datastore = require('../datastore');

var shortId = require('shortid');

// Get list of courses
exports.index = function(req, res) {
	console.log("[START] courses.controller.js - GET ALL");
    return res.json(200, datastore.courses);
} ;

// Creates a new course in datastore.
exports.create = function(req, res) {
	console.log("[START] courses.controller.js - exports.create(type_code=" + req.params.type_code
	+ "::name="+req.params.name+ "::startdate="+req.params.startdate
	+ "::location="+req.params.location+ "::status="+req.params.status+")");
	var course = {
	   code:  req.body.type_code +'-'+ shortId.generate(),
	   type_code: req.body.type_code,
	   name: req.body.name,
	   startdate: req.body.startdate,
	   max_of_students: 4,
	   location: req.body.location,
	   status: req.body.status,
	   students: []
	};
    datastore.courses.push(course)
    return res.json(201, course);
};

// Update an existing course in datastore.
exports.update = function(req, res) {
	console.log("[START] courses.controller.js - exports.update(req.params.code=" + req.params.code + ")");
    var index = _.findIndex(datastore.courses, function(course) {
              return course.code == req.params.code;
        });
    if (index != -1) {
		var course = datastore.courses[index];
		course.code =  req.body.code;
		course.type_code = req.body.type_code;
		course.name = req.body.name;
		course.startdate = req.body.startdate;
		//course.max_of_students = req.body.max_of_students;
		course.location = req.body.location;
		course.status = req.body.status;
       	return res.send(200, course)
    } else {
        return res.send(404)
    }
};

// Deletes a course from datastore.
exports.destroy = function(req, res) {
	console.log("[START] courses.controller.js - exports.destroy(req.params.code=" + req.params.code + ")");
    var elements = _.remove(datastore.courses ,
           function(course) {
              return course.code == req.params.code;
        });
     if (elements.length == 1) {
        return res.send(200);
     } else {
        return res.send(404)
     }
};
// Deletes a student from a course from datastore.
//exports.delete_student = function(req, res) {
//	console.log("[START] courses.controller.js - exports.delete_student(req.params.code=" + req.params.code + "::req.params.id="+req.params.id+")");
//   	var index = _.findIndex(datastore.courses ,
 //          function(course) {
//              return course.code == req.params.code;
 //       });
//    if (index != -1) {
 //     var course = datastore.courses[index]
      //course.students.push(student)
//	  for (var index = 0 ; index < this.students.length ; index += 1) {
//				if (this.students[index].id == p_id)
//				{
//					this.students.splice(index, 1);
//				}
//			}
//
 //   var elements = _.remove(datastore.courses ,
 //          function(course) {
//              return course.code == req.params.code;
//        });
 //    if (elements.length == 1) {
 //       return res.send(200);
//     } else {
//        return res.send(404)
//     }
//};

//		this.deleteStudent = function(p_id) {
//			console.log('[DEBUG] Course.deleteStudent(p_id='+p_id+')');
//			for (var index = 0 ; index < this.students.length ; index += 1) {
//				if (this.students[index].id == p_id)
//				{
//					this.students.splice(index, 1);
//				}
//			}
//		}

//router.delete('/:code/students', controller.delete_student);

// Add a student to a course
exports.add_student = function(req, res) {
	console.log("[START] courses.controller.js - exports.add_student(req.params.code=" + req.params.code + "::req.body.name="+req.body.name+")");
   	var index = _.findIndex(datastore.courses ,
           function(course) {
              return course.code == req.params.code;
        });
    if (index != -1) {
      var course = datastore.courses[index]
      var nextId = 0
      var last = _.last(course.students)
      if (last != undefined) {
         nextId = last.id + 1
      } else {
        nextId = 1
      }
      var student = {
              id : nextId ,
              name: req.body.name,
              email: req.body.email,
              phone: req.body.phone,
              address: req.body.address,
              status: 'draft'
      }
       course.students.push(student)
       return res.send(200, student)
    } else {
        return res.send(404)
    }
};


//return $http.post('/api/courses/' + newBooking.code + '/students' , newBooking)