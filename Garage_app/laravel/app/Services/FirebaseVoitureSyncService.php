<?php

namespace App\Services;

use Kreait\Firebase\Factory;
use App\Models\Voiture;

class FirebaseVoitureSyncService
{
    public static function sync(Voiture $voiture)
    {
        $factory = (new Factory)
            ->withServiceAccount(config('firebase.credentials'));

        $firestore = $factory->createFirestore();
        $db = $firestore->database();

        $db->collection('voitures')
           ->document((string) $voiture->id) // clé unique = id PostgreSQL
           ->set([
               'id' => $voiture->id,
               'user_firebase_uid' => $voiture->user_firebase_uid,
               'make' => $voiture->make,
               'model' => $voiture->model,
               'license_plate' => $voiture->license_plate,
               'annee' => $voiture->annee,
               'created_at' => optional($voiture->created_at)?->toIso8601String(),
               'updated_at' => optional($voiture->updated_at)?->toIso8601String(),
           ]);
    }

    public static function delete(Voiture $voiture)
    {
        $factory = (new Factory)
            ->withServiceAccount(config('firebase.credentials'));

        $firestore = $factory->createFirestore();
        $db = $firestore->database();

        $db->collection('voitures')
           ->document((string) $voiture->id)
           ->delete();
    }
}
