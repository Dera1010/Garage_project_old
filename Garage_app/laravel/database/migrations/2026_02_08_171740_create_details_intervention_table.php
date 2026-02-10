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
        Schema::create('details_intervention', function (Blueprint $table) {
            $table->id();
            $table->foreignId('voiture_intervention_id')
                ->constrained('voiture_intervention')
                ->cascadeOnDelete();
            $table->foreignId('intervention_id')
                ->constrained('intervention')
                ->cascadeOnDelete();
            $table->string('status')->default('En attente');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('details_intervention');
    }
};
