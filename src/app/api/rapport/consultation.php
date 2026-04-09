<?php
// ── CORS ──────────────────────────────────────────────
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once './connexion.php';

$data=json_decode(file_get_contents('php://input'),true);

$method=$_SERVER['REQUEST_METHOD'];
// =====================SELECTION DES consultations===============================
// GET(SELECT)
// =============================================================================
if ($method=="GET") {
    if (isset($_GET['numero'])) {
        $stmt=$pdo->prepare("SELECT * FROM consultation WHERE numero=?");
        $stmt->execute($_GET['numero']);
        $consultation=$stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($consultation);
    }
    else {
        
        $stmt=$pdo->prepare("SELECT * FROM consultation");
        $stmt->execute();
        $consultation=$stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($consultation);
   }
}
            
// =====================INSERTION DES consultations===============================
// POST(INSERT)
// =============================================================================
if ($method=="POST") {
    $stmt=$pdo->prepare("INSERT INTO consultation(id,patient,medecin,date,heure,motif,type,diagnostic,note,status)VALUES(?,?,?,?,?,?,?,?,?,?)");
    $stmt->execute([
        $data['id'],$data['patient'],
        $data['medecin'],$data['date'],
        $data['heure'],$data['motif'],
        $data['type'],$data['diagnostic'],
        $data['note'],$data['status']
        ]);
        }
        
// =====================MODIFIER DES ORDONNANCES===============================
// PUT(UPDATE)
// =============================================================================
elseif ($method=="PUT") {
    $stmt=$pdo->prepare('UPDATE consultation SET id=?,patient=?,medecin=?,date=?,heure=?,motif=?,type=?,diagnostic=?,note=? WHERE numero=?');
    $stmt->execute([
       $data['id'],$data['patient'],
        $data['medecin'],$data['date'],
        $data['heure'],$data['motif'],
        $data['type'],$data['diagnostic'],
        $data['note'],$data['numero']
        ]);
}
        
// =====================SUPPRESSION DES ORDONNANCES===============================
// DELETE
// =============================================================================
elseif ($method==="DELETE") {
    if (isset($_GET['numero'])) {
        $stmt=$pdo->prepare("DELETE FROM consultation WHERE numero=?");
        $stmt->execute([$_GET['numero']]);
    }else {
        echo json_encode(["Message"=>"ID requis"]);
    }
}


?>