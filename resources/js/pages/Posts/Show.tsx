/**
 * Post Show - Display a single post
 */

import { Head, Link } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, User, Heart, MessageCircle, Share2, ArrowLeft } from 'lucide-react';
import { trans } from '@/lib/i18n';
import { PostWithRelations } from '@/types';

interface PostShowProps {
  post: PostWithRelations;
  auth?: {
    user?: {
      id: number;
    };
  };
}

export default function PostShow({ post, auth }: PostShowProps) {
  const { data, setData, post: submitComment, processing, errors } = useForm({
    content: '',
  });

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    submitComment(route('posts.comments.store', post.id));
  };

  const isLiked = post.likes.some(like => like.user_id === auth?.user?.id);

  const toggleLike = () => {
    if (isLiked) {
      useForm({}).delete(route('posts.like', post.id));
    } else {
      useForm({}).post(route('posts.like', post.id));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <AppLayout>
      <Head title={post.title} />

      <article className="py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back Button */}
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux actualités
          </Link>

          {/* Header */}
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>

            <div className="flex items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span>{post.author.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{formatDate(post.published_at)}</span>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {post.image_url && (
            <div className="mb-12 rounded-2xl overflow-hidden border border-border">
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div
            className="prose prose-lg max-w-none mb-16"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Actions */}
          <div className="flex items-center gap-4 py-6 border-t border-border">
            <Button
              variant={isLiked ? "default" : "outline"}
              size="sm"
              onClick={toggleLike}
              className="gap-2"
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              {post.likes.length} J'aime
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: post.title,
                    url: window.location.href,
                  });
                }
              }}
            >
              <Share2 className="w-4 h-4" />
              Partager
            </Button>
          </div>

          {/* Comments Section */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <MessageCircle className="w-6 h-6" />
              Commentaires ({post.comments.length})
            </h2>

            {/* Comment Form */}
            {auth?.user && (
              <form onSubmit={submitForm} className="mb-12">
                <div className="space-y-4">
                  <Textarea
                    value={data.content}
                    onChange={(e) => setData('content', e.target.value)}
                    placeholder="Écrire un commentaire..."
                    rows={4}
                    className="bg-background"
                  />
                  {errors.content && (
                    <p className="text-sm text-destructive">{errors.content}</p>
                  )}
                  <Button type="submit" disabled={processing}>
                    Publier le commentaire
                  </Button>
                </div>
              </form>
            )}

            {/* Comments List */}
            <div className="space-y-6">
              {post.comments.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Aucun commentaire pour le moment.
                </p>
              ) : (
                post.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-6 bg-card border border-border rounded-xl"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{comment.author.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(comment.created_at)}
                        </p>
                      </div>
                    </div>
                    <p className="text-foreground leading-relaxed">{comment.content}</p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </article>
    </AppLayout>
  );
}
