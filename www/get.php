<?php
$url = dirname(__FILE__).'/'.preg_replace('/^(http|https):\/\/[a-z0-9-.]+\/(.*)$/i', '$2', $_GET['url']);
$data = file_get_contents($url);
$res = array('data'=>$data);
echo($_GET['callback'].'('.json_encode($res).');');
?>
