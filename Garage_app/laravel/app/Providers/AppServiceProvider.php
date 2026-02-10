<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use App\Models\User;
use App\Models\Voiture;
use App\Models\Intervention;
use App\Models\VoitureIntervention;
use App\Observers\UserObserver;
use App\Observers\VoitureObserver;
use App\Observers\InterventionObserver;
use App\Observers\VoitureInterventionObserver;


class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot()
    {
        User::observe(UserObserver::class);
        Voiture::observe(VoitureObserver::class);
        Intervention::observe(InterventionObserver::class);
        VoitureIntervention::observe(VoitureInterventionObserver::class);
    }
}
