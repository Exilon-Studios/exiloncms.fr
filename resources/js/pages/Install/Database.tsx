import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { DatabaseConfig } from './types';

interface Props {
  errors?: Record<string, string>;
}

export default function Database({ errors: initialErrors = {} }: Props) {
  const [data, setData] = useState<DatabaseConfig>({
    connection: 'sqlite',
    host: 'localhost',
    port: 3306,
    database: '',
    username: '',
    password: '',
  });
  const [testing, setTesting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>(initialErrors);
  const [testSuccess, setTestSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTesting(true);
    setTestSuccess(false);

    try {
      await router.post(route('install.database.save'), data, {
        onSuccess: () => {
          setTestSuccess(true);
          setTimeout(() => {
            router.visit(route('install.admin'));
          }, 1000);
        },
        onError: (errors) => {
          setErrors(errors as Record<string, string>);
        },
      });
    } finally {
      setTesting(false);
    }
  };

  const isMySQL = data.connection === 'mysql';
  const isPgSQL = data.connection === 'pgsql';
  const isSQLite = data.connection === 'sqlite';

  return (
    <>
      <Head title="Base de données - Installation - ExilonCMS" />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Configuration de la base de données
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Configurez la connexion à votre base de données
            </p>
          </div>

          {/* Success Alert */}
          {testSuccess && (
            <Alert className="mb-6 border-green-200 bg-green-50 dark:bg-green-900/20">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                Connexion réussie ! Redirection...
              </AlertDescription>
            </Alert>
          )}

          {/* Form */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Database Type */}
              <div>
                <Label htmlFor="connection">Type de base de données</Label>
                <select
                  id="connection"
                  value={data.connection}
                  onChange={(e) => setData({ ...data, connection: e.target.value as any })}
                  className="mt-2 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="sqlite">SQLite (Recommandé - Aucune configuration requise)</option>
                  <option value="mysql">MySQL / MariaDB</option>
                  <option value="pgsql">PostgreSQL</option>
                </select>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {isSQLite && 'SQLite utilise un fichier local, aucune configuration supplémentaire nécessaire'}
                  {isMySQL && 'Utilisé par la plupart des hébergements web'}
                  {isPgSQL && 'Base de données performante et robuste'}
                </p>
              </div>

              {/* MySQL/PGSQL Fields */}
              {(isMySQL || isPgSQL) && (
                <>
                  <div>
                    <Label htmlFor="host">Hôte</Label>
                    <Input
                      id="host"
                      type="text"
                      value={data.host}
                      onChange={(e) => setData({ ...data, host: e.target.value })}
                      placeholder="localhost"
                      className="mt-2"
                    />
                    {errors.host && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.host}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="port">Port</Label>
                    <Input
                      id="port"
                      type="number"
                      value={data.port}
                      onChange={(e) => setData({ ...data, port: parseInt(e.target.value) || 3306 })}
                      placeholder={isMySQL ? '3306' : '5432'}
                      className="mt-2"
                    />
                    {errors.port && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.port}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="database">Nom de la base de données</Label>
                    <Input
                      id="database"
                      type="text"
                      value={data.database}
                      onChange={(e) => setData({ ...data, database: e.target.value })}
                      placeholder="exiloncms"
                      className="mt-2"
                    />
                    {errors.database && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.database}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="username">Nom d'utilisateur</Label>
                    <Input
                      id="username"
                      type="text"
                      value={data.username}
                      onChange={(e) => setData({ ...data, username: e.target.value })}
                      placeholder="root"
                      className="mt-2"
                    />
                    {errors.username && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.username}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="password">Mot de passe</Label>
                    <Input
                      id="password"
                      type="password"
                      value={data.password}
                      onChange={(e) => setData({ ...data, password: e.target.value })}
                      placeholder="••••••••"
                      className="mt-2"
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                    )}
                  </div>
                </>
              )}

              {/* SQLite Info */}
              {isSQLite && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>SQLite</strong> sera utilisé. Les données seront stockées dans le fichier
                    <code className="mx-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/40 rounded">database/database.sqlite</code>
                  </p>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <Link href={route('install.requirements')}>
                  <Button type="button" variant="outline">
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Retour
                  </Button>
                </Link>

                <Button type="submit" disabled={testing}>
                  {testing ? (
                    <>
                      <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                      Test de connexion...
                    </>
                  ) : (
                    <>
                      Continuer
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
