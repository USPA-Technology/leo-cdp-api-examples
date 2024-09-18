<?php

require 'php/cdp-api-init.php';

// Function to create sample data
function get_sample_data() {
    return [
        "extAttributes" => json_encode([
            "facebook-friend" => 10,
            "facebook-short-bio" => "#Dataism #LEOCDP #InGodWeTrust"
        ]),
        "socialMediaProfiles" => json_encode([
            "zalo" => "123456789",
            "facebook" => "123456789",
            "linkedin" => "123456789",
            "twitter" => "123456789",
            "github" => "123456789"
        ]),
        "incomeHistory" => json_encode([
            "2022-2023" => 2000000,
            "2023-2024" => 3000000
        ]),
        "extMetrics" => json_encode([
            'Dpoint_Loyalty_Score' => 120
        ])
    ];
}

// Function to build the profile data
function build_profile($sample_data) {
    return [
        "journeyMapIds" => "id_default_journey; ",
        "dataLabels" => "CRM; KOL person; người nổi tiếng; investors; doanh nhân đầu tư;hot girl",
        "crmRefId" => "zalo-123456789",
        "governmentIssuedIDs" => "US_123",
        "primaryAvatar" => "https://vnn-imgs-a1.vgcloud.vn/icdn.dantri.com.vn/2021/05/26/ngo-ngang-voi-ve-dep-cua-hot-girl-anh-the-chua-tron-18-docx-1622043349706.jpeg",
        "primaryEmail" => "bill.john123@example.com",
        "secondaryEmails" => "",
        "primaryPhone" => "09031222271",
        "secondaryPhones" => "(206) 709-3401; (206) 709-3402",
        "firstName" => "Anh ",
        "middleName" => "Ngoc",
        "lastName" => "Nguyen",
        "gender" => "female",
        "age" => 20,
        "livingLocation" => "Medina, Washington",
        "livingCity" => "Washington",
        "jobTitles" => "Manager",
        "workingHistory" => "Microsoft",
        "mediaChannels" => "website; facebook; linkedin; ",
        "personalInterests" => "coding; business; investment; philanthropist",
        "contentKeywords" => "history; microsoft; product manament",
        "productKeywords" => "Excel; Word; Microsoft Cloud; Vaccine; technology",
        "totalCLV" => 9000,
        "totalCAC" => 999,
        "totalTransactionValue" => 200,
        "saleAgencies" => "Agency A; Agency B; Agency C",
        "saleAgents" => "Mr.Thomas; Ms.Anna",
        "extAttributes" => $sample_data['extAttributes'],
        "incomeHistory" => $sample_data['incomeHistory'],
        "socialMediaProfiles" => $sample_data['socialMediaProfiles'],
        "totalLoyaltyScore" => 100,
        "extMetrics" => $sample_data['extMetrics'],
        "createdat" => "2020-03-09T02:27:41Z",
        "updatedat" => "2024-08-15T02:27:41Z",
        "notes" => "this is a test primaryPhone sep4",
        "updateByKey" => "primaryPhone",
        "deduplicate" => false
    ];
}


// Main process
function main() {
    $url = URL_SAVE_PROFILE;

    // Build headers and sample data
    $headers = build_cdp_api_headers();

    $sample_data = get_sample_data();

    // Build profile data
    $profile = build_profile($sample_data);

    // Convert profile to JSON
    $json_payload = json_encode($profile);

    // Send the request
    send_request($url, $json_payload, $headers);
}


// Execute the main process
main();

?>
