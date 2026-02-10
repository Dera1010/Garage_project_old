<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Voiture;
use App\Services\FirebaseVoitureSyncService;

class SyncVoituresToFirebase extends Command
{
    protected $signature = 'firebase:sync-voitures';
    protected $description = 'Synchronise toutes les voitures vers Firebase Firestore';

    public function handle()
    {
        $this->info('🔄 Synchronisation des voitures en cours...');

        Voiture::chunk(100, function ($voitures) {
            foreach ($voitures as $voiture) {
                FirebaseVoitureSyncService::sync($voiture);
            }
        });

        $this->info('✅ Synchronisation terminée.');
        return Command::SUCCESS;
    }
}
