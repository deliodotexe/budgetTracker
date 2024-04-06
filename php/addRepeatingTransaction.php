<?php
require 'db.php';

$input = (array) json_decode(file_get_contents('php://input'), TRUE);

$sql = "INSERT INTO repeatingtransactions (Name, ValidFrom, ValidUntil, Amount, transactionInterval) VALUES (:name, :validFrom, :validUntil, :amount, :interval)";
$stmt = $pdo->prepare($sql);
$stmt->execute([
    'mame' => $input['name'],
    'validFrom' => $input['validFrom'],
    'validUntil' => $input['validUntil'],
    'amount' => $input['amount'],
    'interval' => $input['interval']
]);

echo json_encode(['status' => 'success']);
?>
