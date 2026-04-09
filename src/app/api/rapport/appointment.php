<?php
header('Content-Type:application/json');
header('Access-Control-Allow-Origin:*');
header('Access-Control-Allow-Methods:GET,PUT,POST,OPTIONS,DELETE');
header('Access-Control-Allow-Headers:Content-Type,Authorization');
// Ajoute temporairement en haut du fichier pour déboguer
error_log("URI: " . $_SERVER['REQUEST_URI']);
error_log("METHOD: " . $_SERVER['REQUEST_METHOD']);
error_log("GET params: " . print_r($_GET, true));
error_log("DATA: " . file_get_contents("php://input"));
include_once './connexion.php';
$method = $_SERVER['REQUEST_METHOD'];
$data   = json_decode(file_get_contents("php://input"), true);

// ── GET ───────────────────────────────────────────────────────
if ($method === 'GET') {
    if (isset($_GET['numero'])) {
        $stmt = $pdo->prepare("SELECT * FROM appointment WHERE numero=?");
        $stmt->execute([$_GET['numero']]);
        echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
    } else {
        $stmt = $pdo->prepare("SELECT * FROM appointment");
        $stmt->execute();
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }
}

// ── POST (INSERT) ─────────────────────────────────────────────
elseif ($method === 'POST') {
    $stmt = $pdo->prepare(
        "INSERT INTO appointment(id,patient,docteur,specialite,date,heure,type,status,note)
         VALUES(?,?,?,?,?,?,?,?,?)"
    );
    $stmt->execute([
        $data['id'],        $data['patient'],   $data['docteur'],
        $data['specialite'],$data['date'],      $data['heure'],
        $data['type'],      $data['status'],    $data['note']
    ]);
    echo json_encode(["message" => "Rendez-vous ajouté"]);
}

// ── PUT (UPDATE)  ?numero=5 ───────────────────────────────────
elseif ($method === 'PUT') {
    // if (!isset($_GET['numero'])) {
    //     http_response_code(400);
    //     echo json_encode(["erreur" => "Numero manquant"]);
    //     exit;
    // }
    $stmt = $pdo->prepare(
        "UPDATE appointment
         SET id=?, patient=?,docteur=?,specialite=?,date=?,heure=?,type=?,status=?,note=?
         WHERE numero=?"
    );
    $stmt->execute([
        $data['id'],$data['patient'],   $data['docteur'],   $data['specialite'],
        $data['date'],      $data['heure'],     $data['type'],
        $data['status'],    $data['note'],$data['numero'],
       
    ]);
    echo json_encode(["message" => "Rendez-vous modifié"]);
}

// ── DELETE  ?numero=5 ─────────────────────────────────────────
elseif ($method === 'DELETE') {
    if (isset($_GET['numero'])) {
        $stmt = $pdo->prepare("DELETE FROM appointment WHERE numero = ?");
        $stmt->execute([$_GET['numero']]);

        echo json_encode(["message" => "Rendez-vous supprimé"]);
    } else {
        echo json_encode(["error" => "ID requis"]);
    }
}
?>