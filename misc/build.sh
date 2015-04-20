#!/bin/bash
php5 /var/www/onphp/meta/bin/build.php ../config/config.inc.php ../meta/config.xml
php5 showFullSchema.php
