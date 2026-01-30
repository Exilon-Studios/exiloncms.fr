<?php

namespace ExilonCMS\Classes\Extension;

/**
 * Base class for extensions
 * Inspired by Paymenter's extension system
 *
 * @link https://docs.paymenter.org/development/extensions
 */
abstract class Extension
{
    public function __construct(public $config = []) {}

    /**
     * Get a configuration value
     *
     * @param  string  $key
     * @return mixed
     */
    public function config($key)
    {
        return $this->config[$key] ?? null;
    }

    /**
     * Get the configuration fields for the extension
     *
     * @param  array  $values  The current values of the configuration (is empty on first load)
     * @return array
     */
    public function getConfig($values = [])
    {
        return [];
    }

    /**
     * Called when the extension is installed for the first time
     *
     * @return void
     */
    public function installed() {}

    /**
     * Called when the extension is uninstalled
     *
     * @return void
     */
    public function uninstalled() {}

    /**
     * Called when the extension is updated
     *
     * @param  string  $oldVersion  The old version of the extension
     * @return void
     */
    public function upgraded($oldVersion = null) {}

    /**
     * Called every request to the extension (if the extension is enabled)
     *
     * @return void
     */
    public function boot() {}
}
