<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\TodoController;
use App\Models\Todo;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Jobs\ExportProductsToCsv;
use Illuminate\Routing\Middleware\ThrottleRequests;
use Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull;


Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// api endpoint to trigger the export job
Route::prefix('api')->middleware([
    ThrottleRequests::class,
    ConvertEmptyStringsToNull::class,
])->group(function () {
    Route::post('/export-products', function () {
        ExportProductsToCsv::dispatch();
        return response()->json(['message' => 'Product export started.']);
    });
});

Route::get('/dashboard', function () {
    $todos = Todo::all();
    return Inertia::render('Dashboard', ['todos' => $todos]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // route resource todo
    Route::resource('todos', TodoController::class);
    // categories
    Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
    Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::put('/categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');
    // products
    Route::get('/products', [ProductController::class, 'index'])->name('products.index');
    Route::post('/products', [ProductController::class, 'store'])->name('products.store');
    Route::put('/products/{product}', [ProductController::class, 'update'])->name('products.update');
    Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');



});

require __DIR__.'/auth.php';
