<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Services\FirebaseService;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'firebase_uid' => 'required|unique:users,firebase_uid',
            'email' => 'required|email',
        ]);

        $user = User::create([
            'firebase_uid' => $request->firebase_uid,
            'name' => $request->name,
            'email' => $request->email,
            'role' => 'client',
        ]);

        return response()->json($user, 201);
    }

}
