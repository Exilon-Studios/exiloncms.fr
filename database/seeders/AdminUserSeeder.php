<?php

namespace Database\Seeders;

use ExilonCMS\Models\Permission;
use ExilonCMS\Models\Role;
use ExilonCMS\Models\User;
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

        // Create admin user with configurable email
        $adminEmail = env('ADMIN_EMAIL', 'admin@example.com');

        // Check if admin already exists with the same email to avoid duplicates
        $existingAdmin = User::where('email', $adminEmail)->first();
        if (! $existingAdmin) {
            $admin = User::create([
                'email' => $adminEmail,
                'name' => 'Admin',
                'password' => Hash::make('admin123'),
                'role_id' => $adminRole->id,
                'email_verified_at' => now(),
                'password_changed_at' => now(),
            ]);
        }

        // Fallback: create with admin@example.com if no env set
        if (! $existingAdmin) {
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
        }

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
