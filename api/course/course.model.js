var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var StudentSchema = new Schema({
		id: Number,
        name: { type: String, required: true },
        email: { type: String},
        phone: { type: String},
        address: { type: String},
        status: { type: String}
});

var CourseSchema = new Schema({
      code: { type: String, required: true },
      type_code: { type: String, required: true },
      name: { type: String, required: true },
      startdate: { type: Date, default: Date.now },
      max_of_students: { type: Number, min: 0, max: 10},
      location: String,
      students: [StudentSchema],
      status: String
});

module.exports = mongoose.model('course', CourseSchema);

