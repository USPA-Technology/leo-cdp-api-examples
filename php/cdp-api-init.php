<?php

require 'vendor/autoload.php';
use Dotenv\Dotenv;

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__, 'phpdev.env');
$dotenv->load();

$cdp_host = $_ENV['cdp_host'];
echo " \n [CDP Host: $cdp_host ] \n\n "; 

define("CDP_HOST", $cdp_host );
define("URL_SAVE_EVENT", "https://" . $cdp_host . "/api/event/save");
define("URL_SAVE_PROFILE", "https://" . $cdp_host . "/api/profile/save");


// Function to build headers
function build_cdp_api_headers() {
    return [
        "Content-Type: application/json",
        "Access-Control-Allow-Origin: *",
        "tokenkey: " . $_ENV['tokenkey'],
        "tokenvalue: " . $_ENV['tokenvalue']
    ];
}

// Function to send the request
function send_request($url, $json_payload, $headers) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $json_payload);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // To capture response

    $response = curl_exec($ch);
    
    if (curl_errno($ch)) {
        echo 'Error: ' . curl_error($ch) . " \n ";
    } else {
        echo "Response: " . $response . " \n ";
    }
    
    curl_close($ch);
}

?>