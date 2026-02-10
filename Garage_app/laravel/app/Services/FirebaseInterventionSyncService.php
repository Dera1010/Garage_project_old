<?php

namespace App\Services;

use Kreait\Firebase\Factory;
use App\Models\Intervention;

class FirebaseInterventionSyncService
{
    public static function sync(Intervention $intervention)
    {
        $factory = (new Factory)
            ->withServiceAccount(config('firebase.credentials'));

        $firestore = $factory->createFirestore();
        $db = $firestore->database();

        $db->collection('interventions')
           ->document((string) $intervention->id) // clé unique
           ->set([
               'id' => $intervention->id,
               'nom' => $intervention->nom,
               'prix' => (float) $intervention->prix,
               'time' => $intervention->time,
               'created_at' => optional($intervention->created_at)?->toIso8601String(),
               'updated_at' => optional($intervention->updated_at)?->toIso8601String(),
           ]);
    }

    public static function delete(Intervention $intervention)
    {
        $factory = (new Factory)
            ->withServiceAccount(config('firebase.credentials'));

        $firestore = $factory->createFirestore();
        $db = $firestore->database();

        $db->collection('interventions')
           ->document((string) $intervention->id)
           ->delete();
    }
}
