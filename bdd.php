<?php

$db = new PDO('mysql:host=localhost;dbname=bddtimer;charset=utf8', 'root', '');
if(!$db){
    echo 'Erreur de connexion à la base de données';
}else{
    $stmp = ('INSERT INTO `time`(`time`) VALUES ("'.$_POST['time'].'")');
    $stmt = $db->prepare($stmp);
    $stmt->execute();
}

?>

