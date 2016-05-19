var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/company_db');

var Course = require('./api/course/course.model');

Course.find({}).remove(function() {
      Course.create(  {
        code: 'OFA-1',
        type_code: 'OFA',
        name: 'OCCUPATIONAL FIRST AID',
        students: [{id :1, name : 'Jonathan McDonald', email : 'jon@home.ie' , phone : '0872223345', address : '13 Jump St, Cork Rd, Waterford',status: 'ENROLLED'}, {id :2, name : 'Joe Soap', email : 'soap@test.ie', phone : '0511122323', address : '17 Leap St, Limerick Rd, Waterford',status: 'ENROLLED'}],
        max_of_students : 4,
        startdate: '2016-05-13',
        location: 'Waterford City',
        status: 'open'
      }, {
        code: 'CFR-2',
        type_code: 'CFR',
        name: 'Cardiac First Responder',
        students: [{id :1, name : 'Mary Smith', email : 'mary@smith.com' , phone : '056234234', address : '59 Rowe St, Wexford',status: 'ENROLLED'}],
        max_of_students : 4,
        startdate: '2016-06-01',
        location: 'Waterford City',
        status: 'draft'
      },  {
        code: 'OFAR-1',
        type_code: 'OFAR',
        name: 'OCCUPATIONAL FIRST AID REFRESHER',
        students: [],
        max_of_students : 4,
        startdate: '2017-01-17',
        location: 'Limerick City',
        status: 'open'
    }, {
        code: 'OFA-2',
        type_code: 'OFA',
        name: 'OCCUPATIONAL FIRST AID',
        students: [{id :1, name : 'Tommy Jone', email : 'tommy@home.ie' , phone : '0872212321', address : '17 Jump St, Waterford Rd, Cork',status: 'ENROLLED'}],
        max_of_students : 4,
        startdate: '2016-06-23',
        location: 'Kilkenny',
        status: 'open'
      }, function() {
          process.exit()
        });
    });

