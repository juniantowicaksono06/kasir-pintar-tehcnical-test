<?php

use App\Http\Controllers\api\v1\ExampleController;

use App\Http\Controllers\api\v1\AuthController;
use App\Http\Controllers\api\v1\ImageUploadController;
use App\Http\Controllers\api\v1\UsersController;
use App\Http\Controllers\api\v1\VerifyController;
use App\Http\Controllers\api\v1\ReimbursementController;

/*
|--------------------------------------------------------------------------
| API v1 Routes
|--------------------------------------------------------------------------
|
| This file contains all of the v1 routes.
| This file is loaded and the routes are pre-pended automatically 
| by App\Providers\RouteServiceProvider->boot()
|
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/upload_image', [ImageUploadController::class, 'upload']);
Route::middleware(['jwt.cookie'])->group(function() {
    Route::get('/verify', [VerifyController::class, 'get']);
    Route::get('/logout', [AuthController::class, 'logout']);
    
    Route::get('/users', [UsersController::class, 'get']);
    Route::get('/users/{id}', [UsersController::class, 'read']);
    Route::post('/users', [UsersController::class, 'create']);
    Route::delete('/users/{id}', [UsersController::class, 'delete']);
    Route::post('/users/activate/{id}', [UsersController::class, 'activate']);
    Route::post('/users/edit/{id}', [UsersController::class, 'edit']);

    Route::post('/reimbursement/submit', [ReimbursementController::class, 'create']);
    Route::post('/reimbursement/approve/{id}', [ReimbursementController::class, 'approve']);
    Route::post('/reimbursement/reject/{id}', [ReimbursementController::class, 'reject']);

    Route::get('/reimbursement', [ReimbursementController::class, 'get']);
});
