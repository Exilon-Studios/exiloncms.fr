<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Lignes de langue d'authentification
    |--------------------------------------------------------------------------
    |
    | Traductions pour l'authentification - Version nettoyée
    |
    */

    'login' => 'Se connecter',
    'register' => "S'inscrire",
    'logout' => 'Déconnexion',

    'name' => "Nom d'utilisateur",
    'email' => 'Email',
    'password' => 'Mot de passe',
    'confirm_password' => 'Confirmer le mot de passe',
    'remember' => 'Se souvenir de moi',

    'site' => [
        'name' => 'Nom du site',
        'default_name' => 'MC-CMS',
        'default_description' => 'Système de gestion de contenu moderne pour les serveurs de jeu',
    ],

    'features' => [
        'minecraft' => 'Serveur Minecraft',
        'management' => 'Gestion de contenu',
        'admin' => 'Panneau d\'administration',
    ],

    'description' => [
        'main' => ':siteName rend la gestion de votre serveur Minecraft plus facile que jamais. Contrôle complet sur les utilisateurs, la boutique et le contenu.',
    ],

    'powered_by' => 'Propulsé par :siteName',

    'password_placeholder' => '••••••••',

    'failed' => 'Ces identifiants ne correspondent pas à nos enregistrements.',
    'throttle' => 'Trop de tentatives de connexion. Veuillez réessayer dans :seconds secondes.',

    'mail' => [
        'reset' => [
            'subject' => 'Réinitialisation du mot de passe',
            'line1' => 'Vous recevez cet email car nous avons reçu une demande de réinitialisation du mot de passe pour votre compte.',
            'action' => 'Réinitialiser le mot de passe',
            'line2' => 'Ce lien de réinitialisation du mot de passe expirera dans :count minutes.',
            'line3' => 'Si vous n\'avez pas demandé de réinitialisation de mot de passe, aucune autre action n\'est requise.',
        ],
        'verify' => [
            'subject' => 'Vérifiez votre adresse email',
            'line1' => 'Merci de cliquer sur le bouton ci-dessous pour vérifier votre adresse email.',
            'action' => 'Vérifier l\'adresse email',
            'line2' => 'Si vous n\'avez pas créé de compte, aucune autre action n\'est requise.',
        ],
    ],

    'no_account' => 'Vous n\'avez pas de compte ?',
    'have_account' => 'Vous avez déjà un compte ?',
    'continue_with' => 'Ou continuer avec',
    'sign_in_with' => 'Se connecter avec',
    'sign_up_with' => 'S\'inscrire avec',
    'google' => 'Google',
    'discord' => 'Discord',
    'terms_agree' => 'En continuant, vous acceptez nos',
    'terms_agree_register' => 'En vous inscrivant, vous acceptez nos',
    'terms_of_service' => 'conditions d\'utilisation',
    'privacy_policy' => 'politique de confidentialité',
    'and' => 'et',
    'join_community' => 'Rejoignez notre communauté',
    'community_message' => 'rend la gestion de votre serveur Minecraft plus facile que jamais. Contrôle complet sur les utilisateurs, la boutique et le contenu.',

    '2fa' => [
        'title' => 'Authentification à deux facteurs',
        'description' => 'Entrez le code à 6 chiffres depuis votre application d\'authentification',
        'enter_code' => 'Code de vérification',
        'verify' => 'Vérifier',
        'verifying' => 'Vérification...',
        'back' => 'Retour à la connexion',
        'instruction_title' => 'Ouvrez votre application d\'authentification',
        'instruction' => 'Entrez le code à 6 chiffres généré par Google Authenticator, Authy ou une application similaire.',
        'recovery_title' => 'Codes de récupération',
        'recovery' => 'Si vous ne pouvez pas accéder à votre application d\'authentification, vous pouvez utiliser un code de récupération.',
        'digits' => 'chiffres',
        'secure_title' => 'Sécurisé par 2FA',
        'secure_message' => 'Votre compte est protégé par une couche de sécurité supplémentaire.',
        'protected' => 'est sécurisé par l\'authentification à deux facteurs.',
    ],
];
