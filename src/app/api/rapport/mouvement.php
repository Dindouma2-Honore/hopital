<?php
// api/mouvementstock.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once './connexion.php'; 

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

    // ══════════════════════════════════════
    // GET — Liste tous les mouvements
    // ══════════════════════════════════════
    case 'GET':
        try {
            // Filtre optionnel par medicineId
            if (isset($_GET['medicineId'])) {
                $stmt = $pdo->prepare("
                    SELECT * FROM mouvementstock
                    WHERE medicineId = ?
                    ORDER BY date DESC
                ");
                $stmt->execute([$_GET['medicineId']]);
            } else {
                $stmt = $pdo->query("SELECT * FROM mouvementstock ORDER BY date DESC");
            }
            $mouvements = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Caster les types numériques
            foreach ($mouvements as &$mv) {
                $mv['numero']  = (int)$mv['numero'];
                $mv['quantite'] = (int)$mv['quantite'];
            }
            echo json_encode($mouvements);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    // ══════════════════════════════════════
    // POST — Créer un mouvement
    // ══════════════════════════════════════
case 'POST':
    $data = json_decode(file_get_contents('php://input'), true);

    if (empty($data['medicineId']) || empty($data['type']) || !isset($data['quantite'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Champs obligatoires manquants']);
        exit();
    }

    try {
        $pdo->beginTransaction();
        $date = $data['date'] ?? date('Y-m-d H:i:s');

        // ✅ WHERE reference (pas numero)
        if ($data['type'] === 'Sortie') {
            $check = $pdo->prepare("SELECT stock FROM produit WHERE reference = ?");
            $check->execute([$data['medicineId']]);
            $currentStock = $check->fetchColumn();

            if ($currentStock === false || $currentStock < $data['quantite']) {
                $pdo->rollBack();
                http_response_code(400);
                echo json_encode(['error' => 'Stock insuffisant']);
                exit();
            }
        }

        $stmt = $pdo->prepare("
            INSERT INTO mouvementstock (medicineId, produit, type, quantite, date, motif, responsable)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $data['medicineId'], $data['produit'], $data['type'],
            (int)$data['quantite'], $date,
            $data['motif'] ?? '', $data['responsable'] ?? '',
        ]);

        
        if ($data['type'] === 'Entrée') {
            $update = $pdo->prepare("UPDATE produit SET stock = stock + ? WHERE reference = ?");
        } else {
            $update = $pdo->prepare("UPDATE produit SET stock = stock - ? WHERE reference = ?");
        }
        $update->execute([(int)$data['quantite'], $data['medicineId']]);

        $pdo->commit();
        http_response_code(201);
        echo json_encode(['message' => 'Mouvement enregistré']);

    } catch (PDOException $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
    break;
        $data = json_decode(file_get_contents('php://input'), true);

        if (
            empty($data['medicineId']) ||
            empty($data['produit']) ||
            empty($data['type']) ||
            !isset($data['quantite']) ||
            empty($data['motif']) ||
            empty($data['responsable'])
        ) {
            http_response_code(400);
            echo json_encode(['error' => 'Champs obligatoires manquants']);
            exit();
        }

        try {
            $date = $data['date'] ?? date('d/m/y H:i');

            $stmt = $pdo->prepare("
                INSERT INTO mouvementstock
                    (medicineId, produit, type, quantite, date, motif, responsable)
                VALUES
                    (?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $data['medicineId'],
                $data['produit'],
                $data['type'],
                (int)$data['quantite'],
                $date,
                $data['motif'],
                $data['responsable'],
            ]);

            $newId = $pdo->lastInsertId();
            http_response_code(201);
            echo json_encode(['message' => 'Mouvement enregistré', 'numero' => (int)$newId]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    // ══════════════════════════════════════
    // PUT — Modifier un mouvement
    // ══════════════════════════════════════
   case 'PUT':
    $numero = $_GET['numero'] ?? null;
    if (!$numero) {
        http_response_code(400);
        echo json_encode(['error' => 'Paramètre numero manquant']);
        exit();
    }

    $data = json_decode(file_get_contents('php://input'), true);

    try {
        $pdo->beginTransaction();

        // 1. récupérer ancien mouvement
        $old = $pdo->prepare("SELECT * FROM mouvementstock WHERE numero = ?");
        $old->execute([$numero]);
        $oldMv = $old->fetch(PDO::FETCH_ASSOC);

        if (!$oldMv) {
            throw new Exception("Mouvement introuvable");
        }

        // 2. ANNULER ancien stock
        if ($oldMv['type'] === 'Entrée') {
            $pdo->prepare("UPDATE produit SET stock = stock - ? WHERE reference = ?")
                ->execute([$oldMv['quantite'], $oldMv['reference']]);
        } else {
            $pdo->prepare("UPDATE produit SET stock = stock + ? WHERE reference = ?")
                ->execute([$oldMv['quantite'], $oldMv['reference']]);
        }

        // 3. APPLIQUER nouveau
        if ($data['type'] === 'Entrée') {
            $pdo->prepare("UPDATE produit SET stock = stock + ? WHERE reference = ?")
                ->execute([$data['quantite'], $data['reference']]);
        } else {
            $pdo->prepare("UPDATE produit SET stock = stock - ? WHERE reference = ?")
                ->execute([$data['quantite'], $data['reference']]);
        }

        // 4. UPDATE mouvement
        $stmt = $pdo->prepare("
            UPDATE mouvementstock
            SET medicineId=?, produit=?, type=?, quantite=?, date=?, motif=?, responsable=?
            WHERE numero=?
        ");
        $stmt->execute([
            $data['medicineId'],
            $data['produit'],
            $data['type'],
            $data['quantite'],
            $data['date'],
            $data['motif'],
            $data['responsable'],
            $numero
        ]);

        $pdo->commit();

        echo json_encode(['message' => 'Mouvement mis à jour']);

    } catch (Exception $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
    break;
        $numero = $_GET['numero'] ?? null;
        if (!$numero) {
            http_response_code(400);
            echo json_encode(['error' => 'Paramètre numero manquant']);
            exit();
        }

        $data = json_decode(file_get_contents('php://input'), true);

        try {
            $stmt = $pdo->prepare("
                UPDATE mouvementstock
                SET
                    medicineId   = ?,
                    produit = ?,
                    type         = ?,
                    quantite     = ?,
                    date         = ?,
                    motif        = ?,
                    responsable  = ?
                WHERE numero = ?
            ");
            $stmt->execute([
                $data['medicineId'],
                $data['produit'],
                $data['type'],
                (int)$data['quantite'],
                $data['date'],
                $data['motif'],
                $data['responsable'],
                (int)$numero,
            ]);

            echo json_encode(['message' => 'Mouvement mis à jour']);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    // ══════════════════════════════════════
    // DELETE — Supprimer un mouvement
    // ══════════════════════════════════════
   case 'DELETE':
        $numero = $_GET['numero'] ?? null;
        if (!$numero) {
            http_response_code(400);
            echo json_encode(['error' => 'Paramètre numero manquant']);
            exit();
        }

        try {
            $stmt = $pdo->prepare("DELETE FROM mouvementstock WHERE numero = ?");
            $stmt->execute([(int)$numero]);
            echo json_encode(['message' => 'Mouvement supprimé']);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Méthode non autorisée']);
        break;
}