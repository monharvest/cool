
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PostCard from '@/components/blog/post-card';
import ViewToggle from '@/components/blog/view-toggle';
import { Search, Filter, X } from 'lucide-react';
import type { Post, ViewMode } from '@/lib/types';

function SearchContent() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get('q') || '';

  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = async (query: string) => {
    if (!query?.trim()) {
      setPosts([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/posts?search=${encodeURIComponent(query)}`);
      if (response?.ok) {
        const data = await response.json();
        setPosts(data?.posts || []);
      }
    } catch (error) {
      console.error('Search error:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
    
    // Update URL
    const url = new URL(window.location.href);
    if (searchQuery?.trim()) {
      url.searchParams.set('q', searchQuery);
    } else {
      url.searchParams.delete('q');
    }
    window.history.pushState({}, '', url.toString());
  };

  const clearSearch = () => {
    setSearchQuery('');
    setPosts([]);
    const url = new URL(window.location.href);
    url.searchParams.delete('q');
    window.history.pushState({}, '', url.toString());
  };

  return (
    <div className="min-h-screen py-20">
      <div className="content-container">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-heading-1 mb-4">Search Articles</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Find articles across technology, design, business, and lifestyle topics.
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 card-shadow mb-8">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for articles, topics, or authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 p-2 h-auto"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            <Button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </form>
        </div>

        {/* Search Results */}
        {searchQuery && (
          <>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  Search Results for "{searchQuery}"
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {loading ? 'Searching...' : `${posts?.length || 0} article${posts?.length !== 1 ? 's' : ''} found`}
                </p>
              </div>
              {posts?.length > 0 && (
                <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
              )}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-t-xl"></div>
                    <div className="p-6 space-y-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Results */}
            {!loading && posts?.length > 0 && (
              <div className={`${
                viewMode === 'grid' 
                  ? 'masonry-grid' 
                  : viewMode === 'list'
                  ? 'space-y-6'
                  : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
              }`}>
                {posts.map((post) => (
                  <PostCard key={post?.id} post={post} viewMode={viewMode} />
                ))}
              </div>
            )}

            {/* No Results */}
            {!loading && searchQuery && posts?.length === 0 && (
              <div className="text-center py-20">
                <div className="max-w-md mx-auto">
                  <Search className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No results found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    We couldn't find any articles matching "{searchQuery}". 
                    Try different keywords or browse our categories.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                    <Button variant="outline" onClick={clearSearch}>
                      <Filter className="w-4 h-4 mr-2" />
                      Clear Search
                    </Button>
                    <Button 
                      onClick={() => window.location.href = '/blog'}
                      className="btn-primary"
                    >
                      Browse All Articles
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Search Tips */}
        {!searchQuery && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8">
            <div className="max-w-2xl mx-auto text-center">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Search Tips
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600 dark:text-gray-400">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Search by Topic</h4>
                  <p>Try terms like "React", "UI Design", "Remote Work", or "Startup"</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Search by Author</h4>
                  <p>Find articles by specific authors like "Sarah Johnson" or "Michael Chen"</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Use Keywords</h4>
                  <p>Search for specific technologies, methodologies, or concepts</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Try Phrases</h4>
                  <p>Use quotes for exact phrases like "Next.js 14" or "TypeScript best practices"</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen py-20">
        <div className="content-container">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-8 max-w-md"></div>
            <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 dark:bg-gray-700 h-96 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
