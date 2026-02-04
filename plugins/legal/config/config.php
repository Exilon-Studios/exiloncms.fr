<?php

return [
    'privacy_enabled' => [
        'type' => 'boolean',
        'label' => 'Privacy Policy Page',
        'description' => 'Enable the privacy policy page',
        'default' => true,
    ],

    'terms_enabled' => [
        'type' => 'boolean',
        'label' => 'Terms of Service Page',
        'description' => 'Enable the terms of service page',
        'default' => true,
    ],

    'cookie_policy_enabled' => [
        'type' => 'boolean',
        'label' => 'Cookie Policy Page',
        'description' => 'Enable the cookie policy page',
        'default' => true,
    ],

    'refund_policy_enabled' => [
        'type' => 'boolean',
        'label' => 'Refund Policy Page',
        'description' => 'Enable the refund policy page',
        'default' => false,
    ],

    'show_cookie_banner' => [
        'type' => 'boolean',
        'label' => 'Show Cookie Consent Banner',
        'description' => 'Display a cookie consent banner to users',
        'default' => true,
    ],

    'company_name' => [
        'type' => 'text',
        'label' => 'Company Name',
        'description' => 'Your company or organization name',
        'default' => '',
    ],

    'contact_email' => [
        'type' => 'text',
        'label' => 'Contact Email',
        'description' => 'Email address for legal inquiries',
        'default' => '',
    ],
];
