<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('paiement', function (Blueprint $table) {
            $table->id();

            $table->string('user_firebase_uid')->after('id');

            $table->foreign('user_firebase_uid')
                ->references('firebase_uid')
                ->on('users')
                ->onDelete('cascade');

            $table->decimal('montant', 10, 2);

            $table->string('statut')->default('en attente');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('paiement');
    }
};
