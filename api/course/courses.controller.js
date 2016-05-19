var _ = require('lodash')
//var datastore = require('../datastore');
var Course = require('./course.model');
var shortId = require('shortid');


function handleError(res, err) {
      return res.send(500, err);
}

// Get list of courses
exports.index = function(req, res) {
	console.log("[START] courses.controller.js (MONGO) - GET ALL");
	Course.find(function (err, courses) {
            if(err) { return handleError(res, err); }
            return res.json(200, courses);
	});
} ;

// Creates a new course
exports.create = function(req, res) {
	console.log("[START] courses.controller.js (MONGO) - exports.create(type_code=" + req.params.type_code
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
    //datastore.courses.push(course)
    Course.create(req.body, function(err, course) {
          if (err) { return handleError(res, err); }
          return res.json(201, course);
    });
    return res.json(201, course);
};

// Update an existing course
exports.update = function(req, res) {
	console.log("[START] courses.controller.js (MONGO)- exports.update(req.params.id=" + req.params.id + ")");
	Course.findById(req.params.id, function (err, course) {
		course.code =  req.body.code;
		course.type_code = req.body.type_code;
		course.name = req.body.name;
		course.startdate = req.body.startdate;
		//course.max_of_students = req.body.max_of_students;
		course.location = req.body.location;
		course.status = req.body.status;
		course.save(function (err) {
			if(err) { return handleError(res, err); }
			return res.send(200, 'Update successful');
		});
	});
 }

// Deletes a course
exports.destroy = function(req, res) {
	console.log("[START] courses.controller.js (MONGO) - exports.destroy(req.params.id=" + req.params.id + ")");
    Course.findById(req.params.id, function (err, course) {
    	course.remove(function (err) {
			if(err) { return handleError(res, err); }
                return res.send(200,'Deleted');
		});
    })
};

// Add a student to a course
exports.add_student = function(req, res) {
	console.log("[START] courses.controller.js (MONGO) - exports.add_student(req.params.id=" + req.params.id + "::req.body.name="+req.body.name+")");
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

// Deletes a student from a course
exports.delete_student = function(req, res) {
	console.log("[START] courses.controller.js (MONGO) - exports.delete_student(req.params.id=" + req.params.id + ")");
    Course.findById(req.params.id, function (err, course) {
		for (var index = 0 ; index < course.students.length ; index += 1) {
			if (course.students[index]._id == student._id)
			{
				course.students.splice(index, 1);
			}
		}
		course.save(function (err) {
			if(err) { return handleError(res, err); }
			return res.send(200, 'Delete student was successful');
		});
    })
};