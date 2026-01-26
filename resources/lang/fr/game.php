<?php

return [
    'fivem' => [
        'id' => 'ID Cfx.re',
        'name' => 'Nom d\'utilisateur Cfx.re',
        'commands' => 'Vous pouvez utiliser <code>{name}</code> pour le nom d\'utilisateur, <code>{id}</code> pour l\'ID, <code>{fivem_id}</code> pour l\'ID Cfx.re, <code>{steam_id}</code> pour le SteamID 64 et <code>{steam_hex}</code> pour l\'HEX Steam ID',
    ],

    'steam' => [
        'id' => 'SteamID 64',
        'commands' => 'Vous pouvez utiliser <code>{name}</code> pour le nom du joueur, <code>{steam_id}</code> pour le SteamID 64 du joueur et <code>{steam_id_32}</code> pour le SteamID 32 du joueur.',
    ],

    'epic' => [
        'id' => 'ID Epic Games',
        'commands' => 'Vous pouvez utiliser <code>{name}</code> pour le nom du joueur et <code>{game_id}</code> pour l\'ID Epic Games du joueur.',
    ],

    'xbox' => [
        'missing' => 'Ce compte Microsoft n\'a pas de profil Xbox.',
    ],

    'minecraft' => [
        'id' => 'UUID',
        'missing' => 'Ce compte Xbox n\'a pas de profil Minecraft.',
        'child' => 'Ce compte est un compte enfant (moins de 18 ans) et doit être ajouté à une famille par un adulte pour pouvoir se connecter.',
        'commands' => 'Vous pouvez utiliser <code>{name}</code> pour le nom du joueur et <code>{uuid}</code> pour l\'UUID du joueur',
    ],

    'minecraft_bedrock' => [
        'id' => 'XUID',
        'commands' => 'Vous pouvez utiliser <code>{name}</code> pour le nom du joueur et <code>{xuid}</code> pour le XUID du joueur',
    ],

    'hytale' => [
        'id' => 'UUID',
        'commands' => 'Vous pouvez utiliser <code>{name}</code> pour le nom du joueur et <code>{uuid}</code> pour l\'UUID du joueur',
    ],
];
