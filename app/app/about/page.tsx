
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { prisma } from '@/lib/db';
import { 
  Users, 
  Target, 
  Heart, 
  Award, 
  Mail, 
  Twitter, 
  Linkedin,
  Globe,
  BookOpen,
  TrendingUp,
  Lightbulb
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'About Us | Cool Blog',
  description: 'Learn about our mission to share quality insights on technology, design, business, and lifestyle. Meet our team of expert writers and contributors.',
  openGraph: {
    title: 'About Cool Blog',
    description: 'Learn about our mission to share quality insights on technology, design, business, and lifestyle.',
    type: 'website',
  },
};

async function getAuthors() {
  return await prisma.author.findMany({
    include: {
      _count: {
        select: {
          posts: {
            where: {
              status: 'PUBLISHED',
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
}

async function getStats() {
  const [totalPosts, totalCategories, totalViews] = await Promise.all([
    prisma.post.count({ where: { status: 'PUBLISHED' } }),
    prisma.category.count(),
    Promise.resolve(1250000), // Mock data
  ]);

  return {
    totalPosts,
    totalCategories,
    totalViews,
    totalReaders: 12500, // Mock data
  };
}

export default async function AboutPage() {
  const [authors, stats] = await Promise.all([
    getAuthors(),
    getStats(),
  ]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 lg:py-32">
        <div className="content-container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-heading-1 mb-6">About Cool Blog</h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              We're passionate about sharing insights that matter. Our platform brings together 
              expert perspectives on technology, design, business, and lifestyle to help you 
              stay informed and inspired.
            </p>
            
            <Link href="/contact">
              <Button size="lg" className="btn-primary">
                Get In Touch
                <Mail className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
        <div className="content-container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2 count-up">
                {stats.totalPosts}+
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">Articles Published</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2 count-up">
                {authors?.length}+
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">Expert Writers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2 count-up">
                {(stats.totalReaders / 1000).toFixed(0)}K+
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">Monthly Readers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2 count-up">
                {(stats.totalViews / 1000000).toFixed(1)}M+
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">Total Views</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="content-container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center space-x-2 mb-6">
                <Target className="w-8 h-8 text-primary" />
                <h2 className="text-heading-2">Our Mission</h2>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                To democratize access to quality insights and knowledge, empowering individuals 
                and organizations to make informed decisions and stay ahead in an ever-evolving world.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="card-shadow hover:shadow-lg transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Lightbulb className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Quality Content</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We curate and create high-quality, well-researched content that provides 
                    real value to our readers.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-shadow hover:shadow-lg transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Expert Authors</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Our content is created by industry experts with proven track records 
                    in their respective fields.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-shadow hover:shadow-lg transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Cutting Edge</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We stay ahead of trends and emerging topics to bring you the latest 
                    insights before they become mainstream.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="content-container">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Award className="w-8 h-8 text-primary" />
              <h2 className="text-heading-2">Meet Our Team</h2>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Our diverse team of writers, editors, and contributors brings together expertise 
              from various industries to deliver well-rounded perspectives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {authors?.map((author) => (
              <Card key={author?.id} className="card-shadow hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-6">
                      {author?.avatar ? (
                        <Image
                          src={author.avatar}
                          alt={author?.name ?? 'Author'}
                          fill
                          className="object-cover rounded-full"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-xl">
                            {author?.name?.split(' ')?.map(n => n?.[0])?.join('')}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {author?.name}
                    </h3>
                    
                    {author?.bio && (
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                        {author.bio}
                      </p>
                    )}

                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <Badge variant="secondary" className="text-xs">
                        <BookOpen className="w-3 h-3 mr-1" />
                        {author?._count?.posts} articles
                      </Badge>
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center justify-center space-x-3">
                      {author?.website && (
                        <Link 
                          href={author.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-primary transition-colors"
                        >
                          <Globe className="w-5 h-5" />
                        </Link>
                      )}
                      {author?.twitter && (
                        <Link 
                          href={`https://twitter.com/${author.twitter.replace('@', '')}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-primary transition-colors"
                        >
                          <Twitter className="w-5 h-5" />
                        </Link>
                      )}
                      {author?.linkedin && (
                        <Link 
                          href={`https://linkedin.com/${author.linkedin}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-primary transition-colors"
                        >
                          <Linkedin className="w-5 h-5" />
                        </Link>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-purple-600 text-white">
        <div className="content-container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-heading-2 mb-6">Let's Connect</h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Have questions, suggestions, or want to contribute to our platform? 
              We'd love to hear from you and explore how we can work together.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact">
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="bg-white text-primary hover:bg-gray-100"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Contact Us
                </Button>
              </Link>
              <Link href="/blog">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/10"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Read Our Blog
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
