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

if ($method==="GET") {
    if (isset($_GET['numero'])) {
        $stmt=$pdo->prepare("SELECT * FROM urgence WHERE numero=?");
        $stmt->execute($_GET['numero']);
        $urgence=$stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($urgence);
    } 
    else {
        $stmt=$pdo->prepare("SELECT * FROM urgence ");
        $stmt->execute();
        $urgence=$stmt->fetchAll(PDO::FETCH_ASSOC);
         echo json_encode($urgence);
        }
        
    }
        
// =======================INSERTION ==============================
// =====================================================

elseif ($method==="POST") {
    $stmt=$pdo->prepare("INSERT INTO urgence(id,patient,priorite,raison,heureArrive,docteur,status) VALUES(?,?,?,?,?,?,?) ");
    $stmt->execute([
        $data['id'],$data['patient'],$data['priorite'],$data['raison'],$data['heureArrive'],$data['docteur'],$data['status']
        ]);
        
        }
// =======================MODIFICATION ==============================
// =====================================================
elseif ($method==="PUT") {
    $stmt=$pdo->prepare("UPDATE urgence SET id=?,patient=?,priorite=?,raison=?,heureArrive=?,docteur=?,status=? WHERE numero=?");
    $stmt->execute([
        $data['id'],$data['patient'],$data['priorite'],$data['raison'],$data['heureArrive'],$data['docteur'],$data['status'],$data['numero']
        
        ]);
}
// =======================Supprimer ==============================
// =====================================================

elseif ($method==="DELETE") {
    if (isset($_GET['numero'])) {
       $stmt=$pdo->prepare("DELETE FROM urgence WHERE numero=?");
       $stmt->execute([$_GET['numero']]);
    } else {
        echo json_encode(["Message"=>"ID requis"]);
    }
    
}



















?>