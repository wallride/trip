<?php
DBPool::me()->setDefault(
    DB::spawn('PgSQL', 'app', 'wallrideapp', 'localhost', 'crm')->
    setEncoding('utf-8')
);

?>
