# Voting-System

## Description
This project is an attempt to develop a working model for a secure online voting system 

## Getting Started
  First get this project cloned to your local system using the following command on your terminal .
  ```
  $ git clone https://github.com/Samsung-Blue/Voting-System.git
  ```
  To get this project running on your system follow the following step by step guide .
  
### Prerequisites
  * Install NodeJS and npm
    Linux users can  install running the following commands on the terminal
      ```
      $ sudo apt-get update
      $ sudo apt-get install nodejs
      $ sudo apt-get install npm
      ```
  * Install and set up mysql
  * Install redis 3.2 from https://redis.io/download
  * Install mongod using sudo apt-get install mongod-server
### Running the project
* First in the location where you have git git cloned the repo get inside the repo folder and then open the terminal inside the repo folder and run the following commands :
    ```
    $ npm install
    ```
* Configure your database
    * Go to the config folder inside the repo folder. You will find a file named config.example.json .
    * Copy the contents of this file to a file named config.json.
    * In config.json fill in your db credentials like dbname,username and password and save it ofcourse.
* Configure the email sending setup 
	* Copy the contents of the env.example.js file to a file named env.js and fill the email credentials needed for smtp connection 
* Go to the folder where you installed redis and run the command ./src/redis-server to keep the redis server running.
* Now as the final step to run the node server write on your terminal the following command :
    ```
    $ npm start
    ```
* If you have followed the steps correctly this will get your node server running
on localhost : 3000. To view it go to your browser and type in http://localhost :3000. Also if you face any issues so far, google and stackoverflow will come to rescue :P


## Features and the workflow of the application
* After your details have been recorded in aadhar database with our other application visit the online voting system site.
![Alt text](./screenshots/h2.png?raw=true "Optional Title")

## Built With
* Html
* CSS
* Javascript
* AngularJS
* Bootstrap
* NodeJS with Express.js as framework
* Mysql