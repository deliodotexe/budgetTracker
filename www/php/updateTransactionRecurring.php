<?php
require 'db.php'; // Ensure your db connection setup is correct

$input = json_decode(file_get_contents('php://input'), true);

// Assuming you're sending an id to identify the transaction
$sql = "UPDATE repeatingtransactions SET name = :name, validFrom = :validFrom, validUntil = :validUntil, amount = :amount, transactionInterval = :transactionInterval WHERE rTransactionID = :rTransactionID";
$stmt = $pdo->prepare($sql);
$result = $stmt->execute([
    'name' => $input['name'],
    'validFrom' => $input['validFrom'],
    'validUntil' => $input['validUntil'],
    'amount' => $input['amount'],
    'transactionInterval' => $input['transactionInterval'],
    'rTransactionID' => $input['rTransactionID'] // make sure to send id from the client
]);

echo json_encode(['status' => $result ? 'success' : 'error']);
?>
