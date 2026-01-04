<?php

namespace MCCMS\Games\Steam;

use MCCMS\Games\Steam\Servers\AzLink;
use MCCMS\Games\Steam\Servers\FiveMRcon;
use MCCMS\Games\Steam\Servers\FiveMStatus;

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
