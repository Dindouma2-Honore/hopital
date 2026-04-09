<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS');
header('Access-Control-Allow-Headers: Content-Type,Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

include_once './connexion.php';
$method = $_SERVER['REQUEST_METHOD'];
$data   = json_decode(file_get_contents("php://input"), true);

// ── Décode le champ medicament (JSON → tableau) dans chaque ligne
function decodeMedicament(array $row): array {
    $row['medicament'] = isset($row['medicament'])
        ? json_decode($row['medicament'], true) ?? []
        : [];
    return $row;
}

// ── GET ───────────────────────────────────────────────────────
if ($method === 'GET') {
    if (isset($_GET['numero'])) {
        $stmt = $pdo->prepare("SELECT * FROM ordonnance WHERE numero = ?");
        $stmt->execute([$_GET['numero']]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($row ? decodeMedicament($row) : null);
    } else {
        $stmt = $pdo->prepare("SELECT * FROM ordonnance ORDER BY numero DESC");
        $stmt->execute();
        $rows = array_map('decodeMedicament', $stmt->fetchAll(PDO::FETCH_ASSOC));
        echo json_encode($rows);
    }
}

// ── POST (INSERT) ─────────────────────────────────────────────
elseif ($method === 'POST') {
    $stmt = $pdo->prepare("
        INSERT INTO ordonnance (id, idConsultation, patient, prescripteur, date, validite, status, medicament, note, color)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([
        $data['id']             ?? '',
        $data['idConsultation'] ?? '',
        $data['patient']        ?? '',
        $data['prescripteur']   ?? '',
        $data['date']           ?? '',
        $data['validite']       ?? '',
        $data['status']         ?? 'Active',
        json_encode($data['medicament'] ?? []),   // tableau → JSON string
        $data['note']           ?? '',
        $data['color']          ?? '',
    ]);
    echo json_encode(["message" => "Ordonnance ajoutée", "numero" => $pdo->lastInsertId()]);
}

// ── PUT (UPDATE)  ?numero=5 ───────────────────────────────────
elseif ($method === 'PUT') {
    if (!isset($_GET['numero'])) {
        http_response_code(400);
        echo json_encode(["erreur" => "Numero manquant"]);
        exit;
    }
    $stmt = $pdo->prepare("
        UPDATE ordonnance
        SET id=?, idConsultation=?, patient=?, prescripteur=?, date=?, validite=?, status=?, medicament=?, note=?, color=?
        WHERE numero = ?
    ");
    $stmt->execute([
        $data['id']             ?? '',
        $data['idConsultation'] ?? '',
        $data['patient']        ?? '',
        $data['prescripteur']   ?? '',
        $data['date']           ?? '',
        $data['validite']       ?? '',
        $data['status']         ?? 'Active',
        json_encode($data['medicament'] ?? []),   // tableau → JSON string
        $data['note']           ?? '',
        $data['color']          ?? '',
        (int) $_GET['numero'],
    ]);
    echo json_encode(["message" => "Ordonnance modifiée"]);
}

// ── DELETE  ?numero=5 ─────────────────────────────────────────
elseif ($method === 'DELETE') {
    if (!isset($_GET['numero'])) {
        http_response_code(400);
        echo json_encode(["erreur" => "ID requis"]);
        exit;
    }
    $stmt = $pdo->prepare("DELETE FROM ordonnance WHERE numero = ?");
    $stmt->execute([(int) $_GET['numero']]);
    echo json_encode(["message" => "Ordonnance supprimée"]);
}
?>