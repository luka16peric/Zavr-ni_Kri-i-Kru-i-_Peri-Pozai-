<?php
include 'db.php';

$sql = "SELECT username, wins FROM players ORDER BY wins DESC LIMIT 5";
$result = $conn->query($sql);

$leaderboard = [];
while ($row = $result->fetch_assoc()) {
    $leaderboard[] = $row;
}

echo json_encode($leaderboard);
$conn->close();
?>