<?php

namespace ExilonCMS\Games\Steam;

use ExilonCMS\Games\Steam\Servers\AzLink;
use ExilonCMS\Games\Steam\Servers\FiveMRcon;
use ExilonCMS\Games\Steam\Servers\FiveMStatus;

class FiveMGame extends SteamGame
{
    public function __construct()
    {
        parent::__construct('fivem', 'FiveM', true);
    }

    public function getSupportedServers(): array
    {
        return [
            'fivem-status' => FiveMStatus::class,
            'fivem-rcon' => FiveMRcon::class,
            'steam-azlink' => AzLink::class,
        ];
    }
}
