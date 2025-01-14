import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function Index() {
    const { products, categories, flash } = usePage().props;
    const { data, setData, post, put, delete: destroy, reset } = useForm({
        name: '',
        description: '',
        price: '',
        quantity: '',
        category_id: '',
    });

    const [editingProduct, setEditingProduct] = useState(null);

    const submit = (e) => {
        e.preventDefault();
        if (editingProduct) {
            put(`/products/${editingProduct.id}`, { onSuccess: () => reset() });
        } else {
            post('/products', { onSuccess: () => reset() });
        }
        setEditingProduct(null);
    };

    const editProduct = (product) => {
        setEditingProduct(product);
        setData({
            name: product.name,
            description: product.description,
            price: product.price,
            quantity: product.quantity,
            category_id: product.category_id,
        });
    };

    const deleteProduct = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                destroy(`/products/${id}`);
            }
        });
    };

    
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Products
                </h2>
            }
        >
            <Head title="Products" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            
                            <div className="p-6">
                                <h1 className="mb-4 text-2xl font-bold">Products</h1>

                                {flash?.success && <div className="p-2 mb-4 text-white bg-green-500 rounded">{flash.success}</div>}

                                <form onSubmit={submit} className="mb-6">
                                    <input
                                        type="text"
                                        placeholder="Product Name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full p-2 mb-4 border rounded"
                                    />
                                    <textarea
                                        placeholder="Description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className="w-full p-2 mb-4 border rounded"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Price"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        className="w-full p-2 mb-4 border rounded"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Quantity"
                                        value={data.quantity}
                                        onChange={(e) => setData('quantity', e.target.value)}
                                        className="w-full p-2 mb-4 border rounded"
                                    />
                                    <select
                                        value={data.category_id}
                                        onChange={(e) => setData('category_id', e.target.value)}
                                        className="w-full p-2 mb-4 border rounded"
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                                    >
                                        {editingProduct ? 'Update Product' : 'Add Product'}
                                    </button>
                                </form>

                                <ul>
                                    {products.map((product) => (
                                        <li key={product.id} className="p-4 border-b">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h2 className="text-xl">{product.name}</h2>
                                                    <p>{product.description}</p>
                                                    <p>Price: ${product.price}</p>
                                                    <p>Quantity: {product.quantity}</p>
                                                    <p>Category: {product.category.name}</p>
                                                </div>
                                                <div>
                                                    <button
                                                        onClick={() => editProduct(product)}
                                                        className="px-4 py-2 mr-2 text-white bg-yellow-500 rounded"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => deleteProduct(product.id)}
                                                        className="px-4 py-2 text-white bg-red-500 rounded"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>


                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
