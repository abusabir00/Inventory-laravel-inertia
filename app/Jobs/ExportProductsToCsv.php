<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\Product;
use Illuminate\Support\Facades\Storage;

class ExportProductsToCsv implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $timeout = 120;

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        // Fetch all products
        $products = Product::all();

        // Define the CSV file path
        $fileName = 'exports/products_' . now()->format('Y_m_d_His') . '.csv';
        $filePath = storage_path('app/' . $fileName);

        // Open a file in write mode
        $file = fopen($filePath, 'w');

        // Write the header row
        fputcsv($file, ['ID', 'Name', 'Description', 'Price', 'Quantity', 'Category']);

        // Write the product rows
        foreach ($products as $product) {
            fputcsv($file, [
                $product->id,
                $product->name,
                $product->description,
                $product->price,
                $product->quantity,
                $product->category->name ?? 'N/A',
            ]);
        }

        // Close the file
        fclose($file);

        // Store the file in storage
        Storage::put($fileName, file_get_contents($filePath));

        // Optionally delete the file from local storage
        unlink($filePath);
    }
}
