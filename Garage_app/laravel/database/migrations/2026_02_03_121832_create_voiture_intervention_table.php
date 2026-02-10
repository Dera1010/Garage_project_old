<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('voiture_intervention', function (Blueprint $table) {
            $table->id();

            $table->foreignId('voiture_id')
                  ->constrained('voitures')
                  ->onDelete('cascade');

            $table->foreignId('intervention_id')
                  ->constrained('intervention')
                  ->onDelete('cascade');

            $table->string('status')->default('en attente'); // en attente, en cours, terminé
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('voiture_intervention');
    }
};
