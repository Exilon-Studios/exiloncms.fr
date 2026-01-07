import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Bell, Send, ArrowLeft } from 'lucide-react';
import { Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Props {
  users: User[];
}

const levelOptions = [
  { value: 'info', label: 'Info', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  { value: 'success', label: 'Succès', color: 'bg-green-500/10 text-green-500 border-green-500/20' },
  { value: 'warning', label: 'Attention', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
  { value: 'danger', label: 'Erreur', color: 'bg-red-500/10 text-red-500 border-red-500/20' },
];

export default function AdminNotificationCreate({ users }: Props) {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  const { data, setData, post, processing, errors } = useForm({
    target_type: 'all',
    target_users: [] as number[],
    target_role: '',
    level: 'info',
    content: '',
    link: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.notifications.store'));
  };

  const toggleUser = (userId: number) => {
    setSelectedUsers(prev => {
      const newSelected = prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId];

      setData('target_users', newSelected);

      return newSelected;
    });
  };

  const selectAllUsers = () => {
    const allUserIds = users.map(u => u.id);
    setSelectedUsers(allUserIds);
    setData('target_users', allUserIds);
  };

  const clearAllUsers = () => {
    setSelectedUsers([]);
    setData('target_users', []);
  };

  return (
    <AuthenticatedLayout>
      <Head title="Envoyer une notification" />

      <div className="container mx-auto py-8 px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <Link href={route('admin.notifications.index')}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="p-3 rounded-lg bg-primary/10">
              <Bell className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Envoyer une notification</h1>
              <p className="text-muted-foreground">
                Créer et envoyer une notification aux utilisateurs
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Target Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Destinataires</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Target Type */}
                <div>
                  <Label>Type de destinataire</Label>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    {[
                      { value: 'all', label: 'Tous les utilisateurs', description: 'Envoyer à tous les utilisateurs' },
                      { value: 'users', label: 'Utilisateurs spécifiques', description: 'Sélectionner les utilisateurs' },
                      { value: 'role', label: 'Par rôle', description: 'Envoyer à un rôle spécifique' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setData('target_type', option.value as any)}
                        className={`p-4 border rounded-lg text-left transition-colors ${
                          data.target_type === option.value
                            ? 'border-primary bg-primary/5'
                            : 'hover:bg-muted/50'
                        }`}
                      >
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-muted-foreground">{option.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Specific Users */}
                {data.target_type === 'users' && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Utilisateurs</Label>
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={selectAllUsers}>
                          Tout sélectionner
                        </Button>
                        <Button type="button" variant="outline" size="sm" onClick={clearAllUsers}>
                          Effacer
                        </Button>
                      </div>
                    </div>
                    <div className="border rounded-lg p-4 max-h-64 overflow-y-auto space-y-2">
                      {users.map((user) => (
                        <label
                          key={user.id}
                          className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => toggleUser(user.id)}
                            className="h-4 w-4"
                          />
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                    {errors.target_users && (
                      <p className="text-sm text-destructive mt-1">{errors.target_users}</p>
                    )}
                  </div>
                )}

                {/* Role Selection */}
                {data.target_type === 'role' && (
                  <div>
                    <Label>Rôle</Label>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      {['admin', 'moderator', 'user'].map((role) => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => setData('target_role', role)}
                          className={`p-4 border rounded-lg text-center transition-colors capitalize ${
                            data.target_role === role
                              ? 'border-primary bg-primary/5'
                              : 'hover:bg-muted/50'
                          }`}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                    {errors.target_role && (
                      <p className="text-sm text-destructive mt-1">{errors.target_role}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Content */}
            <Card>
              <CardHeader>
                <CardTitle>Contenu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Level */}
                <div>
                  <Label>Niveau d'importance</Label>
                  <div className="grid grid-cols-4 gap-4 mt-2">
                    {levelOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setData('level', option.value as any)}
                        className={`p-4 border rounded-lg text-center transition-colors ${
                          data.level === option.value
                            ? 'border-primary bg-primary/5'
                            : 'hover:bg-muted/50'
                        }`}
                      >
                        <Badge variant="outline" className={option.color}>
                          {option.label}
                        </Badge>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <Label htmlFor="content">Message</Label>
                  <Textarea
                    id="content"
                    value={data.content}
                    onChange={(e) => setData('content', e.target.value)}
                    placeholder="Entrez le message de la notification..."
                    rows={4}
                    className="mt-2"
                  />
                  {errors.content && (
                    <p className="text-sm text-destructive mt-1">{errors.content}</p>
                  )}
                </div>

                {/* Link */}
                <div>
                  <Label htmlFor="link">Lien (optionnel)</Label>
                  <Input
                    id="link"
                    type="url"
                    value={data.link}
                    onChange={(e) => setData('link', e.target.value)}
                    placeholder="https://exemple.com"
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Lien vers lequel l'utilisateur sera redirigé en cliquant sur la notification
                  </p>
                  {errors.link && (
                    <p className="text-sm text-destructive mt-1">{errors.link}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex justify-end gap-4">
              <Link href={route('admin.notifications.index')}>
                <Button type="button" variant="outline">
                  Annuler
                </Button>
              </Link>
              <Button type="submit" disabled={processing} className="gap-2">
                <Send className="h-4 w-4" />
                Envoyer la notification
              </Button>
            </div>
          </div>
        </form>
      </div>
    </AuthenticatedLayout>
  );
}
