<?php
require 'db.php'; // Ensure your db connection setup is correct

$input = json_decode(file_get_contents('php://input'), true);

// Assuming you're sending an id to identify the transaction
$sql = "UPDATE transactions SET name = :name, date = :date, amount = :amount WHERE transactionID = :transactionID";
$stmt = $pdo->prepare($sql);
$result = $stmt->execute([
    'name' => $input['name'],
    'date' => $input['date'],
    'amount' => $input['amount'],
    'transactionID' => $input['transactionID'] // make sure to send id from the client
]);

echo json_encode(['status' => $result ? 'success' : 'error']);
?>
