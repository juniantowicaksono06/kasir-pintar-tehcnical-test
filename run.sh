#!/bin/bash

target_dir="/var/www/html/vendor"

if [ "$(ls -A $folder_path)" ]; then
    echo "Serving Folder is not empty running PHP Artisan"
    composer install
    /root/.bun/bin/bun install
    # /usr/local/bin/apache2-foreground
else
    echo "Serving Folder is empty creating laravel from scratch"
    cd /var/www/ && composer create-project laravel/laravel html
    cd /var/www/html && /root/.bun/bin/bun add react react-dom @types/react @types/react-dom
    cd /var/www/html && /root/.bun/bin/bun add -d @babel/preset-react ts-loader typescript
    cd /var/www/html && php artisan storage:link
    php artisan key:generate
    tsc --init --jsx react
fi
cd /var/www/html && /root/.bun/bin/bun run dev:react & disown
cd /var/www/html && /root/.bun/bin/bun run dev:laravel