#!/bin/sh
sudo rm /etc/nginx/sites-available/node_load_balancing
sudo rm /etc/nginx/sites-enabled/node_load_balancing
sudo cp node_load_balancing /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/node_load_balancing /etc/nginx/sites-enabled/node_load_balancing
sudo service nginx restart

