<?php

namespace ExilonCMS\Attributes;

use Attribute;

#[Attribute(Attribute::TARGET_CLASS)]
class PluginMeta
{
    public function __construct(
        public string $id,
        public string $name,
        public string $version,
        public string $description = '',
        public string $author = '',
        public string $url = '',
        public array $dependencies = [],
        public array $permissions = [],
    ) {}
}
