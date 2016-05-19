var express = require('express');
var controller = require('./courses.controller');

var router = express.Router();

router.get('/', controller.index);
router.post('/', controller.create);
router.post('/:code/students', controller.add_student);
router.put('/:code', controller.update);
//router.put('/:code/students', controller.update_student);
router.delete('/:code', controller.destroy);
//router.delete('/:code/students', controller.delete_student);

module.exports = router;