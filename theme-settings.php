<?php

/**
 * @file
 * Custom theme setting form elements for the USWDS Base theme.
 */

use Drupal\Core\Form\FormStateInterface;

/**
 * Implements hook_form_system_theme_settings_alter().
 */
function cecc_base_form_system_theme_settings_alter(&$form, FormStateInterface &$form_state, $form_id = NULL) {


  // Menu behavior.
  $saved_bypass = theme_get_setting('uswds_menu_bypass');
  if (empty($saved_bypass)) {
    $saved_bypass = [];
  }

  $form['cecc_base_fieldset'] = [
    '#type' => 'details',
    '#title' => t('CECC Base Configuration'),
    '#open' => TRUE,
    'cecc_gtm_id' => [
      '#type' => 'textfield',
      '#title' => t('Adds the GTM ID'),
      '#default_value' => theme_get_setting('cecc_gtm_id'),
    ],
  ];
}
