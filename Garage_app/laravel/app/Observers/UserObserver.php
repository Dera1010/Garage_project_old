<?php

namespace App\Observers;


use App\Models\User;
use App\Services\FirebaseUserSyncService;

class UserObserver
{
    public function created(User $user)
    {
        FirebaseUserSyncService::sync($user);
    }

    public function updated(User $user)
    {
        FirebaseUserSyncService::sync($user);
    }

    public function deleted(User $user)
    {
        $factory = (new \Kreait\Firebase\Factory)
            ->withServiceAccount(config('firebase.credentials'));

        $factory->createFirestore()
            ->database()
            ->collection('users')
            ->document($user->firebase_uid)
            ->delete();
    }
}

