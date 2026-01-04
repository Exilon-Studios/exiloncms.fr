<?php

namespace Database\Seeders;

use ExilonCMS\Models\Permission;
use ExilonCMS\Models\Role;
use Illuminate\Database\Seeder;

class PuckPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get admin role (using is_admin boolean)
        $adminRole = Role::where('is_admin', true)->first();

        if (!$adminRole) {
            $this->command->error('Le rôle admin n\'existe pas. Veuillez d\'abord exécuter les seeders de base.');
            return;
        }

        // Check if permission already exists
        $existingPermission = Permission::where('permission', 'admin.pages.puck-edit')
            ->where('role_id', $adminRole->id)
            ->first();

        if ($existingPermission) {
            $this->command->info('La permission Puck existe déjà');
            return;
        }

        // Create Puck editor permission
        Permission::create([
            'permission' => 'admin.pages.puck-edit',
            'role_id' => $adminRole->id,
        ]);

        $this->command->info('Permission Puck créée et assignée au rôle admin');
    }
}
