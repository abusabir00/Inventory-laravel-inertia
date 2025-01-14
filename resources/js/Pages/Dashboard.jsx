import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout headerName={'Dashboard'}>

            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">

                            <div className="p-2 mb-4 text-white bg-green-500 rounded">Welcome to the Admin Dashboard</div>

                        </div>
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    );
}
