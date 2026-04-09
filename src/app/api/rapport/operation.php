<?php
header('Content-Type:application/json');
header('Access-Control-Allow-Origin:*');
header('Access-Control-Allow-Methods:GET,POST,PUT,DELETE');
header('Access-Control-Allow-Headers:Content-Type,Authorization');

include_once './connexion.php';
$data=json_decode(file_get_contents('php://input'),true);
$method=$_SERVER['REQUEST_METHOD'];
// =======================SELECTION===============
// GET(SELECT)
// ==============================================

if ($method==="GET") {
    if (isset($_GET['id'])) {
        $stmt=$pdo->prepare("SELECT * FROM operation WHERE id=?");
        $stmt->execute($_GET['id']);
        $operation=$stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($operation);
    }
    else {
        $stmt=$pdo->prepare("SELECT * FROM operation");
        $stmt->execute();
        $operation=$stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($operation);
            
   }
}
// =======================INSERTION===============
// POST(INSERT)
// ==============================================
elseif ($method==="POST") {
    $stmt=$pdo->prepare("INSERT INTO operation(bloc,patient,intervention,chirurgien,heureDebut,duree,status ) VALUES(?,?,?,?,?,?,?)");
    $stmt->execute([
        $data['bloc'],
        $data['patient'],
        $data['intervention'],
        $data['chirurgien'],
        $data['heureDebut'],
        $data['duree'],
        $data['status']
        ]);
        }
// =======================MODIFICATION===============
// PUT(UPDATE)
// ==============================================
elseif ($method==="PUT") {
    $stmt=$pdo->prepare("UPDATE operation SET bloc=?,patient=?,intervention=?,chirurgien=?,heureDebut=?,duree=?,status=? WHERE id=?" );
    $stmt->execute([
         $data['bloc'],
        $data['patient'],
        $data['intervention'],
        $data['chirurgien'],
        $data['heureDebut'],
        $data['duree'],
        $data['status'],
        $data['id']
        ]);
}
        
// =======================SUPPRESSION===============
// DELETE
// ==============================================
elseif ($method==="DELETE") {
    if (isset($_GET['id'])) {
       $stmt=$pdo->prepare("DELETE FROM operation WHERE id=?");
       $stmt->execute([$_GET['id']]);
    }
    else {
        echo json_encode(["Message"=>"ID requis"]);
    }
}

?>