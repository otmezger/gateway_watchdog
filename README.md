# gateway_watchdog
This project is about watching over a linux installation on a raspberry pi. It includes custom alerts and actions based on things that happen to the system.

# Dependencies
This code has been tested on the Raspberry Pi running [DietPi](http://dietpi.com/). It depends on the following software:

1. Node.JS
1. MongoDB
1. rsync (for deployment)

## Node packages that need to be installed on the gateway
You can install all local dependencies running
```
cd projectDirectory
npm install
```
The code will also need the following npm packages installed globally on the gateway (still not implemented):

1. forever
1. forever-service
1. gulp
1. sendgrid-sender
1. json-file
```
sudo npm install forever forever-service gulp -g
```

## Node packages that need to be installed on the developing computer
Install all dev dependencies with
```
npm install --only=dev
```

Gulp should also be installed globally on your developing computer.


# How to use this code
## Obtain the code
To clone this project, use
```
git clone git@github.com:otmezger/gateway_watchdog.git
```

Feel free to clone this project on your own computer and not on the gateway.

## Deploy
If you clone the project on your developing computer you can use gulp to deploy the code to the gateway. Edit `gulpfile.js` to match your settings.

Recommended: use ssh authentication with keys.

## Setting up the code as a service
Still not implemented.

## Create your SMTP using sendgrid.com
Go to sendgrid.com and create a API key. When you create this key, go to settings and enable full access in Mail Send. 
Save your API key (not your API ID) somewhere in your files because its given to you just once
