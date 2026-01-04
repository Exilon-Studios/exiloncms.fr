import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface LandingSetting {
    id: number;
    key: string;
    value: string;
    type: string;
    group: string;
    order: number;
}

interface Props {
    settings: {
        [group: string]: LandingSetting[];
    };
}

export default function ThemeSettingsIndex({ settings }: Props) {
    const flatSettings = Object.values(settings).flat();

    const { data, setData, post, processing, errors } = useForm({
        settings: flatSettings.map(s => ({ id: s.id, value: s.value })),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.theme-settings.update'));
    };

    const updateSetting = (id: number, value: string) => {
        setData('settings', data.settings.map(s =>
            s.id === id ? { ...s, value } : s
        ));
    };

    const renderInput = (setting: LandingSetting) => {
        const value = data.settings.find(s => s.id === setting.id)?.value || '';

        switch (setting.type) {
            case 'textarea':
                return (
                    <Textarea
                        value={value}
                        onChange={(e) => updateSetting(setting.id, e.target.value)}
                        rows={3}
                    />
                );
            default:
                return (
                    <Input
                        type="text"
                        value={value}
                        onChange={(e) => updateSetting(setting.id, e.target.value)}
                    />
                );
        }
    };

    const getGroupTitle = (group: string) => {
        const titles: Record<string, string> = {
            hero: 'Section Héro',
            features: 'Section Fonctionnalités',
            social: 'Liens Sociaux',
        };
        return titles[group] || group;
    };

    const getLabel = (key: string) => {
        const parts = key.split('.');
        return parts[parts.length - 1].charAt(0).toUpperCase() + parts[parts.length - 1].slice(1);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Paramètres du Thème" />

            <div className="container mx-auto py-8 px-4 max-w-5xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Paramètres du Thème</h1>
                    <p className="text-muted-foreground mt-2">
                        Personnalisez le contenu de votre page d'accueil
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {Object.entries(settings).map(([group, groupSettings]) => (
                        <Card key={group}>
                            <CardHeader>
                                <CardTitle>{getGroupTitle(group)}</CardTitle>
                                <CardDescription>
                                    Configurez les éléments de la section {getGroupTitle(group).toLowerCase()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {groupSettings.map((setting, index) => (
                                    <div key={setting.id}>
                                        <Label htmlFor={`setting-${setting.id}`} className="text-sm font-medium">
                                            {setting.key}
                                        </Label>
                                        <div className="mt-1.5">
                                            {renderInput(setting)}
                                        </div>
                                        {errors[`settings.${index}.value`] && (
                                            <p className="text-sm text-destructive mt-1">
                                                {errors[`settings.${index}.value`]}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    ))}

                    <div className="flex justify-end gap-4 pt-4">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Enregistrement...' : 'Enregistrer les modifications'}
                        </Button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
