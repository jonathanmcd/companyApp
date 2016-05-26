var express = require('express');
var controller = require('./courses.controller');

var router = express.Router();

router.get('/open/distinctTypeCodes', controller.getCoursesOpenDistinctTypeCodes);
router.get('/open/:type_code', controller.getCoursesOpenByCodeType);
router.get('/open', controller.getCoursesOpen);
router.get('/:code', controller.getCourseByCode);
router.get('/', controller.getCoursesAll);
router.post('/', controller.createCourse);
router.post('/:id/students', controller.createCourseStudent);
router.put('/:id', controller.updateCourse);
router.put('/:id/students', controller.updateCourseStudent);
router.put('/delete/:id/students', controller.deleteCourseStudent);
router.delete('/:id', controller.deleteCourse);
module.exports = router;