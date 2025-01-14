<?php
function hasSubscription($subscriptionId) {
    $url = "https://ai.yookerdesign.nl/wp-json/yooker-ai-admin/v1/active-subscriptions/";
    $username = get_option('yookeraiusername'); 
    $apiKey = get_option('yookeraiapikey'); 

    if (!$username || !$apiKey) {
        return false; 
    }

    $response = wp_remote_get(
        $url,
        [
            'headers' => [
                'Authorization' => 'Basic ' . base64_encode($username . ':' . $apiKey),
            ],
        ]
    );

    if (is_wp_error($response)) {
        error_log('Error in hasSubscription: ' . $response->get_error_message());
        return false;
    }

    $body = wp_remote_retrieve_body($response);
    $data = json_decode($body);

    if (isset($data->data->subscriptions) && !empty($data->data->subscriptions)) {
        if (in_array($subscriptionId, $data->data->subscriptions)) {
            return true;
        }
    }

    return false;
}
?>