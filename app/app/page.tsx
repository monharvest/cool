
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PostCard from '@/components/blog/post-card';
import { prisma } from '@/lib/db';
import { ArrowRight, TrendingUp, Star, Users } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getFeaturedPosts() {
  return await prisma.post.findMany({
    where: {
      status: 'PUBLISHED',
      featured: true,
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
    take: 3,
  });
}

async function getRecentPosts() {
  return await prisma.post.findMany({
    where: {
      status: 'PUBLISHED',
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
    take: 6,
  });
}

async function getCategories() {
  return await prisma.category.findMany({
    include: {
      _count: {
        select: {
          posts: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });
}

async function getStats() {
  const [totalPosts, totalAuthors] = await Promise.all([
    prisma.post.count({ where: { status: 'PUBLISHED' } }),
    prisma.author.count(),
  ]);

  return {
    totalPosts,
    totalAuthors,
    totalReaders: 12500, // Mock data
    totalViews: 1250000, // Mock data
  };
}

export default async function HomePage() {
  const [featuredPosts, recentPosts, categories, stats] = await Promise.all([
    getFeaturedPosts(),
    getRecentPosts(),
    getCategories(),
    getStats(),
  ]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 lg:py-32">
        <div className="content-container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Star className="w-4 h-4" />
              <span>Welcome to our modern blog platform</span>
            </div>
            
            <h1 className="text-display mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Insights That Shape Tomorrow
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover expert perspectives on technology, design, business, and lifestyle. 
              Stay ahead with thoughtful analysis and practical insights from industry leaders.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/blog">
                <Button size="lg" className="btn-primary">
                  Explore Articles
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg" className="btn-outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
        <div className="content-container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2 count-up">
                {stats.totalPosts}+
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">Articles Published</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2 count-up">
                {stats.totalAuthors}+
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">Expert Authors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2 count-up">
                {(stats.totalReaders / 1000).toFixed(0)}K+
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">Monthly Readers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2 count-up">
                {(stats.totalViews / 1000000).toFixed(1)}M+
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">Total Views</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-20">
        <div className="content-container">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
                <h2 className="text-heading-2">Featured Stories</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Our most popular and impactful articles
              </p>
            </div>
            <Link href="/blog?featured=true">
              <Button variant="outline" className="btn-outline">
                View All Featured
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {featuredPosts?.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post, index) => (
                <PostCard 
                  key={post?.id} 
                  post={post} 
                  viewMode="covers"
                  featured={index === 0}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p>No featured posts available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="content-container">
          <div className="text-center mb-12">
            <h2 className="text-heading-2 mb-4">Explore Categories</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Discover content organized by your interests
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories?.map((category) => (
              <Link key={category?.id} href={`/category/${category?.slug}`}>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 card-shadow hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                  <div 
                    className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center"
                    style={{ backgroundColor: `${category?.color}20` }}
                  >
                    <div 
                      className="w-6 h-6 rounded"
                      style={{ backgroundColor: category?.color }}
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                    {category?.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {category?.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {category?._count?.posts} articles
                    </Badge>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="py-20">
        <div className="content-container">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-heading-2 mb-4">Latest Articles</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Stay updated with our most recent insights
              </p>
            </div>
            <Link href="/blog">
              <Button variant="outline" className="btn-outline">
                View All Posts
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {recentPosts?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.slice(0, 6).map((post) => (
                <PostCard key={post?.id} post={post} viewMode="grid" />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p>No recent posts available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-purple-600 text-white">
        <div className="content-container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Users className="w-6 h-6" />
              <h2 className="text-heading-2">Join Our Community</h2>
            </div>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Connect with like-minded professionals and stay ahead of the curve. 
              Get exclusive insights and early access to our latest content.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact">
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="bg-white text-primary hover:bg-gray-100"
                >
                  Get In Touch
                </Button>
              </Link>
              <Link href="/about">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/10"
                >
                  Learn About Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
