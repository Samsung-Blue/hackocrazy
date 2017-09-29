# Voting-System

## Description
This project is an attempt to develop a working model for a secure online voting system 

## Getting Started
  First get this project cloned to your local system using the following command on your terminal .
  ```
  $ git clone https://github.com/Samsung-Blue/hackocrazy.git
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
* Go to routes folder and to the file verify.js.There at lines 58 and 123 change the mock aadhar api url to localhost:8000 where you run the mock aadhaar api application after cloning the other repo corresponding to that.
* Go to the folder where you installed redis and run the command ./src/redis-server to keep the redis server running.
* Now as the final step to run the node server write on your terminal the following command :
    ```
    $ npm start
    ```
* If you have followed the steps correctly this will get your node server running
on localhost : 3000. To view it go to your browser and type in http://localhost :3000. 


## Features and the workflow of the application

### User side

* After your details have been recorded in aadhar database with our other application visit the online voting system site.
![Home page](./screenshots/h1.png?raw=true "Optional Title")

* Register as a voter by clicking on register link and then filling in necessary details along with fingerprint.
![Registration](./screenshots/h2.png?raw=true "Optional Title")

* On submitting registration details it is verified with the aadhar api.If the details are correct then you get a page showing that a one time link has been sent to your mail.
![One time link](./screenshots/h3.png?raw=true "Optional Title")

* On going to your mail and clicking on the one time link you are led to an instructions page.
![One time link in mail](./screenshots/h4.png?raw=true "Optional Title")
![Instructions](./screenshots/h5.png?raw=true "Optional Title")

* After registration and until day of voting you will receive three keys in your mail inbox.
![Keys](./screenshots/h8.png?raw=true "Optional Title")

* On the day of voting finally you will have to login via the one time link sent to your email as soon as you try to login using your email id and then upload all the 3 keys received along with your finger print and the party you are voting for.
![Vote](./screenshots/h14.png?raw=true "Optional Title")

* If all the keys are correct along with the finger print which is again verified with aadhar api, then your vote is taken into account or discarded .
![thanks for voting](./screenshots/h15.png?raw=true "Optional Title") 


### Admin side

* Login as admin after visiting site url/admin
![Admin login](./screenshots/h6.png?raw=true "Optional Title")

* Send keys to the mail ids of all the registered voters at random times until the voting day.Send the third key only on the voting day so that no one can vote before the voting day.
![Send keys](./screenshots/h7.png?raw=true "Optional Title")

* After voting is over click on the count button to get a count of votes each party has received in their favour.
![Results](./screenshots/h11.png?raw=true "Optional Title")


## Built With
* Html
* CSS
* Javascript
* AngularJS
* Bootstrap
* NodeJS with Express.js as framework
* Mysql