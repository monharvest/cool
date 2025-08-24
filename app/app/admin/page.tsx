
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Edit, 
  Save, 
  X, 
  FileText, 
  Users, 
  Mail, 
  TrendingUp,
  Eye,
  Calendar
} from 'lucide-react';
import type { Post, Category, Tag, Author, Contact } from '@/lib/types';

interface AdminStats {
  totalPosts: number;
  totalContacts: number;
  totalViews: number;
  totalAuthors: number;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<AdminStats>({ totalPosts: 0, totalContacts: 0, totalViews: 0, totalAuthors: 0 });
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const { toast } = useToast();

  // New post form state
  const [newPost, setNewPost] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    authorId: '',
    categoryIds: [] as string[],
    tagIds: [] as string[]
  });

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [postsRes, categoriesRes, tagsRes, authorsRes, contactsRes] = await Promise.all([
        fetch('/api/posts?limit=50'),
        fetch('/api/categories'),
        fetch('/api/tags'),
        fetch('/api/authors'),
        fetch('/api/contact')
      ]);

      if (postsRes?.ok) {
        const postsData = await postsRes.json();
        setPosts(postsData?.posts || []);
      }

      if (categoriesRes?.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData?.categories || []);
      }

      if (tagsRes?.ok) {
        const tagsData = await tagsRes.json();
        setTags(tagsData?.tags || []);
      }

      if (authorsRes?.ok) {
        const authorsData = await authorsRes.json();
        setAuthors(authorsData?.authors || []);
      }

      if (contactsRes?.ok) {
        const contactsData = await contactsRes.json();
        setContacts(contactsData?.contacts || []);
      }

      // Calculate stats
      setStats({
        totalPosts: posts?.length || 0,
        totalContacts: contacts?.filter(c => c?.status === 'UNREAD')?.length || 0,
        totalViews: 125000, // Mock data
        totalAuthors: authors?.length || 0
      });
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      ?.toLowerCase()
      ?.replace(/[^a-z0-9]+/g, '-')
      ?.replace(/(^-|-$)/g, '') ?? '';
  };

  const handleNewPostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
      });

      if (response?.ok) {
        toast({
          title: "Success!",
          description: "New post created successfully.",
        });
        setNewPost({
          title: '',
          slug: '',
          excerpt: '',
          content: '',
          featuredImage: '',
          authorId: '',
          categoryIds: [],
          tagIds: []
        });
        setShowNewPostForm(false);
        loadAdminData();
      } else {
        throw new Error('Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'posts', label: 'Posts', icon: FileText },
    { id: 'contacts', label: 'Messages', icon: Mail },
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="content-container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-heading-1 mb-4">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your blog content and monitor site performance.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 ${
                activeTab === tab.id 
                  ? 'bg-white dark:bg-gray-700 shadow-sm' 
                  : 'hover:bg-white/50 dark:hover:bg-gray-700/50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </Button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="card-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Posts</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{posts?.length}</p>
                    </div>
                    <FileText className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="card-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">New Messages</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {contacts?.filter(c => c?.status === 'UNREAD')?.length}
                      </p>
                    </div>
                    <Mail className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="card-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Views</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">125K</p>
                    </div>
                    <Eye className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="card-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Authors</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{authors?.length}</p>
                    </div>
                    <Users className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Posts */}
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle>Recent Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {posts?.slice(0, 5)?.map((post) => (
                    <div key={post?.id} className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-700 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white line-clamp-1">
                          {post?.title}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(post?.publishedAt)?.toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{post?.author?.name}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {post?.featured && (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                            Featured
                          </Badge>
                        )}
                        <Badge 
                          variant={post?.status === 'PUBLISHED' ? 'default' : 'secondary'}
                        >
                          {post?.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Manage Posts</h2>
              <Button 
                onClick={() => setShowNewPostForm(true)}
                className="btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Button>
            </div>

            {/* New Post Form */}
            {showNewPostForm && (
              <Card className="card-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Create New Post</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setShowNewPostForm(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleNewPostSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Title</label>
                        <Input
                          value={newPost.title}
                          onChange={(e) => {
                            const title = e.target.value;
                            setNewPost(prev => ({ 
                              ...prev, 
                              title, 
                              slug: generateSlug(title) 
                            }));
                          }}
                          placeholder="Enter post title"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Slug</label>
                        <Input
                          value={newPost.slug}
                          onChange={(e) => setNewPost(prev => ({ ...prev, slug: e.target.value }))}
                          placeholder="post-url-slug"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Excerpt</label>
                      <Textarea
                        value={newPost.excerpt}
                        onChange={(e) => setNewPost(prev => ({ ...prev, excerpt: e.target.value }))}
                        placeholder="Brief description of the post"
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Content</label>
                      <Textarea
                        value={newPost.content}
                        onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Write your post content here..."
                        rows={10}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Featured Image URL</label>
                        <Input
                          value={newPost.featuredImage}
                          onChange={(e) => setNewPost(prev => ({ ...prev, featuredImage: e.target.value }))}
                          placeholder="https://i.ytimg.com/vi/SG2KCNLbY8Q/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLD3_47nWLnZZbsHBLL9sNSUXZYJrA"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Author</label>
                        <Select 
                          value={newPost.authorId} 
                          onValueChange={(value) => setNewPost(prev => ({ ...prev, authorId: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select author" />
                          </SelectTrigger>
                          <SelectContent>
                            {authors?.map((author) => (
                              <SelectItem key={author?.id} value={author?.id || 'fallback-author'}>
                                {author?.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowNewPostForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={loading} className="btn-primary">
                        {loading ? 'Creating...' : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Create Post
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Posts List */}
            <Card className="card-shadow">
              <CardContent className="p-0">
                <div className="space-y-1">
                  {posts?.map((post) => (
                    <div key={post?.id} className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white line-clamp-1 mb-1">
                          {post?.title}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                          <span>{post?.author?.name}</span>
                          <span>•</span>
                          <span>{new Date(post?.publishedAt)?.toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{post?.readingTime} min read</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        {post?.featured && (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                            Featured
                          </Badge>
                        )}
                        <Badge 
                          variant={post?.status === 'PUBLISHED' ? 'default' : 'secondary'}
                        >
                          {post?.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'contacts' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Contact Messages</h2>

            <Card className="card-shadow">
              <CardContent className="p-0">
                <div className="space-y-1">
                  {contacts?.map((contact) => (
                    <div key={contact?.id} className="p-6 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {contact?.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {contact?.email}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={contact?.status === 'UNREAD' ? 'default' : 'secondary'}
                          >
                            {contact?.status}
                          </Badge>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(contact?.createdAt)?.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      {contact?.subject && (
                        <p className="font-medium text-gray-900 dark:text-white mb-2">
                          Subject: {contact.subject}
                        </p>
                      )}
                      
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {contact?.message}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
