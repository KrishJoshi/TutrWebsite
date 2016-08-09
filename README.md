# README #

This README details how to get up and running with this repo

### What is this repository for? ###

This is part of the London Heathrow 70th Birthday Campaign, and is the site where users can add their stories, have them moderated, and hopefully win a prize.  Possible prizes, and curated user stories are displayed on the home page.

It is a Django server, with an Angular frontend.

### How do I get set up? ###

* Install Vagrant
* Install VirtualBox
* Clone this repo
* Run the command `vagrant up` in the repo dir
* Go grab a tea/coffee, provisioning the server will take several minutes
* You now have a dev server, and should be able to access it at localhost:8000

#### Frontend Setup

* Goto Frontend folder
* Install all the NPM packages
* Install all the bower packages
* You should now be able to run `gulp serve`


##### Quick setup command:
```
#!bash

cd frontend
npm install
bower install
gulp serve

```

### Updates to the environment ###

As you develop, any changes made to the python requirements(.txt), the models in Django, the static files, or to the frontend scripts, will all require updating the django server.

This can be done with a one size fits all command that is baked into the VM as part of bootstrapping.

* SSH into the VM with `vagrant ssh`
* Run the command `project-update`


### Who do I talk to? ###

* Bongani Ndlovu
* David Downes
* Krish Joshi
* Dina Albrecht