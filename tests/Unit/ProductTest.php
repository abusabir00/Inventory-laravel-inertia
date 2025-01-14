<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_create_a_product()
    {
        $category = Category::factory()->create();
        $data = [
            'name' => 'Laptop',
            'description' => 'High-performance laptop',
            'price' => 1500,
            'quantity' => 10,
            'category_id' => $category->id,
        ];

        $response = $this->post(route('products.store'), $data);

        $response->assertStatus(201);
        $this->assertDatabaseHas('products', $data);
    }

    /** @test */
    public function it_can_retrieve_a_product()
    {
        $product = Product::factory()->create();

        $response = $this->get(route('products.show', $product->id));

        $response->assertStatus(200)
                 ->assertJson([
                     'name' => $product->name,
                     'description' => $product->description,
                     'price' => $product->price,
                     'quantity' => $product->quantity,
                 ]);
    }

    /** @test */
    public function it_can_update_a_product()
    {
        $product = Product::factory()->create();
        $data = [
            'name' => 'Updated Laptop',
            'description' => 'Updated description',
            'price' => 2000,
            'quantity' => 5,
        ];

        $response = $this->put(route('products.update', $product->id), $data);

        $response->assertStatus(200);
        $this->assertDatabaseHas('products', $data);
    }

    /** @test */
    public function it_can_delete_a_product()
    {
        $product = Product::factory()->create();

        $response = $this->delete(route('products.destroy', $product->id));

        $response->assertStatus(200);
        $this->assertDatabaseMissing('products', ['id' => $product->id]);
    }
}
