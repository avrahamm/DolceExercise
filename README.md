# DolceExercise
There are 2 components:
1) Back end: Restful Api developped in Laravel to manage Tasks resource.
and
2) Front end: developped in jquery to manage logic communicates with backend by ajax calls.

Steps to create:
- Open terminal, cd to some directory:

- git clone https://github.com/avrahamm/DolceExercise.git
- cd DolceExercise/
- composer install
- Here open in your editor and copy .env.example to .env
- and set up your DB_CONNECTION=mysql credentials
- php artisan key:generate
- initialize tables and seed some tasks data.
- php artisan migrate --seed
- prepare virtual host of your choice, lets say http://dolce/ and open
or open http://localhost/path-to-public-folder/public/

 
