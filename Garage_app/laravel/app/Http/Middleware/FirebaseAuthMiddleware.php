<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Kreait\Firebase\Factory;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class FirebaseAuthMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $authHeader = $request->header('Authorization');

        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json(['message' => 'Token manquant'], 401);
        }

        $idToken = str_replace('Bearer ', '', $authHeader);

        try {
            $firebase = (new Factory)
                ->withServiceAccount(config('firebase.credentials'))
                ->createAuth();

            $verifiedIdToken = $firebase->verifyIdToken($idToken);
            $firebaseUid = $verifiedIdToken->claims()->get('sub');

            $user = User::where('firebase_uid', $firebaseUid)->first();

            if (!$user) {
                return response()->json(['message' => 'Utilisateur non trouvé'], 404);
            }

            Auth::login($user);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Token invalide', 'error' => $e->getMessage()], 401);
        }

        return $next($request);
    }
}
