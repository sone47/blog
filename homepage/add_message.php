<?php
    header("Content-Type: text/html;charset=utf-8");
    require 'blog_message.txt';
    date_default_timezone_set('PRC');

    $_POST['name'] = preg_replace('/\s/','',$_POST['name']);
    if($_POST['name'] ==''){
        $_POST['name'] = '路人甲';
    }
    if($_POST['message'] != ''){
        $_POST['message'] = preg_replace('/\s+/',' ',$_POST['message']);
    }
    $_POST['date'] = date('Y-m-d H:i:s');

    $file = fopen("blog_message.txt","a");
    file_put_contents("blog_message.txt", "\n".serialize($_POST), FILE_APPEND);
    fclose($file);
