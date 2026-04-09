<?php
// C:\xampp\htdocs\rapport\commande.php

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
    // GET — Liste toutes les commandes
    // ══════════════════════════════════════
    case 'GET':
        try {
            $stmt = $pdo->query("SELECT * FROM commande ORDER BY numero DESC");
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            foreach ($rows as &$r) {
                $r['numero']  = (int)$r['numero'];
                $r['montant'] = (float)$r['montant'];
            }
            echo json_encode($rows);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    // ══════════════════════════════════════
    // POST — Créer une commande
    // ══════════════════════════════════════
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);

        if (
            empty($data['fournisseur']) ||
            empty($data['medicaments']) ||
            empty($data['dateCommande']) ||
            empty($data['dateLivraison'])
        ) {
            http_response_code(400);
            echo json_encode(['error' => 'Champs obligatoires manquants']);
            exit();
        }

        try {
            // Génère un numéro de commande automatique
            $stmt  = $pdo->query("SELECT MAX(numero) as max FROM commande");
            $row   = $stmt->fetch(PDO::FETCH_ASSOC);
            $next  = ($row['max'] ?? 0) + 1;
            $numCmd = 'CMD-' . str_pad($next + 4474, 4, '0', STR_PAD_LEFT);

            $stmt = $pdo->prepare("
                INSERT INTO commande
                    (numCommande, fournisseur, medicaments, dateCommande, dateLivraison, montant, statut)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $numCmd,
                $data['fournisseur'],
                $data['medicaments'],
                $data['dateCommande'],
                $data['dateLivraison'],
                (float)($data['montant'] ?? 0),
                $data['statut'] ?? 'En attente',
            ]);

            http_response_code(201);
            echo json_encode([
                'message'    => 'Commande créée',
                'numero'     => (int)$pdo->lastInsertId(),
                'numCommande' => $numCmd
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    // ══════════════════════════════════════
    // PUT — Modifier une commande
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
            $stmt = $pdo->prepare("
                UPDATE commande SET
                    fournisseur   = ?,
                    medicaments   = ?,
                    dateCommande  = ?,
                    dateLivraison = ?,
                    montant       = ?,
                    statut        = ?
                WHERE numero = ?
            ");
            $stmt->execute([
                $data['fournisseur'],
                $data['medicaments'],
                $data['dateCommande'],
                $data['dateLivraison'],
                (float)($data['montant'] ?? 0),
                $data['statut'],
                (int)$numero,
            ]);
            echo json_encode(['message' => 'Commande mise à jour']);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    // ══════════════════════════════════════
    // DELETE — Supprimer une commande
    // ══════════════════════════════════════
    case 'DELETE':
        $numero = $_GET['numero'] ?? null;
        if (!$numero) {
            http_response_code(400);
            echo json_encode(['error' => 'Paramètre numero manquant']);
            exit();
        }

        try {
            $stmt = $pdo->prepare("DELETE FROM commande WHERE numero = ?");
            $stmt->execute([(int)$numero]);
            echo json_encode(['message' => 'Commande supprimée']);
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
