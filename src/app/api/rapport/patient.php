<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

// Connexion DB
include_once './connexion.php';

// Récupération de la méthode HTTP
$method = $_SERVER['REQUEST_METHOD'];

// Récupérer les données JSON
$data = json_decode(file_get_contents("php://input"), true);

// =======================
// GET (SELECT)
// =======================
if ($method === "GET") {
    if (isset($_GET['id'])) {
        $stmt = $pdo->prepare("SELECT * FROM patient WHERE id = ?");
        $stmt->execute([$_GET['id']]);
        $patient = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($patient);
    } else {
        $stmt = $pdo->prepare("SELECT * FROM patient");
        $stmt->execute();
        $patients = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($patients);
    }
}

// =======================
// POST (INSERT)
// =======================
elseif ($method === "POST") {
    $sql = "INSERT INTO patient 
    (matricule, nom, prenom, age, sexe, bloodGroup, departement, docteur, status, admissionDate, phone, allergie, `condition`, salle, photo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        $data['matricule'],
        $data['nom'],
        $data['prenom'],
        $data['age'],
        $data['sexe'],
        $data['bloodGroup'],
        $data['departement'],
        $data['docteur'],
        $data['status'],
        $data['admissionDate'],
        $data['phone'],
        $data['allergie'],
        $data['condition'],
        $data['salle'],
        $data['photo']
    ]);

    echo json_encode(["message" => "Patient ajouté"]);
}

// =======================
// PUT (UPDATE)
// =======================
elseif ($method === "PUT") {
    $sql = "UPDATE patient SET 
        matricule=?, nom=?, prenom=?, age=?, sexe=?, bloodGroup=?, departement=?, docteur=?, status=?, admissionDate=?, phone=?, allergie=?, `condition`=?, salle=?, photo=?
        WHERE id=?";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        $data['matricule'],
        $data['nom'],
        $data['prenom'],
        $data['age'],
        $data['sexe'],
        $data['bloodGroup'],
        $data['departement'],
        $data['docteur'],
        $data['status'],
        $data['admissionDate'],
        $data['phone'],
        $data['allergie'],
        $data['condition'],
        $data['salle'],
        $data['photo'],
        $data['id']
    ]);

    echo json_encode(["message" => "Patient modifié"]);
}

// =======================
// DELETE
// =======================
elseif ($method === "DELETE") {
    if (isset($_GET['id'])) {
        $stmt = $pdo->prepare("DELETE FROM patient WHERE id = ?");
        $stmt->execute([$_GET['id']]);

        echo json_encode(["message" => "Patient supprimé"]);
    } else {
        echo json_encode(["error" => "ID requis"]);
    }
}
?>