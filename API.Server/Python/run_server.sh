#!/bin/sh
# Builds docker container and starts the server
sudo docker build . -t hackpac && sudo docker run hackpac