<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Intervention;
use App\Services\FirebaseInterventionSyncService;

class SyncInterventionsToFirebase extends Command
{
    protected $signature = 'firebase:sync-interventions';
    protected $description = 'Synchronise toutes les interventions vers Firebase Firestore';

    public function handle()
    {
        $this->info('🔄 Synchronisation des interventions en cours...');

        Intervention::chunk(100, function ($interventions) {
            foreach ($interventions as $intervention) {
                FirebaseInterventionSyncService::sync($intervention);
            }
        });

        $this->info('✅ Synchronisation terminée.');
        return Command::SUCCESS;
    }
}
