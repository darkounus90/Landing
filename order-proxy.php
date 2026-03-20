<?php
/**
 * Dropi Order Proxy
 * Soluciona problemas de CORS y protege el Token de la API.
 */

// 1. Configuración
$dropiToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcHAuZHJvcGkuY286ODAiLCJpYXQiOjE3NzQwMjc2NTcsImV4cCI6NDkyOTcwMTI1NywibmJmIjoxNzc0MDI3NjU3LCJqdGkiOiJQN0ZZS2VKb0tXWTk1V09FIiwic3ViIjo3MDAyNTksInBydiI6Ijg3ZTBhZjFlZjlmZDE1ODEyZmRlYzk3MTUzYTE0ZTBiMDQ3NTQ2YWEiLCJhdWQiOiJXT09DT01FUkNFIiwidG9rZW5fdHlwZSI6IklOVEVHUkFUSU9OUyIsIndiX2lkIjoxLCJpbnRlZ3JhdGlvbl90eXBlIjoiV09PQ09NRVJDRSIsImludGVncmF0aW9uX3R5cGVfaWQiOjEsImlwX3VybCI6W10sImludGVncmF0aW9uX3VybCI6Imh0dHBzOlwvXC92aWRhc2FuYXMub25saW5lIn0.7gF1fPI-rY4TGjkJbrT8KTdbZ4Bp4FJG2rv_qH6TPJc';
$apiUrl     = 'https://api.dropi.co/api/integrations/woocomerce/orders';

// 2. Obtener datos del POST (JSON)
$inputJSON = file_get_contents('php://input');

// 3. Configurar CURL
$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_POSTFIELDS, $inputJSON);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $dropiToken
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);

// 4. Ejecutar y obtener respuesta
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// 5. Devolver respuesta al navegador
header('Content-Type: application/json');
http_response_code($httpCode);
echo $response;
?>
