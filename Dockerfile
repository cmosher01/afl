FROM node

MAINTAINER Christopher A. Mosher <cmosher01@gmail.com>



USER root
RUN echo 'root:root' | chpasswd



# set up non-privileged user
ENV USER user
ENV UID 500
RUN groupadd -g $UID $USER
ENV ALT_GID 1000
RUN groupadd -g $ALT_GID alt_user
ENV HOME /home/$USER
RUN useradd -u $UID -s /bin/bash -m -d $HOME -g $USER -G $ALT_GID $USER
RUN chown -R $USER: $(npm prefix --global)
USER $USER
WORKDIR $HOME



# set up npm features
RUN npm completion >>.bashrc
RUN echo "alias npm-exec='PATH=$(npm bin):$PATH'" >>.bashrc



# configure global defaults for npm
RUN npm config set init.author.name "Christopher A. Mosher" --global
RUN npm config set init.author.email "cmosher01@gmail.com" --global
RUN npm config set init.license "GPL-3.0" --global



# install jspm
RUN npm install jspm --global



# set up dependencies
USER root
COPY package.json ./
COPY config.js ./
RUN chown -R $USER: ./
USER $USER
RUN jspm install



# copy sources
USER root
COPY index.js ./
COPY lib/ ./lib/
COPY svg/ ./svg/
RUN chown -R $USER: ./
USER $USER



# execute program
EXPOSE 8080
CMD jspm run index
