
export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featuredImage: string | null;
  readingTime: number;
  status: string;
  featured: boolean;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  author: Author;
  categories: PostCategory[];
  tags: PostTag[];
}

export interface Author {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  website: string | null;
  twitter: string | null;
  linkedin: string | null;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string;
  createdAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
}

export interface PostCategory {
  postId: string;
  categoryId: string;
  category: Category;
}

export interface PostTag {
  postId: string;
  tagId: string;
  tag: Tag;
}

export interface SiteSetting {
  key: string;
  value: string;
  type: string;
  updatedAt: Date;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: string;
  createdAt: Date;
}

export interface Newsletter {
  id: string;
  email: string;
  status: string;
  createdAt: Date;
}

export type ViewMode = 'list' | 'grid' | 'covers';

export interface BlogLayoutProps {
  posts: Post[];
  categories: Category[];
  tags: Tag[];
  viewMode: ViewMode;
  currentCategory?: string;
  currentTag?: string;
}
