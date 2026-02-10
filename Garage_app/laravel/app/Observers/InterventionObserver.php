<?php

namespace App\Observers;

use App\Models\Intervention;
use App\Services\FirebaseInterventionSyncService;

class InterventionObserver
{
    public function created(Intervention $intervention)
    {
        FirebaseInterventionSyncService::sync($intervention);
    }

    public function updated(Intervention $intervention)
    {
        FirebaseInterventionSyncService::sync($intervention);
    }

    public function deleted(Intervention $intervention)
    {
        FirebaseInterventionSyncService::delete($intervention);
    }
}
