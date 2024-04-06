<?php
require 'db.php';

$input = (array) json_decode(file_get_contents('php://input'), TRUE);

$sql = "INSERT INTO transactions (Name, Date, Amount) VALUES (:name, :date, :amount)";
$stmt = $pdo->prepare($sql);
$stmt->execute([
    'name' => $input['name'],
    'date' => $input['date'],
    'amount' => $input['amount']
]);

echo json_encode(['status' => 'success']);
?>
