
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistance } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Clock, Calendar, User } from 'lucide-react';
import type { Post, ViewMode } from '@/lib/types';

interface PostCardProps {
  post: Post;
  viewMode?: ViewMode;
  featured?: boolean;
}

export default function PostCard({ post, viewMode = 'grid', featured = false }: PostCardProps) {
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

  if (viewMode === 'covers' || featured) {
    return (
      <article className={`group relative overflow-hidden rounded-xl card-shadow-lg transition-all duration-300 hover:scale-[1.02] ${
        featured ? 'lg:col-span-2 lg:row-span-2' : ''
      }`}>
        <Link href={`/blog/${post?.slug}`} className="block">
          <div className={`relative ${featured ? 'h-96 lg:h-full' : 'h-80'}`}>
            {post?.featuredImage ? (
              <Image
                src={post.featuredImage}
                alt={post?.title ?? 'Blog post'}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex flex-wrap gap-2 mb-3">
                {post?.categories?.map((postCategory) => (
                  <Badge 
                    key={postCategory?.categoryId} 
                    variant="secondary"
                    className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                  >
                    {postCategory?.category?.name}
                  </Badge>
                ))}
              </div>
              
              <h2 className={`font-bold mb-2 line-clamp-2 ${
                featured ? 'text-2xl lg:text-3xl' : 'text-xl'
              }`}>
                {post?.title}
              </h2>
              
              <p className="text-white/90 mb-4 line-clamp-2">
                {post?.excerpt}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={post?.author?.avatar || ''} />
                    <AvatarFallback className="text-xs bg-white/20 text-white">
                      {getInitials(post?.author?.name ?? '')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <p className="font-medium">{post?.author?.name}</p>
                    <p className="text-white/75">{formatDate(post?.publishedAt ?? new Date())}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1 text-sm text-white/75">
                  <Clock className="w-4 h-4" />
                  <span>{post?.readingTime} min</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  if (viewMode === 'list') {
    return (
      <article className="group bg-white dark:bg-gray-800 rounded-xl card-shadow transition-all duration-300 hover:shadow-lg">
        <Link href={`/blog/${post?.slug}`} className="flex flex-col md:flex-row h-full">
          <div className="md:w-1/3 lg:w-1/4">
            <div className="relative h-48 md:h-full aspect-video bg-muted rounded-t-xl md:rounded-l-xl md:rounded-tr-none">
              {post?.featuredImage ? (
                <Image
                  src={post.featuredImage}
                  alt={post?.title ?? 'Blog post'}
                  fill
                  className="object-cover rounded-t-xl md:rounded-l-xl md:rounded-tr-none transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-t-xl md:rounded-l-xl md:rounded-tr-none" />
              )}
            </div>
          </div>
          
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {post?.categories?.slice(0, 2)?.map((postCategory) => (
                  <Badge 
                    key={postCategory?.categoryId}
                    variant="secondary"
                    style={{ backgroundColor: `${postCategory?.category?.color}20`, color: postCategory?.category?.color }}
                  >
                    {postCategory?.category?.name}
                  </Badge>
                ))}
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {post?.title}
              </h2>
              
              <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                {post?.excerpt}
              </p>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={post?.author?.avatar || ''} />
                  <AvatarFallback className="text-xs">
                    {getInitials(post?.author?.name ?? '')}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium text-gray-900 dark:text-white">{post?.author?.name}</p>
                  <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(post?.publishedAt ?? new Date())}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                <span>{post?.readingTime} min</span>
              </div>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  // Default grid view
  return (
    <article className="group bg-white dark:bg-gray-800 rounded-xl card-shadow transition-all duration-300 hover:shadow-lg masonry-item">
      <Link href={`/blog/${post?.slug}`} className="block">
        <div className="relative aspect-video bg-muted rounded-t-xl">
          {post?.featuredImage ? (
            <Image
              src={post.featuredImage}
              alt={post?.title ?? 'Blog post'}
              fill
              className="object-cover rounded-t-xl transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-t-xl" />
          )}
        </div>
        
        <div className="p-6">
          <div className="flex flex-wrap gap-2 mb-3">
            {post?.categories?.slice(0, 2)?.map((postCategory) => (
              <Badge 
                key={postCategory?.categoryId}
                variant="secondary"
                style={{ backgroundColor: `${postCategory?.category?.color}20`, color: postCategory?.category?.color }}
              >
                {postCategory?.category?.name}
              </Badge>
            ))}
          </div>
          
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {post?.title}
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
            {post?.excerpt}
          </p>
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Avatar className="w-6 h-6">
                <AvatarImage src={post?.author?.avatar || ''} />
                <AvatarFallback className="text-xs">
                  {getInitials(post?.author?.name ?? '')}
                </AvatarFallback>
              </Avatar>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p className="font-medium">{post?.author?.name}</p>
              </div>
            </div>
            
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{post?.readingTime} min</span>
              </div>
              <div className="text-xs mt-1">
                {formatDate(post?.publishedAt ?? new Date())}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
