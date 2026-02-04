import React, { useState } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Plus, Edit, Trash2, Languages, FileText, Download } from 'lucide-react';
import { trans } from '@/lib/i18n';

interface TranslationEntry {
    id: number;
    locale: string;
    group: string;
    key: string;
    value: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    translations: TranslationEntry[];
    locales: string[];
    groups: string[];
    locale: string;
    group: string | null;
}

export default function TranslationsIndex({ translations, locales, groups, locale, group }: PageProps & Props) {
    const [selectedLocale, setSelectedLocale] = useState(locale);
    const [selectedGroup, setSelectedGroup] = useState(group || 'all');
    const [searchTerm, setSearchTerm] = useState('');

    const handleLocaleChange = (newLocale: string) => {
        router.get(route('admin.translations.index'), { locale: newLocale, group: selectedGroup }, { preserveState: true });
        setSelectedLocale(newLocale);
    };

    const handleGroupChange = (newGroup: string) => {
        router.get(route('admin.translations.index'), { locale: selectedLocale, group: newGroup }, { preserveState: true });
        setSelectedGroup(newGroup);
    };

    const handleDelete = (id: number) => {
        if (confirm(trans('admin.translations.index.delete_confirm'))) {
            router.delete(route('admin.translations.destroy', { group: selectedGroup, key: '', locale: selectedLocale, id }));
        }
    };

    const handleExport = () => {
        router.get(route('admin.translations.export', { locale: selectedLocale }));
    };

    const filteredTranslations = translations.filter(t => {
        const matchesSearch = t.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.value.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGroup = selectedGroup === 'all' || t.group === selectedGroup;
        return matchesSearch && matchesGroup;
    });

    const groupedTranslations = filteredTranslations.reduce((acc, t) => {
        if (!acc[t.group]) acc[t.group] = [];
        acc[t.group].push(t);
        return acc;
    }, {} as Record<string, TranslationEntry[]>);

    return (
        <AuthenticatedLayout>
            <Head title={trans('admin.translations.index.title')} />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">{trans('admin.translations.index.title')}</h1>
                        <p className="text-muted-foreground">
                            {trans('admin.translations.index.description')}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleExport}
                            className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 hover:bg-accent"
                        >
                            <Download className="h-4 w-4" />
                            {trans('admin.translations.index.export')}
                        </button>
                        <Link
                            href={route('admin.translations.create')}
                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
                        >
                            <Plus className="h-4 w-4" />
                            {trans('admin.translations.index.add')}
                        </Link>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-6 flex flex-wrap gap-4 rounded-lg border bg-card p-4">
                    <div className="flex-1">
                        <label className="mb-2 block text-sm font-medium">{trans('admin.translations.index.language')}</label>
                        <select
                            value={selectedLocale}
                            onChange={(e) => handleLocaleChange(e.target.value)}
                            className="w-full rounded-lg border border-input bg-background px-4 py-2"
                        >
                            {locales.map((loc) => (
                                <option key={loc} value={loc}>
                                    {loc.toUpperCase()}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex-1">
                        <label className="mb-2 block text-sm font-medium">{trans('admin.translations.index.group')}</label>
                        <select
                            value={selectedGroup}
                            onChange={(e) => handleGroupChange(e.target.value)}
                            className="w-full rounded-lg border border-input bg-background px-4 py-2"
                        >
                            <option value="all">{trans('admin.translations.index.all_groups')}</option>
                            {groups.map((grp) => (
                                <option key={grp} value={grp}>
                                    {grp}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex-1">
                        <label className="mb-2 block text-sm font-medium">{trans('admin.translations.index.search')}</label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={trans('admin.translations.index.search_placeholder')}
                            className="w-full rounded-lg border border-input bg-background px-4 py-2"
                        />
                    </div>
                </div>

                {/* Translations by group */}
                {Object.entries(groupedTranslations).map(([groupName, entries]) => (
                    <div key={groupName} className="mb-8 rounded-lg border bg-card p-6 shadow-sm">
                        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
                            <FileText className="h-5 w-5" />
                            {groupName}
                        </h2>
                        <div className="space-y-3">
                            {entries.map((entry) => (
                                <div
                                    key={entry.id}
                                    className="flex items-start justify-between rounded-lg border p-4 hover:bg-muted/50"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-sm font-medium text-primary">
                                                {entry.key}
                                            </span>
                                            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                                {entry.locale}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {entry.value}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link
                                            href={route('admin.translations.edit', entry.id)}
                                            className="inline-flex items-center gap-1 rounded-lg border border-input bg-background px-3 py-1 text-sm hover:bg-accent"
                                        >
                                            <Edit className="h-4 w-4" />
                                            {trans('admin.translations.index.edit')}
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(entry.id)}
                                            className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-1 text-sm text-red-700 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {filteredTranslations.length === 0 && (
                    <div className="rounded-lg border bg-card p-12 text-center">
                        <Languages className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">{trans('admin.translations.index.empty_title')}</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            {trans('admin.translations.index.empty_description')}
                        </p>
                        <div className="mt-4 flex justify-center gap-2">
                            <Link
                                href={route('admin.translations.create')}
                                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
                            >
                                <Plus className="h-4 w-4" />
                                {trans('admin.translations.index.add')}
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
