<?php

namespace App\Observers;

use App\Models\Voiture;
use App\Services\FirebaseVoitureSyncService;

class VoitureObserver
{
    public function created(Voiture $voiture)
    {
        FirebaseVoitureSyncService::sync($voiture);
    }

    public function updated(Voiture $voiture)
    {
        FirebaseVoitureSyncService::sync($voiture);
    }

    public function deleted(Voiture $voiture)
    {
        FirebaseVoitureSyncService::delete($voiture);
    }
}
