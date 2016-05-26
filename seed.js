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
            status: 'OPEN'
        }, {
            code: 'CFR-2',
            type_code: 'CFR',
            name: 'Cardiac First Responder',
            students: [{id :1, name : 'Mary Smith', email : 'mary@smith.com' , phone : '056234234', address : '59 Rowe St, Wexford',status: 'ENROLLED'}],
            max_of_students : 4,
            startdate: '2016-06-01',
            location: 'Waterford City',
            status: 'OPEN'
        }, {
            code: 'OFAR-1',
            type_code: 'OFAR',
            name: 'OCCUPATIONAL FIRST AID REFRESHER',
            students: [],
            max_of_students : 4,
            startdate: '2017-01-17',
            location: 'Limerick City',
            status: 'DRAFT'
        }, {
            code: 'CFR-1',
            type_code: 'CFR',
            name: 'Cardiac First Responder',
            students: [{id :1, name : 'John Quinn', email : 'quinn@home.ie' , phone : '087443423', address : '26 Jump St, Waterford Rd, Kilkenny',status: 'ENROLLED'},
                {id :2, name : 'Graham Little', email : 'little@iol.ie' , phone : '051426172', address : '2 Lower Road, Waterford',status: 'ENROLLED'}],
            max_of_students : 4,
            startdate: '2014-05-17',
            location: 'Kilkenny City',
            status: 'CLOSED'
        }, {
            code: 'OFA-2',
            type_code: 'OFA',
            name: 'OCCUPATIONAL FIRST AID',
            students: [{id :1, name : 'Timmy Mallet', email : 'timmy@waterford.ie' , phone : '0872223345', address : '47 Jump St, Rosslare Rd, Wexford',status: 'ENROLLED'}
            , {id :2, name : 'Jason Smith', email : 'smithy@test.ie', phone : '08512132342', address : '49 Leap St, Wexford', status: 'ENROLLED'}
            , {id :3, name : 'Shay Murphy', email : 'shay@se2.ie', phone : '021627932', address : '4 Lower Road, Waterford', status: 'ENROLLED'}],
            max_of_students : 4,
            startdate: '2016-06-14',
            location: 'Wexford',
            status: 'OPEN'
        }, {            
            code: 'OFA-3',
            type_code: 'OFA',
            name: 'OCCUPATIONAL FIRST AID',
            students: [{id :1, name : 'Tommy Jone', email : 'tommy@home.ie' , phone : '0872212321', address : '17 Jump St, Waterford Rd, Cork',status: 'ENROLLED'}],
            max_of_students : 4,
            startdate: '2016-06-23',
            location: 'Kilkenny',
            status: 'OPEN'
        }, function() {
          process.exit()
        });
    });