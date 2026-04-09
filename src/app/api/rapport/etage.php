 <?php 
 header('Content-Type: application/json');
 header('Access-Control-Allow-Origin: *');
 header('Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS');
 header('Access-Control-Allow-Headers: Content-Type,Authorization');
 if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
 include_once './connexion.php';
 $method = $_SERVER['REQUEST_METHOD'];
 $data   = json_decode(file_get_contents("php://input"), true);
 if ($method === 'GET') {
     $stmt = $pdo->prepare("SELECT * FROM etage ORDER BY id");
     $stmt->execute();
     echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
 }
 elseif ($method === 'POST') {
     $stmt = $pdo->prepare("INSERT INTO etage (id, nom, service) VALUES (?,?,?)");
     $stmt->execute([$data['id'] ?? 0, $data['nom'] ?? '', $data['service'] ?? '']);
     echo json_encode(["message" => "Étage ajouté", "numero" => $pdo->lastInsertId()]);
 }
 elseif ($method === 'PUT') {
     if (!isset($_GET['numero'])) { http_response_code(400); echo json_encode(["erreur" => "Numero manquant"]); exit; }
     $stmt = $pdo->prepare("UPDATE etage SET id=?, nom=?, service=? WHERE numero=?");
     $stmt->execute([$data['id'] ?? 0, $data['nom'] ?? '', $data['service'] ?? '', (int)$_GET['numero']]);
     echo json_encode(["message" => "Étage modifié"]);
 }
 elseif ($method === 'DELETE') {
     if (!isset($_GET['numero'])) { http_response_code(400); echo json_encode(["erreur" => "ID requis"]); exit; }
     $pdo->prepare("DELETE FROM salle WHERE etage=?")->execute([$data['id']]);
     $pdo->prepare("DELETE FROM etage WHERE numero=?")->execute([(int)$_GET['numero']]);
     echo json_encode(["message" => "Étage supprimé"]);
 } 
?>
