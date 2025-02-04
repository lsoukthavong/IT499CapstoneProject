# Project Name: IN453M6 Software Distribution

## Description
[This project is to create a MySQL database and load it with plant inventory into plant tables. Then have the web application return Inventory items for search and purchasing  ]


## Table of Contents
-[Installation](#installation)
	-[Prerequisites](#prerequistes)
	-[Database Setup](#database-setup)
	-[CSV Import](#csv-Import)
	-[Setting Up VS Code]
	-[Application Setup](#application-setup)
- [Usage](#usage)


## Installation


### Prerequisites
Install the following before beginning:
-[MySQL](https://dev.mysql.com/downloads/mysql/)
-[Visual Studio Code](https://code.visualstudio.com/)
-[node.js](https://nodejs.org/)

### Database Setup

1. **Install MySQL:** 
	- Download and install MySQL from [MySQL Community Downloads](https://dev.mysql.com/downloads/mysql/)
	 
	 
2. **Create the Database:**
	- Open MySQL Command-Line Interface
	- Run the following SQL command to create a new database:
	```sql
	CREATE DATABASE nursery;
		USE nursery;
	```

### Create and Load Tables with CSV


1.  **Create and Load Tables:**
	- In MySQL Command-Line Interface
	- Run the following SQL commands to create tables:
	1. plants
	```sql 
	CREATE TABLE plants(
		id INT(11) NOT NULL AUTO_INCREMENT,
		name VARCHAR(255) NOT NULL,
		type VARCHAR(50),
		description TEXT,
		quantity INT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
		image_url VARCHAR(255)
		PRIMARY KEY (id)
	);
	```
---NEED TO REVIEW AND UPDATE BELOW----------
		
2.**Save Data into Uploads folder:**
	- Save contents from palnts_data.csv in web archive into the [MySQL Uploads] folder(C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/)
		
		
3. **Load Tables:**
	- In MySQL Command-Line Interface
	- Run the following SQL commands to load data from csv files into the tables:
		1. plants:
		```sql 
		LOAD DATA INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/plants_data.csv'
		INTO TABLE plants 
		FIELDS TERMINATED BY ','
		ENCLOSED BY '"'
		LINES TERMINATED BY '\n'
		IGNORE 1 ROWS;
		```
4. **Verify Data Import:**
	- In MySQL Command-Line Interface
	- Verify that the data import was successful by querying table(s):
	```sql plants
	SELECT * FROM plants;
	```
	
5. **Create Users:**
	- In MySQL Command-Line Interface
	- Create user accounts:
	```sql
	CREATE USER 'staffA'@'localhost' IDENTIFIED BY 'passwordA';

	```

5. **Grant User Access:**
	- In MySQL Command-Line Interface
	- Create user accounts:
	```sql
	GRANT SELECT ON staffA.plants TO 'plants'@'localhost';
	```
	- Grant specific user access

### Setting up VS Code

1. **Install Visual Studio Code:**
	- Download and install [Visual Studio Code](https://code.visualstudio.com/)
	


### Application Setup
	
1. **Create Project Directory folder:**
	1. Open **File Explorer** 
	2. Navigate to location where you want to create project directory
	3. Create new folder and save as (IT499FinalProject)
	
2. **Install Dependencies:**
	- In the project directory install needed dependencies
	- Open the Integerated terminal install dependencies:
	1. Launch VS Code
	2. Open View > Terminal to Open terminal window	
	```sh
	npm install express
	npm install mysql2
	npm install cors
	npm install http
	npm install ws
	npm install bcrypt
	npm install sonwebtoken
	npm install dotenv
	```	
3. **Extract web archive contents into Project Directory**
	1. Right click on [web archive](C:\Users\lsoukthavong\OneDrive\Lorraine\School\PURDUE UNIVERISTY GLOBAL\2024\....)
	2. Select Extract All.
	3. Change path to extract to Project Directory and click Extract button.

4. ** Open Project in VS code:**
	1. Click File > Open folder and locate folder **IT499FinalProject**
	2. Click Select Folder.


## Running Application

1. **Start MySQL server:**
	- Start MySQL server using CLI


2. **Start JavaScript Application:**
	- In VS Code terminal window run command to start application:
	```sh
	node server.mjs
	```

3. **Access Application:**
	- Open web browser to `http://localhost:5501`
	

4. **Stopping Application:**
	- To stop the application press 'Ctrl + C' in terminal window


##Usage
	-  After setup you can use application:
	1. Click on the ***plant*** image to iew more detail about plant. 
	2. Click on the ***Add to cart*** button to add plant to cart.
	3. Click on ***Review Cart*** to review items in cart.
	4. Click on ***Checkout*** to finalize order.
	5. Click on ***Chat*** to chat with customer service.
	
	

