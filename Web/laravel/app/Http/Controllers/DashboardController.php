<?php

namespace App\Http\Controllers;

use App\Models\Intervention;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Get statistics for the dashboard.
     */
    public function getStats()
    {
        $totalInterventions = Intervention::count();
        $totalRevenue = Intervention::sum('prix');
        $averageTime = Intervention::avg('time');

        return response()->json([
            'total_interventions' => $totalInterventions,
            'total_revenue' => $totalRevenue,
            'average_time' => round($averageTime, 2),
        ]);
    }
}
