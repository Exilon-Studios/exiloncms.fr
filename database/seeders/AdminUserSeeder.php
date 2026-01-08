<?php

namespace Database\Seeders;

use ExilonCMS\Models\User;
use ExilonCMS\Models\Role;
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
                'label' => 'Administrator',
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
            ]
        );

        // Sync all permissions to admin role
        if ($adminRole->permissions()->count() === 0) {
            $adminRole->permissions()->attach(
                \ExilonCMS\Models\Permission::pluck('id')->toArray()
            );
        }
    }
}
