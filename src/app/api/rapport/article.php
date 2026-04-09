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
        $stmt=$pdo->prepare("SELECT * FROM article WHERE id=?");
        $stmt->execute($_GET['id']);
        $article=$stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($article);
    } 
    else {
        $stmt=$pdo->prepare("SELECT * FROM article ");
        $stmt->execute();
        $article=$stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($article);
        
        }
        
    }
        
// =======================INSERTION ==============================
// =====================================================

elseif ($method=="POST") {
    $stmt=$pdo->prepare("INSERT INTO article(reference,nom,categorie,quantite,minQuantite,location,status) VALUES(?,?,?,?,?,?,?) ");
    $stmt->execute([
        $data['reference'],$data['nom'],$data['categorie'],$data['quantite'],$data['minQuantite'],$data['location'],$data['status']
        ]);
        
        }
// =======================MODIFICATION ==============================
// =====================================================
elseif ($method=="PUT") {
    $stmt=$pdo->prepare("UPDATE article SET reference=?,nom=?,categorie=?,minQuantite=?,location=?,status=?");
    $stmt->execute([
        $data['reference'],$data['nom'],$data['categorie'],$data['quantite'],$data['minQuantite'],$data['location'],$data['status']
        ]);
}
// =======================Supprimer ==============================
// =====================================================

elseif ($method=="DELETE") {
    if (isset($_GET['id'])) {
       $stmt=$pdo->prepare("DELETE FROM article WHERE id=?");
       $stmt->execute($_GET['id']);
    } else {
        echo json_encode(["Message"=>"ID requis"]);
    }
    
}



















?>