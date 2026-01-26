import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Link } from '@inertiajs/react';

interface Gateway {
  id: number;
  type: string;
  name: string;
  is_active: boolean;
  test_mode: boolean;
  created_at: string;
}

interface AvailableType {
  id: string;
  name: string;
  image: string;
}

interface Props {
  gateways: Gateway[];
  availableTypes: AvailableType[];
}

export default function GatewaysIndex({ gateways, availableTypes }: Props) {
  const [search, setSearch] = useState('');

  const filteredGateways = gateways.filter(gateway =>
    gateway.name.toLowerCase().includes(search.toLowerCase()) ||
    gateway.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AuthenticatedLayout>
      <Head title="Passerelles de paiement" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Passerelles de paiement
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Gérez vos passerelles de paiement pour la boutique
            </p>
          </div>

          <Link
            href={route('admin.shop.gateways.create')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Ajouter une passerelle
          </Link>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGateways.map((gateway) => (
            <div
              key={gateway.id}
              className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {gateway.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {gateway.type}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    {gateway.is_active ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Actif
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                        Inactif
                      </span>
                    )}

                    {gateway.test_mode && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        Test
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Link
                    href={route('admin.shop.gateways.edit', gateway.id)}
                    className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Modifier
                  </Link>

                  <button
                    onClick={() => {
                      if (confirm('Êtes-vous sûr de vouloir supprimer cette passerelle ?')) {
                        router.delete(route('admin.shop.gateways.destroy', gateway.id));
                      }
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {gateways.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              Aucune passerelle de paiement
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Commencez par ajouter une passerelle pour accepter les paiements.
            </p>
            <div className="mt-6">
              <Link
                href={route('admin.shop.gateways.create')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Ajouter une passerelle
              </Link>
            </div>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
