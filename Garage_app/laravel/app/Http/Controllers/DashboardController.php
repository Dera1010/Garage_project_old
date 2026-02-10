<?php

namespace App\Http\Controllers;

use App\Models\Intervention;
use App\Models\User;
use App\Services\FirebaseService;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Get statistics for the dashboard.
     */
    public function getStats(FirebaseService $firebase)
    {
        // 1️⃣ Récupérer les stats depuis PostgreSQL
        $totalInterventions = Intervention::count();
        $totalRevenue = Intervention::sum('prix');
        $averageTime = Intervention::avg('time');
        $totalClients = User::count();

        $stats = [
            'total_interventions' => $totalInterventions,
            'total_revenue' => $totalRevenue,
            'average_time' => round($averageTime, 2),
            'total_clients' => $totalClients,
            'updated_at' => now()->toDateTimeString(),
        ];

        // 2️⃣ Synchroniser vers Firebase
        $firebase->set('dashboard/stats', $stats);

        // 3️⃣ Réponse API classique
        return response()->json($stats);
    }
}
