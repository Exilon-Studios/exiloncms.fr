import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Pencil, Trash2, Plus, Eye } from 'lucide-react';
import { useState } from 'react';

interface Post {
  id: number;
  title: string;
  slug: string;
  status: string;
  type: string;
  published_at: string;
  views_count: number;
  comments_count: number;
  author: { id: number; name: string };
  category: { id: number; name: string } | null;
}

interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface Props {
  posts: {
    data: Post[];
    links: any[];
    meta: Pagination;
  };
}

const statusColors = {
  draft: 'secondary',
  published: 'default',
  scheduled: 'outline',
} as const;

export default function PostsIndex({ posts }: Props) {
  const [processing, setProcessing] = useState<number | null>(null);

  const handleDelete = (post: Post) => {
    if (confirm(`Are you sure you want to delete "${post.title}"?`)) {
      setProcessing(post.id);
      router.delete(route('blog.admin.posts.destroy', post), {
        onFinish: () => setProcessing(null),
      });
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title="Blog Posts" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Blog Posts</h1>
            <p className="text-muted-foreground">Manage your blog posts</p>
          </div>
          <Link href={route('blog.admin.posts.create')}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Button>
          </Link>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Comments</TableHead>
                <TableHead>Published</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.data.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>
                    <Badge variant={statusColors[post.status as keyof typeof statusColors]}>
                      {post.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{post.category?.name || '-'}</TableCell>
                  <TableCell>{post.author.name}</TableCell>
                  <TableCell>{post.views_count}</TableCell>
                  <TableCell>{post.comments_count}</TableCell>
                  <TableCell>
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString()
                      : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={route('blog.show', post)}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={route('blog.admin.posts.edit', post)}>
                        <Button variant="ghost" size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(post)}
                        disabled={processing === post.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination could be added here */}
      </div>
    </AuthenticatedLayout>
  );
}
