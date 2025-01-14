<?php
function yooker_ai_check_rest_permissions( $request ) {
    $xwpnonce = $request->get_header( 'X-WP-Nonce' );
    
    if ( !empty( $xwpnonce ) ) {
        if ( wp_verify_nonce( $xwpnonce, 'wp_rest' ) ) {
            return true;
        }
    }
    return false;
}
?>