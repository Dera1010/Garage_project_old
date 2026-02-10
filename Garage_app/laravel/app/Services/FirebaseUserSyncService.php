<?php

namespace App\Services;

use Kreait\Firebase\Factory;
use App\Models\User;

class FirebaseUserSyncService
{
    public static function sync(User $user)
    {
        $factory = (new Factory)
            ->withServiceAccount(config('firebase.credentials'));

        $firestore = $factory->createFirestore();
        $db = $firestore->database();

        $db->collection('users')
           ->document($user->firebase_uid) // 🔑 clé unique
           ->set([
               'id' => $user->id,
               'firebase_uid' => $user->firebase_uid,
               'name' => $user->name,
               'email' => $user->email,
               'role' => $user->role,
               'created_at' => optional($user->created_at)?->toIso8601String(),
               'updated_at' => optional($user->updated_at)?->toIso8601String(),
           ]);
    }
}
