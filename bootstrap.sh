#!/usr/bin/env bash

# Update the package installer
apt-get update

# Install apache and the dev package for mod_wsgi 
apt-get install -y apache2
apt-get install -y apache2-dev

# Install python tools
apt-get install -y python-dev
apt-get install -y python-pip

# Install python imaging libraries
apt-get build-dep python-imaging
apt-get install -y libjpeg8 libjpeg62-dev libfreetype6 libfreetype6-dev

# Install git (needed by bower)
apt-get install -y git

# Install mysql with a dev password
debconf-set-selections <<< 'mysql-server mysql-server/root_password password devDBpass'
debconf-set-selections <<< 'mysql-server mysql-server/root_password_again password devDBpass'
apt-get install -y mysql-server-5.6
apt-get install -y libmysqlclient-dev

# Install it's requirements
pip install -r /vagrant/requirements.txt

# Produce a local_settings.py that will work with the database we set up
cat > /vagrant/LHR70/local_settings.py <<- EOM
from settings import DEBUG

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'lhr',
        'USER': 'root',
        'PASSWORD': 'devDBpass',
        'HOST': 'localhost',
        'PORT': '',
        'OPTIONS': {'charset': 'utf8mb4'},
    }
}

EOM

# Add our lhr database
mysql -uroot -pdevDBpass -e "CREATE DATABASE lhr CHARACTER SET utf8"

# And perform the initial migration
python /vagrant/manage.py migrate

# Install node.js
curl -sL https://deb.nodesource.com/setup_4.x | bash -
apt-get install -y nodejs unzip python g++ build-essential

# Update npm
npm install -g npm

# Install yeoman grunt bower grunt gulp
npm install -g yo bower grunt-cli gulp

# Collect static files
python /vagrant/manage.py collectstatic --noinput

# Create a dev Admin user
echo "from django.contrib.auth.models import User; User.objects.create_superuser('admin', 'admin@example.com', 'devAdminPass')" | python /vagrant/manage.py shell

# Set up the django wsgi app as a service 
mv django-server.conf /etc/init/django-server.conf
initctl reload-configuration

# Start the django django-server
service django-server start

# Move the update script to /usr/local/bin
mv update.sh /usr/local/bin/project-update

# Setup the frontend dependenices
cd /vagrant/frontend
npm install
bower --allow-root install

# Not sure why we need this, but without it, the node-sass module doesn't work
npm rebuild node-sass

# Do a project-update, for good measure
project-update
