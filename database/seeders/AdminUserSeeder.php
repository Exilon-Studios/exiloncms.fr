<?php

namespace Database\Seeders;

use ExilonCMS\Models\Permission;
use ExilonCMS\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     *
     * Creates admin role and permissions.
     * Admin user MUST be created via web installer or `php artisan user:create --admin`.
     */
    public function run(): void
    {
        // Create admin role if it doesn't exist
        $adminRole = Role::firstOrCreate(
            ['name' => 'admin'],
            [
                'color' => 'FF0000',
                'is_admin' => true,
                'power' => 100,
            ]
        );

        // Create all permissions for admin role
        if ($adminRole->permissions()->count() === 0) {
            foreach (Permission::permissions() as $permission) {
                Permission::create([
                    'permission' => $permission,
                    'role_id' => $adminRole->id,
                ]);
            }
        }
    }
}
