<?php
    header("Content-Type: text/html;charset=utf-8");
    $file = fopen("blog_user.txt", "r");
    $user=array();
    $i=0;
    //输出文本中所有的行，直到文件结束为止。
    while(!feof($file))
    {
        $user[$i]= fgets($file);//fgets()函数从文件指针中读取一行
        $user[$i] = explode(' ',$user[$i]);
        if($user[$i][4] == $_POST['email']){
            echo 1;
            break;
        }
        $i++;
    }
    fclose($file);