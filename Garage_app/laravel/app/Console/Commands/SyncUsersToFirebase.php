<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Services\FirebaseUserSyncService;

class SyncUsersToFirebase extends Command
{
    protected $signature = 'firebase:sync-users';
    protected $description = 'Synchronise tous les utilisateurs vers Firebase Firestore';

    public function handle()
    {
        $this->info('🔄 Synchronisation des utilisateurs en cours...');

        User::chunk(100, function ($users) {
            foreach ($users as $user) {
                FirebaseUserSyncService::sync($user);
            }
        });

        $this->info('✅ Synchronisation terminée.');
        return Command::SUCCESS;
    }
}
