<?php

namespace App\Http\Controllers;

use App\Models\Voiture;
use Illuminate\Http\Request;
use Kreait\Firebase\Factory;

class VoitureController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'make' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'license_plate' => 'nullable|string|max:255|unique:voitures',
            'annee' => 'nullable|string|max:4',
        ]);

        // Récupérer Firebase UID depuis le token
        $idToken = str_replace('Bearer ', '', $request->header('Authorization'));
        $auth = (new Factory)->withServiceAccount(config('firebase.credentials'))->createAuth();
        $verifiedToken = $auth->verifyIdToken($idToken);
        $firebaseUid = $verifiedToken->claims()->get('sub'); // Firebase UID

        // Créer la voiture
        $voiture = Voiture::create([
            'user_firebase_uid' => $firebaseUid,
            'make' => $request->make,
            'model' => $request->model,
            'license_plate' => $request->license_plate,
            'annee' => $request->annee,
        ]);

        return response()->json(['message' => 'Voiture ajoutée', 'voiture' => $voiture]);
    }

    public function assignIntervention(Request $request, $voiture_id)
    {
        $validated = $request->validate([
            'intervention_id' => 'required|exists:intervention,id'
        ]);

        $voiture = Voiture::findOrFail($voiture_id);

        // Assigner l'intervention avec status "en_cours"
        $voiture->interventions()->attach($validated['intervention_id'], ['status' => 'en_cours']);

        return response()->json([
            'message'          => 'Intervention assignée',
            'voiture_id'       => $voiture->id,
            'intervention_id'  => $validated['intervention_id'],
            'status'           => 'en_attente'
        ]);
    }
}
