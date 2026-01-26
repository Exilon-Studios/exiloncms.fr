<?php

namespace ExilonCMS\Console\Commands;

use ExilonCMS\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class UserPasswordCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:password
                        {--email= : The email of the user}
                        {--password= : The new password}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Reset a user password';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->option('email') ?? $this->ask('The Email address of the user');
        $password = $this->option('password') ?? $this->secret('The new password');

        $user = User::where('email', $email)->first();

        if (! $user) {
            $this->error("User with email {$email} not found.");

            return 1;
        }

        $user->password = Hash::make($password);
        $user->save();

        $this->info("Password for {$user->name} ({$email}) has been reset successfully.");

        return 0;
    }
}
