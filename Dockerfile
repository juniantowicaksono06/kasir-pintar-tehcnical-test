FROM php:8.1-apache-bullseye
ENV ENV_FILE_PATH .env

RUN cd /tmp && php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"

RUN cd /tmp && php composer-setup.php

RUN cd /tmp && php -r "unlink('composer-setup.php');"
RUN mv /tmp/composer.phar /usr/local/bin/composer

RUN curl -fsSL https://deb.nodesource.com/setup_current.x | bash -

RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    curl \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libmcrypt-dev \
    libgd-dev \
    jpegoptim optipng pngquant gifsicle \
    libonig-dev \
    libxml2-dev \
    zip \
    sudo \
    unzip \ 
    libmagickwand-dev

RUN apt-get update -y && apt install git libzip-dev libpng-dev unzip nodejs libcurl4-openssl-dev pkg-config libssl-dev libpq-dev -y

RUN docker-php-ext-install zip gd mysqli pdo pdo_mysql

RUN pecl install mongodb && docker-php-ext-enable mongodb

RUN rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://bun.sh/install | bash

WORKDIR /var/www/html

RUN apt-get clean && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-configure gd --enable-gd --with-freetype --with-jpeg
RUN docker-php-ext-configure pgsql -with-pgsql=/usr/local/pgsql
RUN docker-php-ext-install pdo_pgsql pdo_mysql mbstring exif pcntl bcmath gd pgsql

RUN pecl install imagick; \
    docker-php-ext-enable imagick;

COPY ./run.sh /usr/local/bin/run.sh

RUN chmod u+x /usr/local/bin/run.sh