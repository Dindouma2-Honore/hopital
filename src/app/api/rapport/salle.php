<?php
/* ============================================================
   room.php — CRUD Chambres
   ============================================================ */
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS');
header('Access-Control-Allow-Headers: Content-Type,Authorization');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

include_once './connexion.php';
$method = $_SERVER['REQUEST_METHOD'];
$data   = json_decode(file_get_contents("php://input"), true);

if ($method === 'GET') {
    $stmt = $pdo->prepare("SELECT * FROM salle ORDER BY etage, id");
    $stmt->execute();
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}
elseif ($method === 'POST') {
    $stmt = $pdo->prepare("INSERT INTO salle (id, etage, status, patient) VALUES (?,?,?,?)");
    $stmt->execute([
        $data['id']      ?? '',
        $data['etage']   ?? 0,
        $data['status']  ?? 'free',
        $data['patient'] ?? '',
    ]);
    echo json_encode(["message" => "Chambre ajoutée", "numero" => $pdo->lastInsertId()]);
}
elseif ($method === 'PUT') {
    if (!isset($_GET['numero'])) { http_response_code(400); echo json_encode(["erreur" => "Numero manquant"]); exit; }
    $stmt = $pdo->prepare("UPDATE salle SET id=?, etage=?, status=?, patient=? WHERE numero=?");
    $stmt->execute([
        $data['id']      ?? '',
        $data['etage']   ?? 0,
        $data['status']  ?? 'free',
        $data['patient'] ?? '',
        (int)$_GET['numero'],
    ]);
    echo json_encode(["message" => "Chambre modifiée"]);
}
elseif ($method === 'DELETE') {
    if (!isset($_GET['numero'])) { http_response_code(400); echo json_encode(["erreur" => "ID requis"]); exit; }
    $stmt = $pdo->prepare("DELETE FROM room WHERE numero=?");
    $stmt->execute([(int)$_GET['numero']]);
    echo json_encode(["message" => "Chambre supprimée"]);
}

?>
