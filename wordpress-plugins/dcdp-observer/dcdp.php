<?php
/*
Plugin Name: D-CDP Observer
Description: Passes user login information (first name, last name, email) to D-CDP
Version: 1.0
Author: Trieu Dataism
*/

// Security check to prevent direct access to the file
if (!defined('ABSPATH')) {
    exit;
}

// Hook to enqueue the script
add_action('wp_enqueue_scripts', 'user_info_to_ga_enqueue_script');

function user_info_to_ga_enqueue_script() {
    // Check if the user is logged in
    $observer_id = get_option( 'dcdp_observer_settings' )['observer_id'];
    $observer_log_domain = get_option( 'dcdp_observer_settings' )['observer_log_domain'];

    if(!empty($observer_id)){
        if (is_user_logged_in()) {
            $current_user = wp_get_current_user();
            $user_data = array(
                'first_name' => $current_user->user_firstname,
                'last_name' => $current_user->user_lastname,
                'email' => $current_user->user_email,
                'phone' =>'',
                'observer_id' => $observer_id,
                'observer_log_domain' => $observer_log_domain
            );
    
            // Enqueue the script and localize user data
            wp_enqueue_script('dcdp-observer', plugin_dir_url(__FILE__) . 'dcdp.js', array(), null, true);
            wp_localize_script('dcdp-observer', 'dcdpProfileInfo', $user_data);
        }
        else {
            $user_data = array(
                'first_name' => '',
                'last_name' => '',
                'email' =>'',
                'phone' =>'',
                'observer_id' => $observer_id,
                'observer_log_domain' => $observer_log_domain
            );
            // Enqueue the script and localize user data
            wp_enqueue_script('dcdp-observer', plugin_dir_url(__FILE__) . 'dcdp.js', array(), null, true);
            wp_localize_script('dcdp-observer', 'dcdpProfileInfo', $user_data);
        }
    }
}

// plugin admin 

function dcdp_observer_settings_page() {
    add_options_page(
        'D-CDP Observer Settings',
        'D-CDP Observer',
        'manage_options',
        'dcdp-observer',
        'dcdp_observer_settings_callback'
    );
}
add_action( 'admin_menu', 'dcdp_observer_settings_page' );

function dcdp_observer_settings_callback() {
    ?>
    <div class="wrap">
        <h1>D-CDP Observer Settings</h1>
        <form method="post" action="options.php">
            <?php settings_fields( 'dcdp-observer-settings' ); ?>
            <?php do_settings_sections( 'dcdp-observer' ); ?>
            <table class="form-table">
                <tr valign="top">
                    <th scope="row"><label for="observer_id">Observer ID:</label></th>
                    <td><input type="text" id="observer_id" name="dcdp_observer_settings[observer_id]" value="<?php echo esc_attr( get_option( 'dcdp_observer_settings' )['observer_id'] ); ?>" /></td>
                </tr>
                <tr valign="top">
                    <th scope="row"><label for="observer_log_domain">Observer Log Domain:</label></th>
                    <td><input type="text" id="observer_log_domain" name="dcdp_observer_settings[observer_log_domain]" value="<?php echo esc_attr( get_option( 'dcdp_observer_settings' )['observer_log_domain'] ); ?>" /></td>
                </tr>
            </table>
            <?php submit_button(); ?>
        </form>
    </div>
    <?php
}

// Register Settings
add_action( 'admin_init', 'dcdp_observer_settings_init' );
function dcdp_observer_settings_init() {
    register_setting( 'dcdp-observer-settings', 'dcdp_observer_settings', 'dcdp_observer_settings_sanitize' );
}

// Sanitize Settings
function dcdp_observer_settings_sanitize( $input ) {
    $new_input = array();
    if ( isset( $input['observer_id'] ) ) {
        $new_input['observer_id'] = sanitize_text_field( $input['observer_id'] );
    }
    if ( isset( $input['observer_log_domain'] ) ) {
        $new_input['observer_log_domain'] = sanitize_text_field( $input['observer_log_domain'] );
    }
    return $new_input;
}