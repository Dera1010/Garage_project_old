<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Kreait\Firebase\Auth;
use App\Models\User;
use Kreait\Firebase\Factory;

class FirebaseAuthController extends Controller
{
    public function register(Request $request) {
        $idToken = str_replace('Bearer ', '', $request->header('Authorization'));

        $auth = (new Factory)->withServiceAccount(config('firebase.credentials'))->createAuth();
        $verifiedIdToken = $auth->verifyIdToken($idToken);
        $email = $verifiedIdToken->claims()->get('email');
        $firebaseUid = $verifiedIdToken->claims()->get('user_id');

        User::updateOrCreate(
            ['email' => $email],
            [
                'role' => 'client',
                'firebase_uid' => $firebaseUid
            ]
        );

        return response() -> json(['message' => 'User registered successfully']);
    }

    public function completeProfile(Request $request) {
        $idToken = str_replace('Bearer ', '', $request->header('Authorization'));

        $auth = (new Factory)->withServiceAccount(config('firebase.credentials'))->createAuth();
        $verifiedIdToken = $auth->verifyIdToken($idToken);
        $email = $verifiedIdToken->claims()->get('email'); 

        User::where('email', $email)->update(['name' => $request->name]);

        return response() -> json(['message' => 'Profile completed successfully']);
    }

    public function login(Request $request) {
        $idToken = str_replace('Bearer ', '', $request->header('Authorization'));

        $auth = (new Factory)->withServiceAccount(config('firebase.credentials'))->createAuth();
        $verifiedIdToken = $auth->verifyIdToken($idToken);
        $email = $verifiedIdToken->claims()->get('email');

        $user = User::where('email', $email)->first();

        if (!$user) {
            return response() -> json(['message' => 'User not found'], 404);
        }

        return response() -> json(['message' => 'User logged in successfully', 'user' => $user]);
    }
}
