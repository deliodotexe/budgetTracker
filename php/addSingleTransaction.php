<?php
require 'db.php';

$input = (array) json_decode(file_get_contents('php://input'), TRUE);

$sql = "INSERT INTO transactions (Name, Date, Amount) VALUES (:Name, :Date, :Amount)";
$stmt = $pdo->prepare($sql);
$stmt->execute([
    'Name' => $input['Name'],
    'Date' => $input['Date'],
    'Amount' => $input['Amount']
]);

echo json_encode(['status' => 'success']);
?>
