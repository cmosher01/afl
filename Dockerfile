FROM node:slim

MAINTAINER Christopher A. Mosher <cmosher01@gmail.com>



USER root
RUN echo 'root:root' | chpasswd



# set up non-privileged user
ENV USER user
ENV UID 500
ENV ALT_GID 1000
ENV USER_HOME /home/$USER
RUN groupadd -g $UID $USER
RUN groupadd -g $ALT_GID alt_user
RUN useradd -u $UID -s /bin/bash -m -d $USER_HOME -g $USER -G $ALT_GID $USER
RUN chown -R $USER: $(npm prefix --global)
USER $USER
ENV HOME $USER_HOME
WORKDIR $HOME



# update npm
# This was failing with:
#   EXDEV: cross-device link not permitted, rename '/usr/local/lib/node_modules/npm' -> '/usr/local/lib/node_modules/.npm.DELETE'
# RUN npm update --global

# set up npm features
RUN npm completion >>.bashrc
RUN echo "alias npm-exec='PATH=$(npm bin):$PATH'" >>.bashrc



# install n, and use it to install latest node
RUN npm install n --global
ENV NODE_VERSION latest
RUN n $NODE_VERSION



# configure global defaults for npm
RUN npm config set init.author.name "Christopher A. Mosher" --global
RUN npm config set init.author.email "cmosher01@gmail.com" --global
RUN npm config set init.license "GPL-3.0" --global



# install jspm
USER root
RUN apt-get update && apt-get install --no-install-recommends -y git
USER $USER
RUN npm install jspm --global



# copy program sources
USER root
COPY package.json ./
COPY config.js ./
COPY index.js ./
COPY lib/ ./lib/
COPY svg/ ./svg/
RUN chown -R $USER: ./
USER $USER
RUN jspm install

CMD jspm run index

EXPOSE 8080
