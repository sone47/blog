<?php
    header("Content-Type: text/html;charset=utf-8");
    require 'blog_user.txt';

    $name = $_POST['name'];
    $pass = $_POST['pass'];
    $ques = $_POST['ques'];
    $ans = $_POST['ans'];
    $email = $_POST['email'];
    $birthday = $_POST['year'].'-'.$_POST['month'].'-'.$_POST['day'];
    $ps = $_POST['ps'];

    $txt = "\n$name $pass $ques $ans $email $birthday $ps";

    $file = fopen("blog_user.txt",'a');
    file_put_contents("blog_user.txt", $txt, FILE_APPEND);

    fclose($file);
