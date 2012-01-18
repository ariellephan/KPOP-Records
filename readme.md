# KPOP Application (PHP Version) #



This application provides an example of:

1. Building a complete RESTful API in PHP using the Slim framework.
2. Consuming these services using jQuery

Set Up:

1. Create a MySQL database name "kpop". Put "USE "databasename"; in kpop.sql"
2. Execute kpop.sql to create and populate the "kpop" table:

	mysql kpop -u root -p < kpop.sql

3. Deploy the webapp included in this repository.
4. Open api/index.php. In the getConnection() function at the bottom of the page, make sure the connection parameters match your database configuration. 
5. Open main.js and make sure the rootURL variable matches your deployment configuration.
6. Access the application in your browser. For example: http://localhost/SlimJ.