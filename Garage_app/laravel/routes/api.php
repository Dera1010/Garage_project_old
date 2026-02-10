<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Kreait\Firebase\Factory;
use App\Http\Controllers\FirebaseAuthController;
use App\Http\Middleware\FirebaseAuthMiddleware;
use App\Http\Controllers\VoitureController;
use App\Http\Controllers\InterventionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FrontOfficeController;



Route::get('/secure', function (Request $request) {

    $idToken = $request->bearerToken();

    if (!$idToken) {
        return response()->json(['error' => 'Token manquant'], 401);
    }

    try {
        $auth = (new Factory)
            ->withServiceAccount(env('FIREBASE_CREDENTIALS'))
            ->createAuth();

        $verifiedToken = $auth->verifyIdToken($idToken);

        return response()->json([
            'message' => 'Accès autorisé',
            'uid' => $verifiedToken->claims()->get('sub'),
            'email' => $verifiedToken->claims()->get('email'),
        ]);
    } catch (\Throwable $e) {
        return response()->json([
            'error' => 'Token invalide',
            'details' => $e->getMessage(),
        ], 401);
    }
});

Route::post('/register-firebase', [FirebaseAuthController::class, 'register']);
Route::post('/complete-profile', [FirebaseAuthController::class, 'completeProfile']);
Route::post('/login-firebase', [FirebaseAuthController::class, 'login']);
Route::get('/me', function (Request $request) {
    return response()->json($request->user());
})->middleware(FirebaseAuthMiddleware::class);
Route::post('/voitures', [VoitureController::class, 'store']);
Route::get('/voitures', [VoitureController::class, 'index']);
Route::post('/voitures/{voiture_intervention_id}/interventions', [VoitureController::class, 'assignIntervention']);
Route::get('/interventions', [InterventionController::class, 'index']);



Route::post('/interventions', [InterventionController::class, 'store']);
Route::get('/interventions', [InterventionController::class, 'index']);
Route::get('/interventions/{id}', [InterventionController::class, 'show']);
Route::put('/interventions/{id}', [InterventionController::class, 'update']);

Route::delete('/interventions/{id}', [InterventionController::class, 'destroy']);
Route::get('/stats', [DashboardController::class, 'getStats']);

Route::get('/list-client', [FrontOfficeController::class, 'list_client']);
Route::get('/ongoing-repairs', [FrontOfficeController::class, 'ongoingRepairsDetails']);
Route::post('/info-client/{clientId}', [FrontOfficeController::class, 'infoClient']);







/*Route::middleware('auth:sanctum')->group(function () {
    Route::get('/voitures', [VoitureController::class, 'index']);
    Route::post('/voitures', [VoitureController::class, 'store']);
    Route::get('/voitures/{id}', [VoitureController::class, 'show']);
    Route::put('/voitures/{id}', [VoitureController::class, 'update']);
    Route::delete('/voitures/{id}', [VoitureController::class, 'destroy']);
});*/
