#EWD2016 Assignment 1 & 2

Name: Jonathan McDonald 

#Overview.
First Aid Responder Training single page web application will allow users to browse a website to learn about the company and the courses it offers. The user will also be able to view a list of upcoming courses and allow them to enroll and book this place on a course.

There is an administration module to the website also which allows the owner to login and maintain the courses vy viewing, adding, editing and deleting courses. The owner will also be able to view who has enrolled into a course. There will be functionality to allow the owner to add, edit and delete a student who is booked into a course.

List of user features
 
 + Display company about us information 
 + Display contents page for all the courses that the company runs.
 + Display all upcoming open for enrollment courses and allow the user to enroll.
 + Display a contact us web page to allow users to send a message to the company
 + Display a booking page which allows the user to easily enroll in a course.
 + Administration module to allow the owner to maintain courses and students enrolled in courses.

#Installation 


List of software used to develop this web application:
+ HTML5
+ CSS3
+ Javascript
+ NodeJS v4.4.0
+ MongoDB v3.2.6
+ AngularJS v1.2.18
+ Bootstrap v3.3.6
+ jQuery v1.10.2

## Download
You need to install the following software on your machine
+ GitHub Desktop (https://desktop.github.com/)
+ NodeJS (https://nodejs.org)
+ MongoDB (https://www.mongodb.com/)
You can force Mongo to be installed in C:\mongodb by typing the following at the DOS prompt in the download directory where Mongo install file is located.
```
msiexec.exe /q /i mongodb-win32-x86_64-3.2.4-signed.msi INSTALLLOCATION="C:\mongodb" ADDLOCAL="all"
```
For handiness, You can then get Mongo to Auto Start in Services so you dont need to worry about starting it.
```
sc.exe create MongoDB binPath= "C:\mongodb\bin\mongod.exe --service --config=\"C:\mongodb\mongod.cfg\"" DisplayName= "MongoDB 64bit v3.2.4" start= "auto"
```

## Setup
**Step 1** - Download a clone copy of the sourcecode from GitHub to your machine. Select a location on your machine where you would like to run the web application from and then open a terminal.
```
C:\WIT\web\companyApp>git clone https://github.com/jonathanmcd/companyApp.git
```
**Step 2** - Next you need to install all the necessary Node Packages. There is a file called "package.json" which contains a list of all the necessary node packages required. To install these packages you just type the following command in the terminal.
```
C:\WIT\web\companyApp>npm install
```
**Step 3** - Next you need to confirm MongoDB is running. 
```
C:\mongodb\bin>mongo 127.0.0.1
2016-05-26T12:01:04.310+0100 I CONTROL  [main] Hotfix KB2731284 or later update
MongoDB shell version: 3.2.4
connecting to: 127.0.0.1/test
> show dbs
```
**Step 4** - You need to setup a new database on MongoDB and add sample data
Open a command line prompt to the home directory path of the application
```
C:\WIT\web\companyApp>node seed.js
```
**Step 5** - To start the Web Application open a command line prompt to the home directory path of the application
```
C:\WIT\web\companyApp>node app.js
Express server listening. 127.0.0.1:4000
```

**Step 6** - Start Google Chrome and type in 127.0.0.1:4000 into the web address and hey bingo it should work for you.



###Data Model Design.

Diagram of app's data model (see example below) AND/OR a sample of the test data used (JSON or equivalent).

![][image1]

Use meaningful sample data. Briefly explain any non-trivial issues.

###App Design.
MEAN is a free and open-source JavaScript software stack for building dynamic web sites and web applications.[1]

The MEAN stack makes use of MongoDB, Express.js, Angular.js, and Node.js. Because all components of the MEAN stack support programs written in JavaScript, MEAN applications can be written in one language for both server-side and client-side execution environments.

This is a simple dynamic single page web application using JavaScript across the frontend and backend to implement a MEAN (MongoDB, Express.js, Angular.js, and Node.js) stack approach. 
The frontend is written using HTML5, CSS3 & Javascript.
The Bootstrap and AngularJS framework libraries were used to enable me to develop a responsive Single Page Application (SPA). 
The backend was written in Javascript using the NodeJS engine to create a WEB API and MongoDB to persist the data.

![MEAN Stack][image2]

#UI Design.
Here is a sample of screenshots to highlight the look and feel of the web pages 

### Home Page
![][image1a]: 

### Upcoming courses 
![][image1b]: 

### Booking a Course 
![][image1c]: 

### Administration Console - Maintain Courses
![][image1d]: 

### Administration Console - Maintain a Course
![][image1e]: 

### Administration Console - Adding a Student
![][image1f]: 

### Administration Console - Modifying a Student
![][image1g]: 


[image1a]: ./readme_images/ScreenShot-Home.PNG
[image1b]: ./readme_images/ScreenShot-Upcoming.PNG
[image1c]: ./readme_images/ScreenShot-Booking.PNG
[image1d]: ./readme_images/ScreenShot-AdminMaintainCourses.PNG
[image1e]: ./readme_images/ScreenShot-AdminMaintainCourse.PNG
[image1f]: ./readme_images/ScreenShot-AdminMaintainCourse-AddStudent.PNG
[image1g]: ./readme_images/ScreenShot-AdminMaintainCourse-EditStudent.PNG

## Routing

| Routing       | Description                                                                                      |
|:------------- |:------------------------------------------------------------------------------------------------ | 
| /             | Displays the public facing home page                                                             | 
| /about        | This view has content explaining info about the company                                          |  
| /course/cfr   | This view displays Cardiac First Responder course content and any upcoming open courses for CFR  |   
| /course/ofa   | This view displays Occuptional First Aider course content and any upcoming open courses for OFA  |
| /course/ofar  | This view displays Occuptional First Aider Refresher course content and any upcoming open courses for OFAR |
| /course/efa   | This view displays Emergency First Aid course content and any upcoming open courses for EFA |
| /course/upcoming | Displays a list of all courses currently open that users can enroll and book themselves into a course. |
| /booking | This view allows the web user to select any of the courses currently open for enrollment. The user then enters their details and book themselves into a course they have choosen. |
| /booking/:code_id | This view allows the user to book into a course they have selected from another screen. A specific course is displayed because the user selected it and they just have to then enter their personal contact details. |
| /admin | Displays the admin login screen |
| /admin/courses | This view allows the admin user who has successfully logged in to view, add, edit and delete courses. The admin user can also view, edit, delete and add students to a course. |

## Web API Endpoint Reference

| HTTP Method   | URI | Operation |
|:------------- |:------------- |:-----|
| GET: | /api/courses | return a list of ALL courses regardless of status |
| GET: | /api/courses/:code | return a course details based on course code lookup |
| GET: | /api/courses/open | return a list of ALL courses that are open to the public to enroll |
| GET: | /api/courses/open/:type_code | return a list of courses for a particular course type that are open to the public to enroll |
| GET: | /api/courses/open/distinctTypeCodes | return a list of distinct course type codes where courses are open to the public to enroll |
| POST: | /api/courses/ | Create a new Course |
| POST: | /api/courses/:id/students | Add a new student to a course |
| PUT: | /api/courses/:id | Update a Course|
| PUT: | /api/courses/:id/students | Update a Students details on a course |
| PUT: | /api/courses/delete/:id/students | Delete a student from a course |
| DELETE: | /api/courses/:id | Delete a course |


###Extra features
This web application uses a very simple login authetication for the admin module.
I have added Google Analytics and Google reCAPTCHA. To capture page impressions in Google Analytics for SPA required a bit of tweaking because SPA do not reload web pages when using AnjularJS ng-view 
![][image4]: 

. . . . . Briefly explain any non-standard features, functional or non-functional (e.g. user registration, authentication) developed for the app . . . . . .  

###Independent learning.

. . . . . State the non-standard aspects of Angular (or other related technologies) that you researched and applied in this assignment . . . . .  

 
[image1a]: ./readme_images/ScreenShot-Home.PNG
[image1b]: ./readme_images/ScreenShot-Upcoming.PNG
[image1c]: ./readme_images/ScreenShot-Booking.PNG
[image1d]: ./readme_images/ScreenShot-AdminMaintainCourses.PNG
[image1e]: ./readme_images/ScreenShot-AdminMaintainCourse.PNG
[image1f]: ./readme_images/ScreenShot-AdminMaintainCourse-AddStudent.PNG
[image1g]: ./readme_images/ScreenShot-AdminMaintainCourse-EditStudent.PNG
[image2]: ./readme_images/MEAN_Stack.PNG
[image3]: ./readme_images/model.png
[image4]: ./readme_images/ScreenShot-GoogleAnalytics.PNG


