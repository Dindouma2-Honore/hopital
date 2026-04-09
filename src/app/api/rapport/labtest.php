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

if ($method=="GET") {
    if (isset($_GET['numero'])) {
        $stmt=$pdo->prepare("SELECT * FROM labtest WHERE numero=? ");
        $stmt->execute($_GET['numero']);
        $lab=$stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($lab);
    }
    else {
        $stmt=$pdo->prepare("SELECT * FROM labtest ORDER BY numero DESC");
        $stmt->execute();
        $lab=$stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($lab);
            
   }
}
// =======================INSERTION===============
// POST(INSERT)
// ==============================================
elseif ($method==="POST") {
    $stmt=$pdo->prepare("INSERT INTO labtest(id,patient,type,prescripteur,heure,status ) VALUES(?,?,?,?,?,?)");
    $stmt->execute([
        $data['id'],
        $data['patient'],
        $data['type'],
        $data['prescripteur'],
        $data['heure'],
        $data['status']
        ]);
        }
// =======================MODIFICATION===============
// PUT(UPDATE)
// ==============================================
elseif ($method==="PUT") {
    $stmt=$pdo->prepare("UPDATE labtest SET id=?,patient=?,type=?,prescripteur=?,heure=?,status=? WHERE numero=?");
    $stmt->execute([
        $data['id'],
        $data['patient'],
        $data['type'],
        $data['prescripteur'],
        $data['heure'],
        $data['status'],
        $data['numero']
        ]);
}
        
// =======================SUPPRESSION===============
// DELETE
// ==============================================
elseif ($method=="DELETE") {
    if (isset($_GET['numero'])) {
       $stmt=$pdo->prepare("DELETE FROM labtest WHERE numero=?");
       $stmt->execute([$_GET['numero']]);
    }
    else {
        echo json_encode(["Message"=>"ID requis"]);
    }
}

?>