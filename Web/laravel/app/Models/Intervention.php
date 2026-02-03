<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Intervention extends Model
{
    use HasFactory;

    protected $table = 'intervention';

    protected $fillable = [
        'nom',
        'prix',
        'time',
    ];
}
