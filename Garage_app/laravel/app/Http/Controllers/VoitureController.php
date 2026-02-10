<?php

namespace App\Http\Controllers;

use App\Models\Voiture;
use App\Models\VoitureIntervention;
use Illuminate\Http\Request;
use Kreait\Firebase\Factory;

class VoitureController extends Controller
{
    public function index(Request $request)
    {
        // Récupérer Firebase UID depuis le token
        $idToken = str_replace('Bearer ', '', $request->header('Authorization'));
        $auth = (new Factory)->withServiceAccount(config('firebase.credentials'))->createAuth();
        $verifiedToken = $auth->verifyIdToken($idToken);
        $firebaseUid = $verifiedToken->claims()->get('sub');

        // Récupérer les voitures de l'utilisateur avec leurs interventions
        $voitures = Voiture::where('user_firebase_uid', $firebaseUid)
            ->whereHas('voitureInterventions.details') // 🔥 condition clé
            ->with([
                'voitureInterventions.details.intervention'
            ])
            ->get();

        return response()->json($voitures);
    }

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

        // Créer l'intervention voiture par défaut
        $voiture_intervention = VoitureIntervention::create([
            'voiture_id' => $voiture->id,
            'status' => 'en attente'
        ]);

        return response()->json(['message' => 'Voiture ajoutée', 'voiture_intervention' => $voiture_intervention]);
    }

    public function assignIntervention(Request $request, $voiture_intervention_id)
    {
        $validated = $request->validate([
            'intervention_ids' => 'required|array',
            'intervention_ids.*' => 'exists:intervention,id'
        ]);

        $voitureIntervention = VoitureIntervention::findOrFail($voiture_intervention_id);

        // Assigner les interventions
        foreach ($validated['intervention_ids'] as $id) {
            $voitureIntervention->details()->create([
                'intervention_id' => $id,
                'status' => 'en attente'
            ]);
        }

        return response()->json([
            'message'           => 'Interventions assignées',
            'voiture_intervention_id' => $voitureIntervention->id,
            'intervention_ids'  => $validated['intervention_ids'],
            'status'            => 'en attente'
        ]);
    }

    public function show($id)
    {
        return Voiture::findOrFail($id);
    }
}
