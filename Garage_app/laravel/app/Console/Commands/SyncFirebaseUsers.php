<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Kreait\Firebase\Factory;
use App\Models\User;
use Exception;

class SyncFirebaseUsers extends Command
{
    // Commande artisan
    protected $signature = 'firebase:sync-users';
    protected $description = 'Synchronise les utilisateurs Firebase vers PostgreSQL';

    public function handle()
    {
        $this->info("🔄 Début de la synchronisation des utilisateurs Firebase...");

        try {
            // Connexion à Firebase
            $auth = (new Factory)
                ->withServiceAccount(config('firebase.credentials'))
                ->createAuth();

            // Liste tous les utilisateurs Firebase
            $users = $auth->listUsers();

            $count = 0;

            foreach ($users as $firebaseUser) {
                if (empty($firebaseUser->uid)) {
                    $this->warn("⚠ Utilisateur ignoré (UID manquant)");
                    continue;
                }

                // Synchronise ou crée l'utilisateur dans PostgreSQL
                User::updateOrCreate(
                    ['firebase_uid' => $firebaseUser->uid],
                    [
                        'email' => $firebaseUser->email ?? null,
                        'name'  => $firebaseUser->displayName ?? null,
                        'role'  => 'client',
                    ]
                );

                $this->info("✅ Utilisateur synchronisé: UID={$firebaseUser->uid}, Email={$firebaseUser->email}");
                $count++;
            }

            $this->info("🎉 Synchronisation terminée ! Total utilisateurs synchronisés : $count");

        } catch (Exception $e) {
            $this->error("❌ Erreur lors de la synchronisation : " . $e->getMessage());
        }
    }
}
