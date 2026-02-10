<?php

namespace App\Observers;

use App\Models\VoitureIntervention;
use App\Services\FirebaseVoitureInterventionSyncService;

class VoitureInterventionObserver
{
    public function created(VoitureIntervention $vi)
    {
        FirebaseVoitureInterventionSyncService::sync($vi);
    }

    public function updated(VoitureIntervention $vi)
    {
        FirebaseVoitureInterventionSyncService::sync($vi);
    }

    public function deleted(VoitureIntervention $vi)
    {
        FirebaseVoitureInterventionSyncService::delete($vi);
    }
}
