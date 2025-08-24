
'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Twitter, 
  Linkedin, 
  Mail, 
  Heart,
  Rss,
  ArrowUp
} from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      {/* Newsletter Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="content-container py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Mail className="w-6 h-6 text-primary" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Stay Updated
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Get the latest articles and insights delivered straight to your inbox. 
              Join our community of readers who stay ahead of the curve.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="flex-1"
                required
              />
              <Button type="submit" className="btn-primary">
                Subscribe
              </Button>
            </form>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="content-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">C</span>
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">Cool Blog</span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
              A modern magazine and blog platform featuring insights on technology, design, 
              business, and lifestyle. Stay informed with quality content from industry experts.
            </p>
            <div className="flex items-center space-x-4">
              <Link href="https://twitter.com/coolblog" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm" className="social-icon">
                  <Twitter className="w-5 h-5" />
                  <span className="sr-only">Twitter</span>
                </Button>
              </Link>
              <Link href="https://linkedin.com/company/cool-blog" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm" className="social-icon">
                  <Linkedin className="w-5 h-5" />
                  <span className="sr-only">LinkedIn</span>
                </Button>
              </Link>
              <Link href="/rss.xml">
                <Button variant="ghost" size="sm" className="social-icon">
                  <Rss className="w-5 h-5" />
                  <span className="sr-only">RSS Feed</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/blog" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  All Articles
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Categories</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/category/technology" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  Technology
                </Link>
              </li>
              <li>
                <Link href="/category/design" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  Design
                </Link>
              </li>
              <li>
                <Link href="/category/business" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  Business
                </Link>
              </li>
              <li>
                <Link href="/category/lifestyle" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  Lifestyle
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-gray-700 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
            <span>© 2024 Cool Blog. Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>and Next.js</span>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={scrollToTop}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary"
          >
            <ArrowUp className="w-4 h-4" />
            <span className="text-sm">Back to top</span>
          </Button>
        </div>
      </div>
    </footer>
  );
}
