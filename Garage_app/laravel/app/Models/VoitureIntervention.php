<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VoitureIntervention extends Model
{
    use HasFactory;

    protected $table = 'voiture_intervention';

    protected $fillable = [
        'voiture_id',
        'status',
    ];

    public function voiture()
    {
        return $this->belongsTo(Voiture::class, 'voiture_id');
    }

    public function details()
    {
        return $this->hasMany(DetailsIntervention::class, 'voiture_intervention_id');
    }
}
