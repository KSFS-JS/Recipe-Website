#!/bin/sh
309env
gnome-terminal -- /bin/sh -c  'python3 ./easy_chef/manage.py runserver'
gnome-terminal -- /bin/sh -c 'npm start --prefix ./easy_chef_web'