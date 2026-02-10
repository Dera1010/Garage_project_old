<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('voitures', function (Blueprint $table) {
            $table->id();

            $table->string('user_firebase_uid'); // référence Firebase UID
            $table->string('make');
            $table->string('model');
            $table->string('license_plate')->unique()->nullable();
            $table->string('annee')->nullable();

            $table->timestamps();

            $table->foreign('user_firebase_uid')
                  ->references('firebase_uid')
                  ->on('users')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('voitures');
    }
};
