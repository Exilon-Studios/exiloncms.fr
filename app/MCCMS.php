<?php

namespace MCCMS;

use Illuminate\Support\Str;

class MCCMS
{
    /**
     * The ExilonCMS version.
     *
     * @var string
     */
    private const VERSION = '0.2.2';

    /**
     * Get the current version of ExilonCMS.
     */
    public static function version(): string
    {
        return static::VERSION;
    }

    /**
     * Get the current API version, for extensions, of ExilonCMS.
     */
    public static function apiVersion(): string
    {
        return Str::beforeLast(static::VERSION, '.');
    }
}
