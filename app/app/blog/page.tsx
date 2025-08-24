
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PostCard from '@/components/blog/post-card';
import ViewToggle from '@/components/blog/view-toggle';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import type { Post, Category, Tag, ViewMode } from '@/lib/types';

function BlogContent() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('latest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  
  const searchParams = useSearchParams();

  // Load initial data and handle URL parameters
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (searchQuery) params.set('search', searchQuery);
        if (selectedCategory !== 'all') params.set('category', selectedCategory);
        if (selectedTag !== 'all') params.set('tag', selectedTag);
        if (sortBy !== 'latest') params.set('sort', sortBy);
        
        const [postsResponse, categoriesResponse, tagsResponse] = await Promise.all([
          fetch(`/api/posts?${params.toString()}`),
          fetch('/api/categories'),
          fetch('/api/tags')
        ]);

        if (postsResponse?.ok) {
          const postsData = await postsResponse.json();
          setPosts(postsData?.posts || []);
        }

        if (categoriesResponse?.ok) {
          const categoriesData = await categoriesResponse.json();
          setCategories(categoriesData?.categories || []);
        }

        if (tagsResponse?.ok) {
          const tagsData = await tagsResponse.json();
          setTags(tagsData?.tags || []);
        }
      } catch (error) {
        console.error('Error loading blog data:', error);
        setPosts([]);
        setCategories([]);
        setTags([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [searchQuery, selectedCategory, selectedTag, sortBy]);

  // Handle URL parameters on initial load
  useEffect(() => {
    const urlSearch = searchParams?.get('search');
    const urlCategory = searchParams?.get('category');
    const urlTag = searchParams?.get('tag');
    const urlSort = searchParams?.get('sort');
    const urlFeatured = searchParams?.get('featured');

    if (urlSearch) setSearchQuery(urlSearch);
    if (urlCategory) setSelectedCategory(urlCategory);
    if (urlTag) setSelectedTag(urlTag);
    if (urlSort) setSortBy(urlSort);
    if (urlFeatured === 'true') setSortBy('featured');
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search will be triggered by useEffect when searchQuery changes
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedTag('all');
    setSortBy('latest');
  };

  const filteredPostsCount = posts?.length || 0;
  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || selectedTag !== 'all' || sortBy !== 'latest';

  if (loading) {
    return (
      <div className="min-h-screen py-20">
        <div className="content-container">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-8 max-w-md"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 dark:bg-gray-700 h-96 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="content-container">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-heading-1 mb-4">Blog & Articles</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl">
            Explore our collection of insights, tutorials, and thought leadership 
            across technology, design, business, and lifestyle.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 card-shadow mb-8">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 lg:w-auto">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories?.map((category) => (
                    <SelectItem key={category?.id || 'fallback-category'} value={category?.slug || 'fallback-slug'}>
                      {category?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedTag} onValueChange={setSelectedTag}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Tags" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tags</SelectItem>
                  {tags?.map((tag) => (
                    <SelectItem key={tag?.id || 'fallback-tag'} value={tag?.slug || 'fallback-slug'}>
                      {tag?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {filteredPostsCount} article{filteredPostsCount !== 1 ? 's' : ''} found
              </p>
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                <Filter className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {/* View Toggle and Count */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {filteredPostsCount} article{filteredPostsCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Posts Grid/List */}
        {posts?.length > 0 ? (
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
        ) : (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <SlidersHorizontal className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No articles found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {hasActiveFilters 
                  ? "Try adjusting your search filters to find more articles."
                  : "There are no published articles available at the moment."
                }
              </p>
              {hasActiveFilters && (
                <Button onClick={resetFilters} className="btn-primary">
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen py-20">
        <div className="content-container">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-8 max-w-md"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 dark:bg-gray-700 h-96 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    }>
      <BlogContent />
    </Suspense>
  );
}
