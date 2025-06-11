<?php
//作成したいディレクトリ（のパス）
//$pearent_directory_path = "C://inetpub/wwwroot/StereoscopicViewer/temp"; 
$pearent_directory_path = "C://inetpub/wwwroot/StereoscopicViewer/temp"; 
//$pearent_directory_path = "C://"; 
$directory_path = "/xyz/std/16/58097"; 
//$directory_path = "temp"; 
if(chmod($pearent_directory_path, 0777)){
    //モード変更に成功した時の処理
    echo "モード変更に成功しました";
$fileDir = $pearent_directory_path.$directory_path;
	$filelist = glob($fileDir . "*");
	foreach ($filelist as $file) {
//	if (is_file($file)) {
		print($file);
		echo nl2br("\n");
//	}
	}
}else{
    //モード変更に失敗した時の処理
//    echo "モード変更に失敗しました".$pearent_directory_path;
//$fileDir = "C://inetpub";
$fileDir = $pearent_directory_path;
    echo "モード変更に失敗しました".$fileDir."<br>";
	$filelist = glob($fileDir . "*");
	foreach ($filelist as $file) {

//	if (is_file($file)) {
		print($file);
		echo nl2br("\n");
//	}
	}
//$filePath = '/path/to/filePath.ext';
 
$dirPerms = substr(sprintf('%o', fileperms($fileDir)), -4);
//$filePerms = substr(sprintf('%o', fileperms($filePath)), -4);
//var_dump($dirPerms, $filePerms);
//var_dump($dirPerms);
echo $dirPerms;
}
//echo chmod($pearent_directory_path, 0777);
//$directory_path = "C://temp/xyz/std/16/58097";
 
//「$directory_path」で指定されたディレクトリを作成する
//if(mkdir($directory_path, 0777,true)){
if(mkdir($pearent_directory_path.$directory_path,0777,true)){
    //作成に成功した時の処理
    echo "作成に成功しました";
}else{
    //作成に失敗した時の処理
    echo "作成に失敗しました".$pearent_directory_path.$directory_path;
}
?>