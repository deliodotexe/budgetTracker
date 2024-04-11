<?php
require 'db.php';

$input = (array) json_decode(file_get_contents('php://input'), TRUE);

$sql = "INSERT INTO repeatingtransactions (name, validFrom, validUntil, amount, transactionInterval) VALUES (:name, :validFrom, :validUntil, :amount, :transactionInterval)";
$stmt = $pdo->prepare($sql);
$stmt->execute([
    'name' => $input['name'],
    'validFrom' => $input['validFrom'],
    'validUntil' => $input['validUntil'],
    'amount' => $input['amount'],
    'transactionInterval' => $input['transactionInterval']
]);
header('Content-Type: application/json');
echo json_encode(['status' => 'success']);
?>
