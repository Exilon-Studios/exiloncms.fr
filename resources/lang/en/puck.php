<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Puck Editor - Visual Page Builder
    |--------------------------------------------------------------------------
    |
    | Translations for the Puck visual editor (drag-and-drop page builder)
    |
    */

    'title' => 'Puck Editor',
    'description' => 'Visual editor for creating pages with drag-and-drop',

    'toolbar' => [
        'view_page' => 'View Page',
        'preview' => 'Preview',
        'edit' => 'Edit',
        'save' => 'Save',
        'saving' => 'Saving...',
        'publish' => 'Publish',
        'cancel' => 'Cancel',
        'unsaved_changes' => 'Unsaved changes',
        'modifications_discarded' => 'Modifications discarded',
    ],

    'messages' => [
        'saved' => 'Page updated successfully!',
        'error' => 'Error saving',
        'cancelled' => 'Modifications discarded',
    ],

    'root' => [
        'title' => 'Home',
        'description' => '',
    ],

    'hero' => [
        'title' => 'Welcome to our server',
        'description' => 'Join us now!',
    ],

    'features' => [
        'feature1_title' => 'Feature 1',
        'feature1_desc' => 'Description of the first feature',
        'feature2_title' => 'Feature 2',
        'feature2_desc' => 'Description of the second feature',
        'feature3_title' => 'Feature 3',
        'feature3_desc' => 'Description of the third feature',
    ],

    'components' => [
        'categories' => [
            'typography' => 'Typography',
            'interactive' => 'Interactive',
            'media' => 'Media',
            'layout' => 'Layout',
        ],

        'heading_block' => [
            'name' => 'Heading',
            'description' => 'Heading block (H1-H6)',
            'fields' => [
                'level' => 'Level',
                'text' => 'Text',
                'align' => 'Alignment',
            ],
            'align_options' => [
                'left' => 'Left',
                'center' => 'Center',
                'right' => 'Right',
            ],
            'level_options' => [
                'h1' => 'H1',
                'h2' => 'H2',
                'h3' => 'H3',
                'h4' => 'H4',
                'h5' => 'H5',
                'h6' => 'H6',
            ],
            'default_text' => 'Heading',
        ],

        'paragraph_block' => [
            'name' => 'Paragraph',
            'description' => 'Text block',
            'fields' => [
                'text' => 'Text',
                'align' => 'Alignment',
            ],
            'align_options' => [
                'left' => 'Left',
                'center' => 'Center',
                'right' => 'Right',
            ],
            'default_text' => 'Your text here...',
        ],

        'button_block' => [
            'name' => 'Button',
            'description' => 'Clickable button',
            'fields' => [
                'text' => 'Text',
                'href' => 'Link',
                'variant' => 'Style',
                'size' => 'Size',
            ],
            'variant_options' => [
                'default' => 'Default',
                'destructive' => 'Destructive',
                'outline' => 'Outline',
                'secondary' => 'Secondary',
                'ghost' => 'Ghost',
                'link' => 'Link',
            ],
            'size_options' => [
                'sm' => 'Small',
                'default' => 'Normal',
                'lg' => 'Large',
            ],
            'default_text' => 'Click here',
            'default_href' => '#',
        ],

        'image_block' => [
            'name' => 'Image',
            'description' => 'Image with optional dimensions',
            'fields' => [
                'src' => 'Image URL',
                'alt' => 'Alt text',
                'width' => 'Width',
                'height' => 'Height',
            ],
            'default_src' => '/images/placeholder.jpg',
            'default_alt' => 'Image',
        ],

        'card_block' => [
            'name' => 'Card',
            'description' => 'Card with title and description',
            'fields' => [
                'title' => 'Title',
                'description' => 'Description',
                'image' => 'Image URL',
            ],
            'default_title' => 'Card Title',
            'default_description' => 'Card description',
        ],

        'grid_block' => [
            'name' => 'Grid',
            'description' => 'Grid container with columns',
            'fields' => [
                'columns' => 'Number of columns',
                'gap' => 'Gap (px)',
                'items' => 'Items',
            ],
            'default_columns' => 3,
            'default_gap' => 16,
        ],
    ],

    'zones' => [
        'items' => 'Items',
        'content' => 'Content',
        'left_column' => 'Left Column',
        'right_column' => 'Right Column',
    ],

    'permissions' => [
        'edit' => 'Edit pages with Puck visual editor',
    ],

    'access_denied' => 'You do not have permission to edit with Puck.',
];
