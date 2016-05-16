
//save file data in an .webm format file in local system.
<?php 
	//fetch file data and store it using put content.
	$my_file = $_FILES['videofile'];
	$my_blob = file_get_contents($my_file['tmp_name']);
	$savePath = 'vedio3.webm';
	file_put_contents($savePath,$my_blob);
?>
