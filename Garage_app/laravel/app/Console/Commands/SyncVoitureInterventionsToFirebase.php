<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\VoitureIntervention;
use App\Services\FirebaseVoitureInterventionSyncService;

class SyncVoitureInterventionsToFirebase extends Command
{
    protected $signature = 'firebase:sync-voiture-interventions';
    protected $description = 'Synchronise toutes les voiture_interventions vers Firebase Firestore';

    public function handle()
    {
        $this->info('🔄 Synchronisation des voiture_interventions en cours...');

        VoitureIntervention::chunk(100, function ($vis) {
            foreach ($vis as $vi) {
                FirebaseVoitureInterventionSyncService::sync($vi);
            }
        });

        $this->info('✅ Synchronisation terminée.');
        return Command::SUCCESS;
    }
}
