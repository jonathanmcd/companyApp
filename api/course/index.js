var express = require('express');
var controller = require('./courses.controller');

var router = express.Router();

router.get('/', controller.index);
router.post('/', controller.create);
router.post('/:id/students', controller.add_student);
router.put('/:id', controller.update);
//router.put('/:id/students', controller.update_student);
router.delete('/:id', controller.destroy);
router.delete('/:id/students', controller.delete_student);

module.exports = router;