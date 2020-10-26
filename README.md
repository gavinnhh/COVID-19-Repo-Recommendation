![GitHub Logo](/home.png)

This project was aimed to creatd a github repo recommendations based on bag of words machine learning algorithm
We will collect the data from github and train the model, deploy the model into AWS Sagemaker and finally call the 
model endpoint to put into production. The front end uses React and the server end is Flask

## Instructions to run the app

Please make sure AWS and Docker is ready. 

To run the whole project:

Open one terminal and do:

Yarn start

Open another terminal and do:

export FLASK_APP=api.py

Yarn start-api

why yarn start-api?

because in package.json we have:

"scripts": {
    "start": "react-scripts start",
    "start-api": "cd api/venv && flask run --no-debugger",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  
 When we do yarn start-api, it first goes into directory api and then run command flask run....

## How do i collect the data from github

//todo

PS: 

front end inspired by: https://towardsdatascience.com/create-a-complete-machine-learning-web-application-using-react-and-flask-859340bddb33
    
data collection and pre-processing inspired by: https://towardsdatascience.com/building-a-covid-19-project-recommendation-system-4607806923b9
