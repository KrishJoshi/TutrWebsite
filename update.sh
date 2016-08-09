#!/usr/bin/env bash

# Install any new requirements
sudo pip install -r /vagrant/requirements.txt

# Make and perform migrations
sudo python /vagrant/manage.py makemigrations
sudo python /vagrant/manage.py migrate

# Recollect static files
sudo python /vagrant/manage.py collectstatic --noinput

# Deploy the frontend scripts
cd /vagrant/frontend
sudo gulp build

# Restart django
sudo service django-server restart
