<?php
$host = 'localhost';
$user = 'root'; // XAMPP default
$pass = '';     // XAMPP default je prazna lozinka
$dbname = 'tictactoe';

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die("Konekcija nije uspjela: " . $conn->connect_error);
}
?>