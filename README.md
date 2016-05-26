#Assignment 2 - MEAN app.

Name: Jonathan McDonald 

###Overview.
Company Web Application - First Aid Responder Training This website will allow users to browse a few pages 
to find out info about the company and the courses it provides. It also allows a visitor to book a course.

The administrator of the website will be able to log in and view who has booked into courses. 
The administrator can add and remove courses also.

This is a simple company website that is written in HTML5 and CSS using the Bootstrap framework and AngularJS. 
Javascript will be used for the client and frontend. NodeJS javscript app server will be used 
for the backend to hook up to the MonjoDB.
...... A statement of the app concept and objectives (about 1/2 page) ........


 . . . . . List of user features (excluding user registration and authentication) . . . . 
 
 + Feature 1
 + Feature 2
 + Feature 3
 + etc
 + etc

###Installation requirements.
. . . .  List of software used to develop the app . . . . . . . 
+ AngularJS 1.x
+ Bootstrap 3
+ etc
+ etc 


. . . . . . Also, explain (to a third party) what steps one must take to run your app after cloning it from the repository, e.g. any non-standard software installation ; any environment setup; how to start app; where to view app in browser . . . . . . . 

###Data Model Design.

Diagram of app's data model (see example below) AND/OR a sample of the test data used (JSON or equivalent).

![][image1]

Use meaningful sample data. Briefly explain any non-trivial issues.

###App Design.

A simple diagram showing the app's component design, in particular controllers and services (see example below).

![][image2]

###UI Design.

. . . . . Screenshots of app's views (see example below) with appropriate captions (excluding user regeneration and login views) . . . . . . . 

![][image1a]: 
![][image1b]: 
![][image1c]: 
![][image1d]: 
![][image1e]: 
![][image1f]: 
![][image1g]: 


###Routing.
+ / - Displays the public facing home page
+ /about - This view has content explaining info about the company
+ /course/cfr - This view displays Cardiac First Responder course content and any upcoming open courses for CFR
+ /course/ofa - This view displays Cardiac First Responder course content and any upcoming open courses for CFR
+ /course/ofar - This view displays Cardiac First Responder course content and any upcoming open courses for CFR
+ /course/efa - This view displays Cardiac First Responder course content and any upcoming open courses for CFR
+ /course/upcoming - Displays a list of all courses currently open that users can enroll and book themselves into a course.
+ /booking - This view allows the web user to select any of the courses currently open for enrollment. The user then enters their details and book themselves into a course they have choosen.
+ /booking/:code_id - This view allows the user to book into a course they have selected from another screen. A specific course is displayed because the user selected it and they just have to then enter their personal contact details.
+ /admin - Displays the admin login screen
+ /admin/courses - This view allows the admin user who has successfully logged in to view, add, edit and delete courses. The admin user can also view, edit, delete and add students to a course.

## Web API Endpoint Reference

Describe your web API.


HTTP Verb &amp; Path | Description
-- | --
GET: /api/courses | return a list of ALL courses regardless of status
GET: /api/courses/:code | return a course details based on course code lookup
GET: /api/courses/open | return a list of ALL courses that are open to the public to enroll

| GET: /api/courses/open/:type_code | return a list of courses for a particular course type that are open to the public to enroll |
| GET: /api/courses/open/distinctTypeCodes | return a list of distinct course type codes where courses are open to the public to enroll |
| POST: /api/courses/ | Create a new Course |
| POST: /api/courses/:id/students | Add a new student to a course |
| PUT: /api/courses/:id | Update a Course|
| PUT: /api/courses/:id/students | Update a Students details on a course |
| PUT: /api/courses/delete/:id/students | Delete a student from a course |
| DELETE: /api/courses/:id | Delete a course |


###Extra features
This web application uses a very simple login authetication for the admin module.
I have added Google Analytics and Google reCAPTCHA. To capture page impressions in Google Analytics for SPA required a bit of tweaking because SPA do not reload web pages when using AnjularJS ng-view 
![][image4]: 

. . . . . Briefly explain any non-standard features, functional or non-functional (e.g. user registration, authentication) developed for the app . . . . . .  

###Independent learning.

. . . . . State the non-standard aspects of Angular (or other related technologies) that you researched and applied in this assignment . . . . .  

 
[image1a]: ./ScreenShot-Home.PNG
[image1b]: ./ScreenShot-Upcoming.PNG
[image1c]: ./ScreenShot-Booking.PNG
[image1d]: ./ScreenShot-AdminMaintainCourses.PNG
[image1e]: ./ScreenShot-AdminMaintainCourse.PNG
[image1f]: ./ScreenShot-AdminMaintainCourse-AddStudent.PNG
[image1g]: ./ScreenShot-AdminMaintainCourse-EditStudent.PNG
[image2]: ./design.png
[image3]: ./model.png
[image4]: ./ScreenShot-GoogleAnalytics.PNG


