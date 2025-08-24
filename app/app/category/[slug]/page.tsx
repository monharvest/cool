
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PostCard from '@/components/blog/post-card';
import { prisma } from '@/lib/db';
import { ArrowLeft, Hash, FileText } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getCategory(slug: string) {
  return await prisma.category.findUnique({
    where: { slug },
    include: {
      _count: {
        select: {
          posts: {
            where: {
              post: {
                status: 'PUBLISHED',
              },
            },
          },
        },
      },
    },
  });
}

async function getCategoryPosts(categoryId: string, limit = 20) {
  return await prisma.post.findMany({
    where: {
      status: 'PUBLISHED',
      categories: {
        some: {
          categoryId: categoryId,
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
  const category = await getCategory(resolvedParams?.slug);
  
  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: `${category?.name} Articles | Cool Blog`,
    description: category?.description || `Read articles about ${category?.name} on Cool Blog`,
    openGraph: {
      title: `${category?.name} Articles`,
      description: category?.description || undefined,
      type: 'website',
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const resolvedParams = await params;
  const category = await getCategory(resolvedParams?.slug);

  if (!category) {
    notFound();
  }

  const posts = await getCategoryPosts(category?.id);

  return (
    <div className="min-h-screen py-20">
      <div className="content-container">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/blog">
            <Button variant="ghost" className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Blog</span>
            </Button>
          </Link>
        </div>

        {/* Category Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: `${category?.color}20` }}
            >
              <Hash 
                className="w-8 h-8" 
                style={{ color: category?.color }}
              />
            </div>
          </div>
          
          <h1 className="text-heading-1 mb-4">{category?.name}</h1>
          
          {category?.description && (
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed mb-6">
              {category.description}
            </p>
          )}

          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>{category?._count?.posts} articles</span>
            </div>
            <Badge 
              variant="secondary"
              style={{ 
                backgroundColor: `${category?.color}20`, 
                color: category?.color,
                borderColor: `${category?.color}30`
              }}
            >
              {category?.name}
            </Badge>
          </div>
        </div>

        {/* Posts */}
        {posts?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post?.id} post={post} viewMode="grid" />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No articles found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                There are no published articles in this category yet. 
                Check back soon for new content!
              </p>
              <Link href="/blog">
                <Button className="btn-primary">
                  Browse All Articles
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Load More (future enhancement) */}
        {posts?.length >= 20 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="btn-outline">
              Load More Articles
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
