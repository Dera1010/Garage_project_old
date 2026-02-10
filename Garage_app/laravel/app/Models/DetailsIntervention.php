<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetailsIntervention extends Model
{
    use HasFactory;

    protected $table = 'details_intervention';

    protected $fillable = [
        'voiture_intervention_id',
        'intervention_id',
        'status',
    ];

    public function voitureIntervention()
    {
        return $this->belongsTo(VoitureIntervention::class, 'voiture_intervention_id');
    }

    public function intervention()
    {
        return $this->belongsTo(Intervention::class, 'intervention_id');
    }
}
