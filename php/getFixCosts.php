<?php
require 'db.php';

$sql = "SELECT * FROM repeatingtransactions WHERE Amount < 0 ORDER BY ValidFrom ASC";
$stmt = $pdo->query($sql);

$fixCosts = $stmt->fetchAll();

echo json_encode($fixCosts);
?>
