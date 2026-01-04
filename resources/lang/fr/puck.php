<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Puck Editor - Éditeur visuel de pages
    |--------------------------------------------------------------------------
    |
    | Traductions pour l'éditeur visuel Puck (drag-and-drop page builder)
    |
    */

    'title' => 'Éditeur Puck',
    'description' => 'Éditeur visuel pour créer des pages avec drag-and-drop',

    'toolbar' => [
        'view_page' => 'Voir la page',
        'preview' => 'Aperçu',
        'edit' => 'Éditer',
        'save' => 'Sauvegarder',
        'saving' => 'Sauvegarde...',
        'publish' => 'Publier',
        'cancel' => 'Annuler',
        'unsaved_changes' => 'Modifications non sauvegardées',
        'modifications_discarded' => 'Modifications annulées',
    ],

    'messages' => [
        'saved' => 'Page mise à jour avec succès!',
        'error' => 'Erreur lors de la sauvegarde',
        'cancelled' => 'Modifications annulées',
    ],

    'root' => [
        'title' => 'Accueil',
        'description' => '',
    ],

    'hero' => [
        'title' => 'Bienvenue sur notre serveur',
        'description' => 'Rejoignez-nous dès maintenant!',
    ],

    'features' => [
        'feature1_title' => 'Fonctionnalité 1',
        'feature1_desc' => 'Description de la première fonctionnalité',
        'feature2_title' => 'Fonctionnalité 2',
        'feature2_desc' => 'Description de la deuxième fonctionnalité',
        'feature3_title' => 'Fonctionnalité 3',
        'feature3_desc' => 'Description de la troisième fonctionnalité',
    ],

    'components' => [
        'categories' => [
            'typography' => 'Typographie',
            'interactive' => 'Interactif',
            'media' => 'Média',
            'layout' => 'Mise en page',
        ],

        'heading_block' => [
            'name' => 'Titre',
            'description' => 'Bloc de titre (H1-H6)',
            'fields' => [
                'level' => 'Niveau',
                'text' => 'Texte',
                'align' => 'Alignement',
            ],
            'align_options' => [
                'left' => 'Gauche',
                'center' => 'Centre',
                'right' => 'Droite',
            ],
            'level_options' => [
                'h1' => 'H1',
                'h2' => 'H2',
                'h3' => 'H3',
                'h4' => 'H4',
                'h5' => 'H5',
                'h6' => 'H6',
            ],
            'default_text' => 'Titre',
        ],

        'paragraph_block' => [
            'name' => 'Paragraphe',
            'description' => 'Bloc de texte',
            'fields' => [
                'text' => 'Texte',
                'align' => 'Alignement',
            ],
            'align_options' => [
                'left' => 'Gauche',
                'center' => 'Centre',
                'right' => 'Droite',
            ],
            'default_text' => 'Votre texte ici...',
        ],

        'button_block' => [
            'name' => 'Bouton',
            'description' => 'Bouton cliquable',
            'fields' => [
                'text' => 'Texte',
                'href' => 'Lien',
                'variant' => 'Style',
                'size' => 'Taille',
            ],
            'variant_options' => [
                'default' => 'Par défaut',
                'destructive' => 'Destructif',
                'outline' => 'Contour',
                'secondary' => 'Secondaire',
                'ghost' => 'Fantôme',
                'link' => 'Lien',
            ],
            'size_options' => [
                'sm' => 'Petit',
                'default' => 'Normal',
                'lg' => 'Grand',
            ],
            'default_text' => 'Cliquez ici',
            'default_href' => '#',
        ],

        'image_block' => [
            'name' => 'Image',
            'description' => 'Image avec dimensions optionnelles',
            'fields' => [
                'src' => 'URL de l\'image',
                'alt' => 'Texte alternatif',
                'width' => 'Largeur',
                'height' => 'Hauteur',
            ],
            'default_src' => '/images/placeholder.jpg',
            'default_alt' => 'Image',
        ],

        'card_block' => [
            'name' => 'Carte',
            'description' => 'Carte avec titre et description',
            'fields' => [
                'title' => 'Titre',
                'description' => 'Description',
                'image' => 'URL de l\'image',
            ],
            'default_title' => 'Titre de la carte',
            'default_description' => 'Description de la carte',
        ],

        'grid_block' => [
            'name' => 'Grille',
            'description' => 'Conteneur de grille avec colonnes',
            'fields' => [
                'columns' => 'Nombre de colonnes',
                'gap' => 'Espacement (px)',
                'items' => 'Éléments',
            ],
            'default_columns' => 3,
            'default_gap' => 16,
        ],
    ],

    'zones' => [
        'items' => 'Éléments',
        'content' => 'Contenu',
        'left_column' => 'Colonne gauche',
        'right_column' => 'Colonne droite',
    ],

    'permissions' => [
        'edit' => 'Éditer les pages avec l\'éditeur visuel Puck',
    ],

    'access_denied' => 'Vous n\'avez pas la permission d\'éditer avec Puck.',
];
