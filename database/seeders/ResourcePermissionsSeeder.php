<?php

namespace Database\Seeders;

use ExilonCMS\Models\Permission;
use ExilonCMS\Models\Role;
use Illuminate\Database\Seeder;

class ResourcePermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get or create admin role with all required fields
        $adminRole = Role::firstOrCreate(
            ['name' => 'admin'],
            [
                'color' => 'e11d48',
                'power' => 100,
                'is_admin' => true,
            ]
        );

        // Define resource permissions using the ExilonCMS format
        $resourcePermissions = [
            // Admin permissions
            'admin.resources.view' => 'admin.permissions.admin-resources-view',
            'admin.resources.moderate' => 'admin.permissions.admin-resources-moderate',
            'admin.resources.edit' => 'admin.permissions.admin-resources-edit',
            'admin.resources.delete' => 'admin.permissions.admin-resources-delete',
            'admin.resources.settings' => 'admin.permissions.admin-resources-settings',

            // User permissions (for creating/managing own resources)
            'resources.create' => 'permissions.resources-create',
            'resources.update' => 'permissions.resources-update',
            'resources.delete' => 'permissions.resources-delete',
        ];

        // Register the permissions in the system
        Permission::registerPermissions($resourcePermissions);

        // Insert permissions for admin role
        foreach ($resourcePermissions as $permission => $displayName) {
            // Only attach admin permissions to admin role
            if (str_starts_with($permission, 'admin.')) {
                \DB::table('permissions')->updateOrInsert(
                    [
                        'permission' => $permission,
                        'role_id' => $adminRole->id,
                    ],
                    [
                        'permission' => $permission,
                        'role_id' => $adminRole->id,
                    ]
                );

                $this->command->info("Permission registered: {$permission}");
            }
        }

        $this->command->info('Resource permissions seeded successfully.');
        $this->command->info('Registered permissions: ' . implode(', ', array_keys($resourcePermissions)));
    }
}
