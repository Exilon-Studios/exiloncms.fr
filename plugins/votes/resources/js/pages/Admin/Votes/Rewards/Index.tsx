import React from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Plus, Edit, Trash2, Power, PowerOff, Gift, Coins, Package, Shield, Terminal } from 'lucide-react';

interface Role {
    id: number;
    name: string;
}

interface VoteReward {
    id: number;
    name: string;
    description: string | null;
    reward_type: 'money' | 'items' | 'role' | 'command';
    reward_amount: string;
    required_votes: number;
    is_active: boolean;
    role?: Role | null;
}

interface Props {
    rewards: VoteReward[];
}

export default function VoteRewardsIndex({ rewards }: PageProps & Props) {
    const handleToggle = (reward: VoteReward) => {
        router.post(
            route('admin.votes.rewards.toggle', reward),
            {},
            {
                onSuccess: () => {
                    // Success
                },
            }
        );
    };

    const handleDelete = (reward: VoteReward) => {
        if (confirm(`Are you sure you want to delete "${reward.name}"?`)) {
            router.delete(route('admin.votes.rewards.destroy', reward));
        }
    };

    const getRewardIcon = (type: string) => {
        switch (type) {
            case 'money':
                return Coins;
            case 'items':
                return Package;
            case 'role':
                return Shield;
            case 'command':
                return Terminal;
            default:
                return Gift;
        }
    };

    const getRewardColor = (type: string): string => {
        switch (type) {
            case 'money':
                return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
            case 'items':
                return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
            case 'role':
                return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
            case 'command':
                return 'text-green-600 bg-green-100 dark:bg-green-900/20';
            default:
                return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Vote Rewards" />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Vote Rewards</h1>
                        <p className="text-muted-foreground">
                            Configure rewards players receive for voting
                        </p>
                    </div>
                    <Link
                        href={route('admin.votes.rewards.create')}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
                    >
                        <Plus className="h-4 w-4" />
                        Add Reward
                    </Link>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {rewards.map((reward) => {
                        const Icon = getRewardIcon(reward.reward_type);
                        return (
                            <div
                                key={reward.id}
                                className="relative rounded-lg border bg-card p-6 shadow-sm"
                            >
                                <div className="mb-4 flex items-start justify-between">
                                    <div className={`inline-flex rounded-lg p-3 ${getRewardColor(reward.reward_type)}`}>
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <button
                                        onClick={() => handleToggle(reward)}
                                        className={`rounded-lg p-2 ${
                                            reward.is_active
                                                ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                                                : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900/20'
                                        }`}
                                    >
                                        {reward.is_active ? (
                                            <Power className="h-5 w-5" />
                                        ) : (
                                            <PowerOff className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>

                                <h3 className="mb-2 text-xl font-bold">{reward.name}</h3>

                                {reward.description && (
                                    <p className="mb-4 text-sm text-muted-foreground">
                                        {reward.description}
                                    </p>
                                )}

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Type:</span>
                                        <span className="font-medium capitalize">{reward.reward_type}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Amount:</span>
                                        <span className="font-medium">{reward.reward_amount}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Required Votes:</span>
                                        <span className="font-medium">{reward.required_votes}</span>
                                    </div>
                                </div>

                                <div className="mt-4 flex gap-2">
                                    <Link
                                        href={route('admin.votes.rewards.edit', reward)}
                                        className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg border border-input bg-background px-3 py-2 text-sm hover:bg-accent"
                                    >
                                        <Edit className="h-4 w-4" />
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(reward)}
                                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {rewards.length === 0 && (
                    <div className="rounded-lg border bg-card p-12 text-center">
                        <Gift className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">No rewards configured</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Create rewards to incentivize players to vote for your server
                        </p>
                        <Link
                            href={route('admin.votes.rewards.create')}
                            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
                        >
                            <Plus className="h-4 w-4" />
                            Add Your First Reward
                        </Link>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
