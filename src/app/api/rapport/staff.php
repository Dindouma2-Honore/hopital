<?php
header('Content-Type:application/json');
header('Access-Control-Allow-Origin:*');
header('Access-Control-Allow-Methods:GET,PUT,POST,DELETE');
header('Access-Control-Allow-Headers:Content-Type,Authorization');

include_once './connexion.php';

$data = json_decode(file_get_contents('php://input'), true);
$method = $_SERVER['REQUEST_METHOD'];
// // =======================
// // 🔥 GENERATION MATRICULE
// // =======================
// $prefix = strtoupper(substr($specialite, 0, 2));

// $result = $pdo->prepare("SELECT COUNT(*) as total FROM docteur WHERE specialite='$specialite'");
// $row = $result->fetch_assoc();
// $count = $row['total'] + 1;

// $numero = str_pad($count, 3, '0', STR_PAD_LEFT);
// $matricule = $prefix . $year . $numero;

// // =======================
// // 📧 GENERATION EMAIL
// // =======================
// $email = strtolower($prenom . $nom . '@hopital.com');
// $email = str_replace(' ', '', $email);

// // Vérifier doublon email
// $i = 1;
// $baseEmail = $email;

// while (true) {
//     $check = $conn->query("SELECT id FROM staff WHERE email='$email'");
//     if ($check->num_rows == 0) break;

//     $email = str_replace('@', $i . '@', $baseEmail);
//     $i++;
// }
// ===================SELECTION==============
// GET(SELECT)
// ========================================
if ($method == 'GET') {
    if (isset($_GET['id'])) {
        $stmt = $pdo->prepare('SELECT * FROM docteur WHERE id=?');
        $stmt->execute($_GET['id']);
        $staff = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($staff);
    } else {
        $stmt = $pdo->prepare('SELECT * FROM docteur');
        $stmt->execute();
        $staff = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($staff);
    }
}
// ====================INSERTION=========
// POST(INSERT)
// ======================================
elseif ($method === 'POST') {
    $stmt = $pdo->prepare('INSERT INTO docteur(matricule,nom,prenom,specialite,status,experience,email,phone) VALUES(?,?,?,?,?,?,?,?)');
    $stmt->execute([
        $data['matricule'], $data['nom'], $data['prenom'], $data['specialite'],
        $data['status'], $data['experience'], $data['email'], $data['phone']
    ]);
}
// ====================MISE A JOUR=========
// PUT(UPDATE)
// ======================================
elseif ($method ==='PUT') {
    $stmt = $pdo->prepare('UPDATE docteur SET 
   matricule=?,nom=?,prenom=?,specialite=?,status=?,experience=?,email=?,phone=?,photo=?
   WHERE id=?' );
    $stmt->execute([
        $data['matricule'], $data['nom'], $data['prenom'], $data['specialite'],
        $data['status'],$data['experience'], $data['email'], $data['phone'], $data['photo'],$data['id']
    ]);
}
// ====================SUPPRESSION=========
// DELETE
// ======================================
elseif ($method === 'DELETE') {
    if (isset($_GET['id'])) {
        $stmt = $pdo->prepare('DELETE FROM docteur WHERE id=?');
        $stmt->execute([$_GET['id']]);
    } else {
        echo json_encode(['ERREUR' => 'ID non trouvé']);
    }
}
?>