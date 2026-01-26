import React from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import { ArrowLeft, Save } from 'lucide-react';

interface Role {
    id: number;
    name: string;
}

interface Props {
    roles: Role[];
}

export default function CreateVoteReward({ roles }: PageProps & Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        reward_type: 'money',
        reward_amount: '',
        required_votes: 1,
        is_active: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.votes.rewards.store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Add Vote Reward" />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8 flex items-center gap-4">
                    <Link
                        href={route('admin.votes.rewards.index')}
                        className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 hover:bg-accent"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Add Vote Reward</h1>
                        <p className="text-sm text-muted-foreground">
                            Create a new reward for voters
                        </p>
                    </div>
                </div>

                <div className="mx-auto max-w-2xl rounded-lg border bg-card p-6 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="mb-2 block text-sm font-medium">
                                Reward Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full rounded-lg border border-input bg-background px-4 py-2"
                                placeholder="e.g., 100 Coins for 10 Votes"
                                required
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="description" className="mb-2 block text-sm font-medium">
                                Description
                            </label>
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={2}
                                className="w-full rounded-lg border border-input bg-background px-4 py-2"
                                placeholder="Optional description..."
                            />
                        </div>

                        <div>
                            <label htmlFor="reward_type" className="mb-2 block text-sm font-medium">
                                Reward Type
                            </label>
                            <select
                                id="reward_type"
                                value={data.reward_type}
                                onChange={(e) => setData('reward_type', e.target.value)}
                                className="w-full rounded-lg border border-input bg-background px-4 py-2"
                                required
                            >
                                <option value="money">Money</option>
                                <option value="items">Items</option>
                                <option value="role">Role</option>
                                <option value="command">Command</option>
                            </select>
                            {errors.reward_type && (
                                <p className="mt-1 text-sm text-red-600">{errors.reward_type}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="reward_amount" className="mb-2 block text-sm font-medium">
                                Reward Amount
                            </label>
                            <input
                                id="reward_amount"
                                type="text"
                                value={data.reward_amount}
                                onChange={(e) => setData('reward_amount', e.target.value)}
                                className="w-full rounded-lg border border-input bg-background px-4 py-2"
                                placeholder="Amount, item:count, role_id, or command"
                                required
                            />
                            {errors.reward_amount && (
                                <p className="mt-1 text-sm text-red-600">{errors.reward_amount}</p>
                            )}
                            <p className="mt-1 text-xs text-muted-foreground">
                                {data.reward_type === 'money' && 'Enter the amount of money'}
                                {data.reward_type === 'items' && 'Enter items as: item_id:count,item_id:count'}
                                {data.reward_type === 'role' && 'Enter the role ID'}
                                {data.reward_type === 'command' && 'Enter server command (use {username} for player name)'}
                            </p>
                        </div>

                        <div>
                            <label htmlFor="required_votes" className="mb-2 block text-sm font-medium">
                                Required Votes
                            </label>
                            <input
                                id="required_votes"
                                type="number"
                                min="1"
                                value={data.required_votes}
                                onChange={(e) => setData('required_votes', parseInt(e.target.value) || 1)}
                                className="w-full rounded-lg border border-input bg-background px-4 py-2"
                                required
                            />
                            {errors.required_votes && (
                                <p className="mt-1 text-sm text-red-600">{errors.required_votes}</p>
                            )}
                            <p className="mt-1 text-xs text-muted-foreground">
                                Number of votes required to unlock this reward
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                id="is_active"
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="h-4 w-4 rounded border-input"
                            />
                            <label htmlFor="is_active" className="text-sm font-medium">
                                Active
                            </label>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Link
                                href={route('admin.votes.rewards.index')}
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
                                Create Reward
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
