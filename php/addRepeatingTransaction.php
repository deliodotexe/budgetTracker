<?php
require 'db.php';

$input = (array) json_decode(file_get_contents('php://input'), TRUE);

$sql = "INSERT INTO repeatingtransactions (Name, ValidFrom, ValidUntil, Amount) VALUES (:Name, :ValidFrom, :ValidUntil, :Amount)";
$stmt = $pdo->prepare($sql);
$stmt->execute([
    'Name' => $input['Name'],
    'ValidFrom' => $input['ValidFrom'],
    'ValidUntil' => $input['ValidUntil'],
    'Amount' => $input['Amount']
]);

echo json_encode(['status' => 'success']);
?>
