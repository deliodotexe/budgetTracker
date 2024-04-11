<?php
require 'db.php';

$sql = "SELECT * FROM repeatingtransactions ORDER BY ValidFrom ASC";
$stmt = $pdo->query($sql);

$fixCosts = $stmt->fetchAll();
header('Content-Type: application/json');
echo json_encode($fixCosts);
?>
