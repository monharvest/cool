
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { formatDistance, format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import PostCard from '@/components/blog/post-card';
import { prisma } from '@/lib/db';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Calendar, 
  Clock, 
  ArrowLeft, 
  Share2, 
  Twitter, 
  Linkedin, 
  Mail,
  Tag,
  User
} from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getPost(slug: string) {
  const post = await prisma.post.findUnique({
    where: { 
      slug,
      status: 'PUBLISHED'
    },
    include: {
      author: true,
      categories: {
        include: {
          category: true,
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  return post;
}

async function getRelatedPosts(postId: string, categoryIds: string[], limit = 3) {
  if (categoryIds?.length === 0) return [];
  
  return await prisma.post.findMany({
    where: {
      id: { not: postId },
      status: 'PUBLISHED',
      categories: {
        some: {
          categoryId: {
            in: categoryIds,
          },
        },
      },
    },
    include: {
      author: true,
      categories: {
        include: {
          category: true,
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
    },
    orderBy: {
      publishedAt: 'desc',
    },
    take: limit,
  });
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const post = await getPost(resolvedParams?.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post?.title} | Cool Blog`,
    description: post?.excerpt || `Read ${post?.title} on Cool Blog`,
    openGraph: {
      title: post?.title,
      description: post?.excerpt || undefined,
      images: post?.featuredImage ? [post.featuredImage] : undefined,
      type: 'article',
      publishedTime: post?.publishedAt?.toISOString(),
      authors: [post?.author?.name],
    },
    twitter: {
      card: 'summary_large_image',
      title: post?.title,
      description: post?.excerpt || undefined,
      images: post?.featuredImage ? [post.featuredImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const resolvedParams = await params;
  const post = await getPost(resolvedParams?.slug);

  if (!post) {
    notFound();
  }

  const categoryIds = post?.categories?.map(pc => pc?.categoryId) ?? [];
  const relatedPosts = await getRelatedPosts(post?.id, categoryIds);

  const formatDate = (date: Date) => {
    return formatDistance(new Date(date), new Date(), { addSuffix: true });
  };

  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      ?.map(word => word?.[0])
      ?.join('')
      ?.toUpperCase() ?? '';
  };

  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/blog/${post?.slug}`;
  const shareTitle = encodeURIComponent(post?.title ?? '');
  const shareText = encodeURIComponent(post?.excerpt ?? '');

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt ?? undefined,
          url: shareUrl,
        });
      } catch (error) {
        console.log('Share cancelled or failed');
      }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Back Button */}
      <div className="content-container py-8">
        <Link href="/blog">
          <Button variant="ghost" className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Blog</span>
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <article className="content-container pb-12">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-6">
          {post?.categories?.map((postCategory) => (
            <Link 
              key={postCategory?.categoryId} 
              href={`/category/${postCategory?.category?.slug}`}
            >
              <Badge 
                variant="secondary"
                className="hover:shadow-sm transition-shadow cursor-pointer"
                style={{ 
                  backgroundColor: `${postCategory?.category?.color}20`, 
                  color: postCategory?.category?.color,
                  borderColor: `${postCategory?.category?.color}30`
                }}
              >
                {postCategory?.category?.name}
              </Badge>
            </Link>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-heading-1 mb-6 prose-readable">
          {post?.title}
        </h1>

        {/* Excerpt */}
        {post?.excerpt && (
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 prose-readable leading-relaxed">
            {post.excerpt}
          </p>
        )}

        {/* Meta Information */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12 pb-8 border-b border-gray-200 dark:border-gray-700">
          {/* Author */}
          <div className="flex items-center space-x-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={post?.author?.avatar || ''} />
              <AvatarFallback>
                {getInitials(post?.author?.name ?? '')}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-400" />
                <p className="font-medium text-gray-900 dark:text-white">
                  {post?.author?.name}
                </p>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{format(new Date(post?.publishedAt ?? new Date()), 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{post?.readingTime} min read</span>
                </div>
              </div>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="flex items-center space-x-2">
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4" />
              </Button>
            )}
            <Link 
              href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm">
                <Twitter className="w-4 h-4" />
              </Button>
            </Link>
            <Link 
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm">
                <Linkedin className="w-4 h-4" />
              </Button>
            </Link>
            <Link 
              href={`mailto:?subject=${shareTitle}&body=${shareText}%0A%0A${encodeURIComponent(shareUrl)}`}
            >
              <Button variant="outline" size="sm">
                <Mail className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Featured Image */}
        {post?.featuredImage && (
          <div className="relative aspect-video bg-muted rounded-xl overflow-hidden mb-12">
            <Image
              src={post.featuredImage}
              alt={post?.title ?? 'Blog post featured image'}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none prose-readable">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => <h1 className="text-heading-1 mb-6 mt-8 first:mt-0">{children}</h1>,
              h2: ({ children }) => <h2 className="text-heading-2 mb-4 mt-8 first:mt-0">{children}</h2>,
              h3: ({ children }) => <h3 className="text-heading-3 mb-4 mt-6 first:mt-0">{children}</h3>,
              h4: ({ children }) => <h4 className="text-heading-4 mb-3 mt-6 first:mt-0">{children}</h4>,
              h5: ({ children }) => <h5 className="text-heading-5 mb-3 mt-4 first:mt-0">{children}</h5>,
              h6: ({ children }) => <h6 className="text-heading-6 mb-3 mt-4 first:mt-0">{children}</h6>,
              p: ({ children }) => <p className="mb-4 text-body leading-relaxed">{children}</p>,
              ul: ({ children }) => <ul className="mb-4 space-y-2 list-disc list-inside">{children}</ul>,
              ol: ({ children }) => <ol className="mb-4 space-y-2 list-decimal list-inside">{children}</ol>,
              li: ({ children }) => <li className="leading-relaxed">{children}</li>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-primary/20 bg-gray-50 dark:bg-gray-800/50 pl-6 py-4 mb-6 italic">
                  {children}
                </blockquote>
              ),
              code: ({ children, className }) => {
                const isInline = !className;
                if (isInline) {
                  return <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md text-sm">{children}</code>;
                }
                return (
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-6">
                    <code className={className}>{children}</code>
                  </pre>
                );
              },
              a: ({ children, href }) => (
                <Link href={href || '#'} className="text-primary hover:text-primary/80 transition-colors underline">
                  {children}
                </Link>
              ),
              img: ({ src, alt }) => (
                <div className="relative w-full my-6">
                  <Image
                    src={src || ''}
                    alt={alt || ''}
                    width={800}
                    height={400}
                    className="rounded-lg w-full h-auto object-cover"
                  />
                </div>
              ),
            }}
          >
            {post?.content ?? ''}
          </ReactMarkdown>
        </div>

        {/* Tags */}
        {post?.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2 mb-4">
              <Tag className="w-5 h-5 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Tags</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((postTag) => (
                <Link 
                  key={postTag?.tagId} 
                  href={`/tag/${postTag?.tag?.slug}`}
                >
                  <Badge 
                    variant="outline" 
                    className="hover:bg-primary/10 hover:border-primary/30 transition-colors cursor-pointer"
                  >
                    #{postTag?.tag?.name}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Author Bio */}
        {post?.author?.bio && (
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
              <div className="flex items-start space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={post.author.avatar || ''} />
                  <AvatarFallback className="text-lg">
                    {getInitials(post.author.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    About {post.author.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {post.author.bio}
                  </p>
                  <div className="flex items-center space-x-4">
                    {post.author.website && (
                      <Link 
                        href={post.author.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm"
                      >
                        Website
                      </Link>
                    )}
                    {post.author.twitter && (
                      <Link 
                        href={`https://twitter.com/${post.author.twitter.replace('@', '')}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm"
                      >
                        Twitter
                      </Link>
                    )}
                    {post.author.linkedin && (
                      <Link 
                        href={`https://linkedin.com/${post.author.linkedin}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm"
                      >
                        LinkedIn
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </article>

      {/* Related Posts */}
      {relatedPosts?.length > 0 && (
        <section className="content-container py-16 border-t border-gray-100 dark:border-gray-800">
          <h2 className="text-heading-2 mb-8">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedPosts.map((relatedPost) => (
              <PostCard key={relatedPost?.id} post={relatedPost} viewMode="grid" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
