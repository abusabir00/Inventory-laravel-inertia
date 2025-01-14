import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function Index() {
    const { categories, flash } = usePage().props;
    const { data, setData, post, put, delete: destroy, reset } = useForm({
        name: '',
        parent_id: '',
    });

    const [editingCategory, setEditingCategory] = useState(null);

    const submit = (e) => {
        e.preventDefault();
        if (editingCategory) {
            put(`/categories/${editingCategory.id}`, { onSuccess: () => reset() });
        } else {
            post('/categories', { onSuccess: () => reset() });
        }
        setEditingCategory(null);
    };

    const editCategory = (category) => {
        setEditingCategory(category);
        setData({ name: category.name, parent_id: category.parent_id || '' });
    };

    const deleteCategory = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                destroy(`/categories/${id}`);
            }
        });
    };

    
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Category
                </h2>
            }
        >
            <Head title="Category" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            
                            <div className="p-6">
                                <h1 className="mb-4 text-2xl font-bold">Categories</h1>

                                {flash?.success && <div className="p-2 mb-4 text-white bg-green-500 rounded">{flash.success}</div>}

                                <form onSubmit={submit} className="mb-6">
                                    <div className="mb-4">
                                        <input
                                            type="text"
                                            placeholder="Category Name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="w-full p-2 border rounded"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <select
                                            value={data.parent_id}
                                            onChange={(e) => setData('parent_id', e.target.value)}
                                            className="w-full p-2 border rounded"
                                        >
                                            <option value="">No Parent</option>
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                                    >
                                        {editingCategory ? 'Update Category' : 'Add Category'}
                                    </button>
                                </form>

                                <ul>
                                    {categories.map((category) => (
                                        <li key={category.id} className="p-4 border-b">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h2 className="text-xl">{category.name}</h2>
                                                    <ul>
                                                        {category.children.map((child) => (
                                                            <li key={child.id} className="ml-4">
                                                                {child.name}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div>
                                                    <button
                                                        onClick={() => editCategory(category)}
                                                        className="px-4 py-2 mr-2 text-white bg-yellow-500 rounded"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => deleteCategory(category.id)}
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
