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
        $stmt=$pdo->prepare("SELECT * FROM departement WHERE numero=?");
        $stmt->execute($_GET['numero']);
        $departement=$stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($departement);
    }
    else {
        $stmt=$pdo->prepare("SELECT * FROM departement");
        $stmt->execute();
        $departement=$stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($departement);
            
   }
}
// =======================INSERTION===============
// POST(INSERT)
// ==============================================
elseif ($method==="POST") {
    $stmt=$pdo->prepare("INSERT INTO departement(id,nom,icon,nombreStaff,nombreLit,occupation ) VALUES(?,?,?,?,?,?)");
    $stmt->execute([
        $data['id'],
        $data['nom'],
        $data['icon'],
        $data['nombreStaff'],
        $data['nombreLit'],
        $data['occupation']
        ]);
        }
// =======================MODIFICATION===============
// PUT(UPDATE)
// ==============================================
elseif ($method=="PUT") {
    $stmt=$pdo->prepare("UPDATE departement SET id=?,nom=?,icon=?,nombreStaff=?,nombreLit=?,occupation=? WHERE numero=?");
    $stmt->execute([
        $data['id'],
        $data['nom'],
        $data['icon'],
        $data['nombreStaff'],
        $data['nombreLit'],
        $data['occupation'],
        $data['numero']
        ]);
}
        
// =======================SUPPRESSION===============
// DELETE
// ==============================================
elseif ($method=="DELETE") {
    if (isset($_GET['numero'])) {
       $stmt=$pdo->prepare("DELETE FROM departement WHERE numero=?");
       $stmt->execute([$_GET['numero']]);
    }
    else {
        echo json_encode(["Message"=>"ID requis"]);
    }
}

?>