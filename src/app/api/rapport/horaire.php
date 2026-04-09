<?php

header('Content-Type:application/json');
header('Access-Control-Allow-Origin:*');
header('Access-Control-Allow-Methods:GET,POST,PUT,DELETE');
header('Access-Control-Allow-Headers:Content-Type,Authorization');

include_once './connexion.php';
$data=json_decode(file_get_contents('php://input'),true);
$method=$_SERVER['REQUEST_METHOD'];

// =======================SELECTION ==============================
// =====================================================

if ($method=="GET") {
    if (isset($_GET['id'])) {
        $stmt=$pdo->prepare("SELECT * FROM horaire WHERE id=?");
        $stmt->execute($_GET['id']);
        $horaire=$stmt->fetch(PDO::FETCH_ASSOC);
         echo json_encode($horaire);
    } 
    else {
        $stmt=$pdo->prepare("SELECT * FROM horaire ");
        $stmt->execute();
        $horaire=$stmt->fetchAll(PDO::FETCH_ASSOC);
         echo json_encode($horaire);
        }
        
    }
        
// =======================INSERTION ==============================
// =====================================================

elseif ($method=="POST") {
    $stmt=$pdo->prepare("INSERT INTO horaire(docteur,role,departement,planing) VALUES(?,?,?,?) ");
    $stmt->execute([
        $data['docteur'],$data['role'],$data['departement'],$data['planing']
        ]);
        
        }
// =======================MODIFICATION ==============================
// =====================================================
elseif ($method=="PUT") {
    $stmt=$pdo->prepare("UPDATE horaire SET docteur=?,role=?,departement=?,planing=?");
    $stmt->execute([
        $data['docteur'],$data['role'],$data['departement'],$data['planing']
        ]);
}
// =======================Supprimer ==============================
// =====================================================

elseif ($method=="DELETE") {
    if (isset($_GET['id'])) {
       $stmt=$pdo->prepare("DELETE FROM horaire WHERE id=?");
       $stmt->execute($_GET['id']);
    } else {
        echo json_encode(["Message"=>"ID requis"]);
    }
    
}



















?>