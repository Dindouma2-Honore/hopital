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
        $stmt=$pdo->prepare("SELECT * FROM facture WHERE id=?");
        $stmt->execute($_GET['id']);
        $facture=$stmt->fetch(PDO::FETCH_ASSOC);
         echo json_encode($facture);
    } 
    else {
        $stmt=$pdo->prepare("SELECT * FROM facture ");
        $stmt->execute();
        $facture=$stmt->fetchAll(PDO::FETCH_ASSOC);
         echo json_encode($facture);
        }
        
    }
        
// =======================INSERTION ==============================
// =====================================================

elseif ($method==="POST") {
    $stmt=$pdo->prepare("INSERT INTO facture(reference,patient,service,montant, status,date) VALUES(?,?,?,?,?,?) ");
    $stmt->execute([
        $data['reference'],$data['patient'],$data['service'],$data['montant'] ,$data['status'],$data['date']
        ]);
        
        }
// =======================MODIFICATION ==============================
// =====================================================
elseif ($method==="PUT") {
    $stmt=$pdo->prepare("UPDATE facture SET reference=?,patient=?,service=?,montant=?, status=?,date=? WHERE id=?" );
    $stmt->execute([
        $data['reference'],$data['patience'],$data['service'],$data['id'], $data['status'],$data['date'],$data['id']
        ]);
}
// =======================Supprimer ==============================
// =====================================================

elseif ($method==="DELETE") {
    if (isset($_GET['id'])) {
       $stmt=$pdo->prepare("DELETE FROM facture WHERE id=?");
       $stmt->execute([$_GET['id']]);
    } else {
        echo json_encode(["Message"=>"ID requis"]);
    }
    
}



















?>