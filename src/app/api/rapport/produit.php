<?php

header('Content-Type:application/json');
header('Access-Control-Allow-Origin:*');
header('Access-Control-Allow-Methods:GET,POST,PUT,DELETE');
header('Access-Control-Allow-Headers:Content-Type,Authorization');

include_once './connexion.php';
$data=json_decode(file_get_contents('php://input'),true);
$method=$_SERVER['REQUEST_METHOD'];

// =======================SELECTION ==============================
// =====================================================

if ($method=="GET") {
    if (isset($_GET['numero'])) {
        $stmt=$pdo->prepare("SELECT * FROM produit WHERE numero=?");
        $stmt->execute($_GET['numero']);
        $produit=$stmt->fetch(PDO::FETCH_ASSOC);
         echo json_encode($produit);
    } 
    else {
        $stmt=$pdo->prepare("SELECT * FROM produit ");
        $stmt->execute();
        $produit=$stmt->fetchAll(PDO::FETCH_ASSOC);
         echo json_encode($produit);
        }
        
    }
        
// =======================INSERTION ==============================
// =====================================================

elseif ($method === 'POST') {
    if (empty($data['nom']) || empty($data['generique'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Nom et générique obligatoires']);
        exit();
    }

    try {
        // 1. INSERT SANS reference
        $stmt = $pdo->prepare("
            INSERT INTO produit (nom, generique, categorie, stock, minStock, unite, isOk)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $data['nom'],
            $data['generique'],
            $data['categorie'] ?? '',
            (int)($data['stock'] ?? 0),
            (int)($data['minStock'] ?? 0),
            $data['unite'] ?? 'boîtes',
            (int)($data['isOk'] ?? 1),
        ]);

        // 2. Récupérer ID
        $newNumero = (int)$pdo->lastInsertId();

        // 3. Générer le préfixe (3 lettres)
        $nom = $data['nom'];
        $prefix = strtoupper(substr(
            str_replace(
                ['é','è','ê','ë','à','â','ç','ô','ù','û'],
                ['e','e','e','e','a','a','c','o','u','u'],
                $nom
            ),
            0,
            3
        ));

        // 4. Construire référence
        $reference = $prefix . '-' . $newNumero;

        // 5. UPDATE avec référence
        $update = $pdo->prepare("UPDATE produit SET reference = ? WHERE numero = ?");
        $update->execute([$reference, $newNumero]);

        http_response_code(201);
        echo json_encode([
            'message'   => 'Produit ajouté',
            'numero'    => $newNumero,
            'reference' => $reference
        ]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}
// =======================MODIFICATION ==============================
// =====================================================
elseif ($method==="PUT") {
    $stmt=$pdo->prepare("UPDATE produit SET reference=?,nom=?,generique=?,stock=?,minStock=?,unite=?,categorie=? WHERE numero=?");
    $stmt->execute([
       $data['reference'],$data['nom'],$data['generique'],$data['stock'],$data['minStock'],$data['unite'],$data['categorie'],$data['reference'],$data['nom'],$data['generique'],$data['stock'],$data['minStock'],$data['unite'],$data['numero']
        ]);
}
// =======================Supprimer ==============================
// =====================================================

elseif ($method==="DELETE") {
    if (isset($_GET['numero'])) {
       $stmt=$pdo->prepare("DELETE FROM produit WHERE numero=?");
       $stmt->execute([$_GET['numero']]);
    } else {
        echo json_encode(["Message"=>"ID requis"]);
    }
    
}



















?>