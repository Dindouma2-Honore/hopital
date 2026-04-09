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
        $stmt=$pdo->prepare("SELECT * FROM labresult WHERE numero=?");
        $stmt->execute($_GET['numero']);
        $lab=$stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($lab);
    }
    else {
        $stmt=$pdo->prepare("SELECT * FROM labresult ORDER BY numero DESC");
        $stmt->execute();
        $lab=$stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($lab);
            
   }
}
// =======================INSERTION===============
// POST(INSERT)
// ==============================================
elseif ($method==="POST") {
    $stmt=$pdo->prepare("INSERT INTO labresult(patient,nom,valeur,unite,reference,status ) VALUES(?,?,?,?,?,?)");
    $stmt->execute([
        $data['patient'],
        $data['nom'],
        $data['valeur'],
        $data['unite'],
        $data['reference'],
        $data['status']
        ]);
        }
// =======================MODIFICATION===============
// PUT(UPDATE)
// ==============================================
elseif ($method==="PUT") {
    $stmt=$pdo->prepare("UPDATE labresult SET patient=?,nom=?,valeur=?,unite=?,reference=?,status=? WHERE numero=?");
    $stmt->execute([
        $data['patient'],
        $data['nom'],
        $data['valeur'],
        $data['unite'],
        $data['reference'],
        $data['status'],
        $data['numero']
        ]);
}
        
// =======================SUPPRESSION===============
// DELETE
// ==============================================
elseif ($method=="DELETE") {
    if (isset($_GET['numero'])) {
       $stmt=$pdo->prepare("DELETE FROM labresult WHERE numero=?");
       $stmt->execute([$_GET['numero']]);
    }
    else {
        echo json_encode(["Message"=>"ID requis"]);
    }
}

?>