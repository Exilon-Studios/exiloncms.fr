import React from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { motion } from 'framer-motion';

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    color: string | null;
    order: number;
}

interface Props {
    category: Category;
}

export default function EditCategory({ category }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: category.name,
        description: category.description || '',
        icon: category.icon || '',
        order: category.order,
        color: category.color || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.docs.categories.update', category));
    };

    const colorOptions = [
        { name: 'Blue', value: 'blue', bg: 'bg-blue-500' },
        { name: 'Green', value: 'green', bg: 'bg-green-500' },
        { name: 'Purple', value: 'purple', bg: 'bg-purple-500' },
        { name: 'Red', value: 'red', bg: 'bg-red-500' },
        { name: 'Orange', value: 'orange', bg: 'bg-orange-500' },
        { name: 'Pink', value: 'pink', bg: 'bg-pink-500' },
    ];

    return (
        <AuthenticatedLayout>
            <Head title={`Edit ${category.name}`} />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8 flex items-center gap-4">
                    <Link
                        href={route('admin.docs.categories.index')}
                        className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 hover:bg-accent"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Edit Category</h1>
                        <p className="text-sm text-muted-foreground">Update category settings</p>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl mx-auto"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="mb-2 block text-sm font-medium">Name</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-lg font-semibold"
                                required
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">Description</label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={3}
                                className="w-full rounded-lg border border-input bg-background px-4 py-2"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">Icon (Emoji)</label>
                            <input
                                type="text"
                                value={data.icon}
                                onChange={(e) => setData('icon', e.target.value)}
                                className="w-full rounded-lg border border-input bg-background px-4 py-2"
                            />
                            <div className="mt-2 text-2xl">{data.icon || 'Preview: 📁'}</div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">Order</label>
                            <input
                                type="number"
                                min="0"
                                value={data.order}
                                onChange={(e) => setData('order', Number(e.target.value))}
                                className="w-full rounded-lg border border-input bg-background px-4 py-2"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">Color</label>
                            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                                {colorOptions.map((color) => (
                                    <label
                                        key={color.value}
                                        className={`flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-all hover:scale-105 ${
                                            data.color === color.value
                                                ? 'border-primary bg-primary/10 ring-2 ring-primary'
                                                : 'border-input hover:border-primary/50'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="color"
                                            value={color.value}
                                            checked={data.color === color.value}
                                            onChange={(e) => setData('color', e.target.value)}
                                            className="sr-only"
                                        />
                                        <span className={`w-6 h-6 rounded ${color.bg}`}></span>
                                        <span className="text-sm">{color.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-4 border-t">
                            <Link
                                href={route('admin.docs.categories.index')}
                                className="rounded-lg border border-input px-4 py-2 hover:bg-accent"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                            >
                                <Save className="h-4 w-4" />
                                Save Changes
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}
