<?php
require 'db.php'; // Adjust the path as needed

$sql = "SELECT * FROM transactions ORDER BY Date ASC";
$stmt = $pdo->query($sql);

$purchases = $stmt->fetchAll();

echo json_encode($purchases);
?>
