<?php
include 'db.php';

// Čitanje JSON podataka poslanih iz JavaScripta
$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['winner'])) {
    $winner = $conn->real_escape_string($data['winner']);
    
    // Ako igrač postoji, dodaj mu pobjedu. Ako ne, kreiraj ga s 1 pobjedom.
    $sql = "INSERT INTO players (username, wins) VALUES ('$winner', 1) 
            ON DUPLICATE KEY UPDATE wins = wins + 1";
            
    if ($conn->query($sql) === TRUE) {
        echo json_encode(["status" => "success", "message" => "Pobjeda zabilježena!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Greška: " . $conn->error]);
    }
}
$conn->close();
?>