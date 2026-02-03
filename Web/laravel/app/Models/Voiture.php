<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Voiture extends Model
{
    use HasFactory;

    protected $fillable = ['user_firebase_uid', 'make', 'model', 'license_plate', 'annee'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_firebase_uid', 'firebase_uid');
    }

    public function interventions()
{
    return $this->belongsToMany(
        Intervention::class,
        'voiture_intervention',
        'voiture_id',
        'intervention_id'
    )->withPivot('status')->withTimestamps();
}

}
