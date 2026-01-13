import { ComponentConfig } from '@measured/puck';

export interface PluginComponent {
  id: string;
  pluginId: string;
  name: string;
  category: 'shop' | 'server' | 'community' | 'media' | 'other';
  description: string;
  icon?: string;
  fields: Record<string, unknown>;
  defaultProps: Record<string, unknown>;
  render: React.ComponentType<any>;
  permissions?: string[];
}

/**
 * Plugin Component Registry
 *
 * Allows plugins to register their own Puck components that can be used
 * in the visual editor on any page.
 *
 * Plugin usage:
 * ```typescript
 * import { registerPluginComponent } from '@/lib/pluginComponents';
 *
 * // In your plugin's entry point
 * registerPluginComponent({
 *   id: 'shop-latest-purchases',
 *   pluginId: 'shop',
 *   name: 'Latest Purchases',
 *   category: 'shop',
 *   description: 'Display the 5 latest shop purchases',
 *   fields: {
 *     limit: { type: 'number', label: 'Number of items' },
 *     showUser: { type: 'checkbox', label: 'Show username' },
 *   },
 *   defaultProps: { limit: 5, showUser: true },
 *   render: LatestPurchasesComponent,
 *   permissions: ['admin.shop', 'shop.view'],
 * });
 * ```
 */

class PluginComponentRegistry {
  private components: Map<string, PluginComponent> = new Map();

  /**
   * Register a plugin component
   */
  register(component: PluginComponent): void {
    const key = `${component.pluginId}-${component.id}`;
    this.components.set(key, component);

    // Also register with Puck if available
    if (typeof window !== 'undefined' && (window as any).puckPluginRegistry) {
      (window as any).puckPluginRegistry.register(key, component);
    }
  }

  /**
   * Unregister a plugin component
   */
  unregister(pluginId: string, componentId: string): void {
    const key = `${pluginId}-${componentId}`;
    this.components.delete(key);
  }

  /**
   * Get a component by key
   */
  get(key: string): PluginComponent | undefined {
    return this.components.get(key);
  }

  /**
   * Get all components
   */
  getAll(): PluginComponent[] {
    return Array.from(this.components.values());
  }

  /**
   * Get components by plugin
   */
  getByPlugin(pluginId: string): PluginComponent[] {
    return this.getAll().filter(c => c.pluginId === pluginId);
  }

  /**
   * Get components by category
   */
  getByCategory(category: PluginComponent['category']): PluginComponent[] {
    return this.getAll().filter(c => c.category === category);
  }

  /**
   * Convert to Puck component config
   */
  toPuckConfig(): Record<string, ComponentConfig> {
    const config: Record<string, ComponentConfig> = {};

    for (const component of this.components.values()) {
      config[component.id] = {
        fields: component.fields as any,
        defaultProps: component.defaultProps,
        render: component.render,
      };
    }

    return config;
  }

  /**
   * Clear all components
   */
  clear(): void {
    this.components.clear();
  }
}

// Singleton instance
export const pluginRegistry = new PluginComponentRegistry();

/**
 * Register a plugin component
 */
export function registerPluginComponent(component: PluginComponent): void {
  pluginRegistry.register(component);
}

/**
 * Unregister a plugin component
 */
export function unregisterPluginComponent(pluginId: string, componentId: string): void {
  pluginRegistry.unregister(pluginId, componentId);
}

/**
 * Get all plugin components as Puck config
 */
export function getPluginComponentsConfig(): Record<string, ComponentConfig> {
  return pluginRegistry.toPuckConfig();
}

/**
 * Check if a user has permission to use a component
 */
export function canUseComponent(component: PluginComponent, user: any): boolean {
  if (!component.permissions || component.permissions.length === 0) {
    return true;
  }

  if (!user?.role?.permissions) {
    return false;
  }

  return component.permissions.some((perm: string) =>
    user.role.permissions.some((p: any) => p.permission === perm)
  );
}

/**
 * Get components available to a user
 */
export function getAvailableComponents(user: any): PluginComponent[] {
  return pluginRegistry.getAll().filter(c => canUseComponent(c, user));
}

// Type for Puck component fields
export type PuckFieldConfig =
  | { type: 'text'; label: string; default?: string }
  | { type: 'number'; label: string; default?: number; min?: number; max?: number }
  | { type: 'textarea'; label: string; default?: string }
  | { type: 'checkbox'; label: string; default?: boolean }
  | { type: 'select'; label: string; options: { label: string; value: string }[]; default?: string }
  | { type: 'radio'; label: string; options: { label: string; value: string }[]; default?: string }
  | { type: 'image'; label: string; default?: string }
  | { type: 'color'; label: string; default?: string }
  | { type: 'url'; label: string; default?: string };

/**
 * Helper to create plugin component fields
 */
export function createFields(fields: Record<string, PuckFieldConfig>): Record<string, unknown> {
  return fields;
}

// Initialize global registry for Puck integration
if (typeof window !== 'undefined') {
  (window as any).puckPluginRegistry = {
    components: {} as Record<string, PluginComponent>,
    register(key: string, component: PluginComponent) {
      this.components[key] = component;
    },
    get(key: string) {
      return this.components[key];
    },
    getAll() {
      return this.components;
    },
  };
}
