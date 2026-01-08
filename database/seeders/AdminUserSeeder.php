<?php

namespace Database\Seeders;

use ExilonCMS\Models\User;
use ExilonCMS\Models\Role;
use ExilonCMS\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
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

        // Create admin user
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('password'),
                'role_id' => $adminRole->id,
                'email_verified_at' => now(),
                'password_changed_at' => now(),
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
