<?php
    header("Content-Type: text/html;charset=utf-8");
    $file = fopen("blog_message.txt", "r");
    $user=array();
    $arr = array();
    $str = '';
    $i=0;
    //输出文本中所有的行，直到文件结束为止。
    while(!feof($file))
    {
        $user[$i]= fgets($file);//fgets()函数从文件指针中读取一行

        array_push($arr,json_encode(unserialize($user[$i]),JSON_UNESCAPED_UNICODE));

        $i++;
    }
    echo(json_encode($arr,JSON_UNESCAPED_UNICODE));

    fclose($file);