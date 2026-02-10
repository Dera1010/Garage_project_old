<?php

namespace App\Http\Controllers;

use App\Models\Intervention;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FrontOfficeController extends Controller
{
    /**
     * Get statistics for the dashboard.
     */
    public function index()
    {
        // Réparations actives (via la table pivot voiture_intervention)
        $activeRepairs = DB::table('voiture_intervention')
            ->join('voitures', 'voiture_intervention.voiture_id', '=', 'voitures.id')
            ->join('users', 'voitures.user_firebase_uid', '=', 'users.firebase_uid')
            ->join('intervention', 'voiture_intervention.intervention_id', '=', 'intervention.id')
            ->select(
                'voiture_intervention.id',
                'users.name as client_name',
                'voiture_intervention.status',
                'intervention.nom as intervention_nom',
                'intervention.time as estimation'
            )
            ->whereIn('voiture_intervention.status', ['en attente', 'en cours'])
            ->get()
            ->map(function ($repair) {
                // Mapping des statuts en français plus lisibles
                $statusMap = [
                    'en attente' => 'En attente',
                    'en cours' => 'En cours',
                    'terminé' => 'Terminé'
                ];

                // Calcul factice d'une progression basée sur le statut
                $progress = 0;
                if ($repair->status === 'en cours') $progress = 50;
                if ($repair->status === 'terminé') $progress = 100;

                return [
                    'id' => $repair->id,
                    'client' => $repair->client_name,
                    'intervention' => $repair->intervention_nom,
                    'status' => $statusMap[$repair->status] ?? $repair->status,
                    'progress' => $progress,
                    'estimation' => $repair->estimation . ' min'
                ];
            });

        return response()->json($activeRepairs);
    }

    public function list_client(Request $request)
    {
        $query = User::select('name', 'email');

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('id', 'like', "%{$search}%");
            });
        }

        $clients = $query->paginate(20);

        return response()->json($clients);
    }

    public function list_intervention()
    {
        $interventions = Intervention::all();
        return response()->json($interventions);
    }

    public function ongoingRepairsDetails()
    {
        $details = DB::table('voiture_intervention')
            ->join('details_intervention', 'voiture_intervention.id', '=', 'details_intervention.voiture_intervention_id')
            ->join('voitures', 'voiture_intervention.voiture_id', '=', 'voitures.id')
            ->join('intervention', 'details_intervention.intervention_id', '=', 'intervention.id')
            ->where('voiture_intervention.status', 'en cours')
            ->select(
                'voiture_intervention.id as repair_id',
                'voiture_intervention.status as repair_status',
                'voitures.make',
                'voitures.model',
                'voitures.license_plate',
                'details_intervention.id as detail_id',
                'intervention.nom as intervention_name',
                'details_intervention.status as detail_status'
            )
            ->get();

        return response()->json($details);
    }

    public function infoClient() {

    }
}
