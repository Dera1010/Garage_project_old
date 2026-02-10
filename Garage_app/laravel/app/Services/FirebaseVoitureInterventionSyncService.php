<?php

namespace App\Services;

use Kreait\Firebase\Factory;
use App\Models\VoitureIntervention;

class FirebaseVoitureInterventionSyncService
{
    public static function sync(VoitureIntervention $vi)
    {
        $factory = (new Factory)
            ->withServiceAccount(config('firebase.credentials'));

        $firestore = $factory->createFirestore();
        $db = $firestore->database();

        $db->collection('voiture_interventions')
           ->document((string) $vi->id)
           ->set([
               'id' => $vi->id,
               'voiture_id' => $vi->voiture_id,
               'status' => $vi->status,
               'created_at' => optional($vi->created_at)?->toIso8601String(),
               'updated_at' => optional($vi->updated_at)?->toIso8601String(),
           ]);
    }

    public static function delete(VoitureIntervention $vi)
    {
        $factory = (new Factory)
            ->withServiceAccount(config('firebase.credentials'));

        $firestore = $factory->createFirestore();
        $db = $firestore->database();

        $db->collection('voiture_interventions')
           ->document((string) $vi->id)
           ->delete();
    }
}
