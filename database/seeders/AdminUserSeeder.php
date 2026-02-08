<?php

namespace Database\Seeders;

use ExilonCMS\Models\Permission;
use ExilonCMS\Models\Role;
use ExilonCMS\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     *
     * NOTE: The admin user is NOT created here anymore.
     * It should be created during installation via the web installer
     * or using `php artisan user:create --admin`.
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
