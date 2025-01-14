<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

function yookerai_notice() {
    global $message;
    global $messagestyle;
    printf( '<div class="%1$s"><p>%2$s</p></div>', esc_attr( $messagestyle ), esc_html( $message ) );
}

function yookerai_site_transient_update_plugins($transient) {
    // Check if update data is cached
    $cached_update_data = get_transient('yookerai_update_data');
    if ($cached_update_data !== false) {
        return $cached_update_data;
    }

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, esc_html( yookerai_plugindata['PluginURI'] ));
    curl_setopt($ch, CURLOPT_USERAGENT,'Awesome-Octocat-App');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Accept: application/json', 'Content-Type: application/json'));
    $fetch = curl_exec($ch);
    curl_close($ch);
    $jsondata = json_decode($fetch, true);

    if (isset($jsondata['message'])) {
        error_log('Conflict detected: ' . $jsondata['message']);
        return $transient;
    } elseif (isset($jsondata['version'])) {
        if (version_compare($jsondata['version'], esc_html(yookerai_plugindata['Version']), '>')) {
            $item = new stdClass();
            $item->slug = yookerai_slug;
            $item->plugin = yookerai_basename;
            $item->requires = $jsondata['requires'];
            $item->new_version = $jsondata['version'];
            $item->requires_php = $jsondata['requires_php'];
            $item->tested = $jsondata['tested'];
            $item->package = $jsondata['download_url'];
            if ($transient) {
                $transient->response[yookerai_basename] = $item;
            }
        }
    }

    // Cache the update data for 1 hours
    set_transient('yookerai_update_data', $transient, 1 * HOUR_IN_SECONDS);

    return $transient;
}

add_filter('site_transient_update_plugins', 'yookerai_site_transient_update_plugins');
?>