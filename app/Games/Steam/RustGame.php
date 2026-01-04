<?php

namespace MCCMS\Games\Steam;

use MCCMS\Games\Steam\Servers\AzLink;
use MCCMS\Games\Steam\Servers\Query;
use MCCMS\Games\Steam\Servers\RustRcon;

class RustGame extends SteamGame
{
    public function __construct()
    {
        parent::__construct('rust', 'Rust', true);
    }

    public function getSupportedServers(): array
    {
        return [
            'source-query' => Query::class,
            // Rust use a WebSocket based Rcon
            'rust-rcon' => RustRcon::class,
            'steam-azlink' => AzLink::class,
        ];
    }
}
