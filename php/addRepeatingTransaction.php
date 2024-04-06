<?php
require 'db.php';

$input = (array) json_decode(file_get_contents('php://input'), TRUE);

$sql = "INSERT INTO repeatingtransactions (Name, ValidFrom, ValidUntil, Amount) VALUES (:name, :validFrom, :validUntil, :amount)";
$stmt = $pdo->prepare($sql);
$stmt->execute([
    'mame' => $input['name'],
    'validFrom' => $input['validFrom'],
    'validUntil' => $input['validUntil'],
    'amount' => $input['amount']
]);

echo json_encode(['status' => 'success']);
?>
