<?php

return array (
      'title' => 'Éditeur Puck',
      'description' => 'Éditeur visuel pour créer des pages avec drag-and-drop',
      'toolbar' => array (
        'cancel' => 'Annuler',
      ),
      'root' => array (
        'title' => 'Accueil',
        'description' => '',
      ),
      'hero' => array (
        'title' => 'Bienvenue sur notre serveur',
        'description' => 'Rejoignez-nous dès maintenant!',
      ),
      'components' => array (
        'heading_block' => array (
          'name' => 'Titre',
          'description' => 'Bloc de titre (H1-H6)',
        ),
        'paragraph_block' => array (
          'name' => 'Paragraphe',
          'description' => 'Bloc de texte',
        ),
        'button_block' => array (
          'name' => 'Bouton',
          'description' => 'Bouton cliquable',
        ),
        'image_block' => array (
          'name' => 'Image',
          'description' => 'Image avec dimensions optionnelles',
        ),
        'card_block' => array (
          'name' => 'Carte',
          'description' => 'Carte avec titre et description',
          'fields' => array (
            'title' => 'Titre',
            'description' => 'Description',
          ),
        ),
        'grid_block' => array (
          'name' => 'Grille',
          'description' => 'Conteneur de grille avec colonnes',
          'fields' => array (
            'items' => 'Éléments',
          ),
        ),
      ),
      'zones' => array (
        'items' => 'Éléments',
      ),
    );
