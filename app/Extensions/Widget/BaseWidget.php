<?php

namespace ExilonCMS\Extensions\Widget;

use ExilonCMS\Models\User;

abstract class BaseWidget
{
    /**
     * Get the widget unique identifier.
     */
    abstract public function id(): string;

    /**
     * Get the widget title.
     */
    abstract public function title(): string;

    /**
     * Get the widget description.
     */
    public function description(): ?string
    {
        return null;
    }

    /**
     * Get the widget type: 'card' or 'widget'.
     * Cards are shown in the cards grid, widgets are shown in the widgets section.
     */
    public function type(): string
    {
        return 'widget';
    }

    /**
     * Get the widget size: 'small', 'medium', or 'large'.
     */
    public function size(): string
    {
        return 'medium';
    }

    /**
     * Get the permission required to view this widget.
     */
    public function permission(): ?string
    {
        return null;
    }

    /**
     * Get the widget icon.
     */
    public function icon(): ?string
    {
        return null;
    }

    /**
     * Get the link for the widget (for cards).
     */
    public function link(): ?string
    {
        return null;
    }

    /**
     * Get the React component name to render for this widget.
     */
    public function component(): string
    {
        return 'DefaultWidget';
    }

    /**
     * Get the props to pass to the React component.
     */
    public function props(?User $user): array
    {
        return [];
    }

    /**
     * Check if the widget should be shown.
     */
    public function isVisible(?User $user): bool
    {
        return true;
    }

    /**
     * Convert the widget to an array.
     */
    public function toArray(?User $user): array
    {
        return [
            'id' => $this->id(),
            'title' => $this->title(),
            'description' => $this->description(),
            'type' => $this->type(),
            'size' => $this->size(),
            'permission' => $this->permission(),
            'icon' => $this->icon(),
            'link' => $this->link(),
            'component' => $this->component(),
            'props' => $this->props($user),
        ];
    }
}
