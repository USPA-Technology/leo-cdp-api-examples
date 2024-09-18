<?php

require 'php/cdp-api-init.php';


// Main process
function main() {
    $eventdata = array(
        "notes" => " test từ PHP API client"
    );
    
    $tracking_event = array(
        "eventtime" => "2024-09-18T16:53:46Z",  // Direct example value
        "firstName" => "Thomas",
        "lastName" => "Nguyen",
        "targetUpdateEmail" => "thomas@dataism.one",  // email
        "tpname" => "USPA OA Tech Framework",  // Direct example value
        "tpurl" => "https://zalo.me/4437986022617103680",
        "tprefurl" => "https://bigdatavietnam.org",
        "imageUrls" => "",
        "metric" => "chat-for-support",  // Direct example value
        "jsonData" => $eventdata,
        "message" => "USPA có thể tạo ra giá trị cho con người ?"
    );
    
    $url = URL_SAVE_EVENT;
    
    // Build headers and sample data
    $headers = build_cdp_api_headers();

    // Convert profile to JSON
    $json_payload = json_encode($tracking_event);

    // Send the request
    send_request($url, $json_payload, $headers);
}


// Execute the main process
main();

?>
