<?php

namespace App\Http\Controllers;

use App\Models\Intervention;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class InterventionController extends Controller
{
    /**
     * Store a newly created intervention in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|unique:intervention,nom',
            'prix' => 'required|numeric',
            'time' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $intervention = Intervention::create([
            'nom' => $request->nom,
            'prix' => $request->prix,
            'time' => $request->time,
        ]);

        return response()->json([
            'message' => 'Intervention créée avec succès',
            'data' => $intervention
        ], 201);
    }

    /**
     * Display a listing of the interventions.
     */
    public function index()
    {
        $interventions = Intervention::all();
        return response()->json($interventions);
    }

    /**
     * Display the specified intervention.
     */
    public function show($id)
    {
        $intervention = Intervention::find($id);

        if (!$intervention) {
            return response()->json(['message' => 'Intervention non trouvée'], 404);
        }

        return response()->json($intervention);
    }

    /**
     * Update the specified intervention in storage.
     */

    public function update(Request $request, $id)
    {
        $intervention = Intervention::find($id);

        if (!$intervention) {
            return response()->json(['message' => 'Intervention non trouvée'], 404);
        }

        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|unique:intervention,nom,' . $id,
            'prix' => 'required|numeric',
            'time' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $intervention->update([
            'nom' => $request->nom,
            'prix' => $request->prix,
            'time' => $request->time,
        ]);

        return response()->json([
            'message' => 'Intervention mise à jour avec succès',
            'data' => $intervention
        ]);
    }

    /**
     * Remove the specified intervention from storage.
     */
    public function destroy($id)
    {
        $intervention = Intervention::find($id);

        if (!$intervention) {
            return response()->json(['message' => 'Intervention non trouvée'], 404);
        }

        $intervention->delete();

        return response()->json([
            'message' => 'Intervention supprimée avec succès'
        ]);
    }
}
