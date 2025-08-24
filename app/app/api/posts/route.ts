
import { NextRequest, NextResponse } from 'next/server';
import { prisma, connectToDatabase } from '@/lib/db-edge';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Ensure database connection
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const sort = searchParams.get('sort') || 'latest';
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');

    // Build where clause
    const where: any = {
      status: 'PUBLISHED',
    };

    // Add search condition
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Add category filter
    if (category && category !== 'all') {
      where.categories = {
        some: {
          category: {
            slug: category,
          },
        },
      };
    }

    // Add tag filter
    if (tag && tag !== 'all') {
      where.tags = {
        some: {
          tag: {
            slug: tag,
          },
        },
      };
    }

    // Add featured filter
    if (sort === 'featured') {
      where.featured = true;
    }

    // Build order by clause
    let orderBy: any = { publishedAt: 'desc' };
    
    switch (sort) {
      case 'oldest':
        orderBy = { publishedAt: 'asc' };
        break;
      case 'popular':
        // In a real app, you'd have view counts or engagement metrics
        orderBy = { readingTime: 'desc' };
        break;
      case 'featured':
      case 'latest':
      default:
        orderBy = { publishedAt: 'desc' };
        break;
    }

    // Get posts with pagination
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
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
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json(
      {
        success: true,
        posts,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch posts' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Ensure database connection
    await connectToDatabase();
    
    const body = await request.json();
    const { title, slug, excerpt, content, featuredImage, authorId, categoryIds, tagIds } = body;

    // Validate required fields
    if (!title || !slug || !content || !authorId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingPost = await prisma.post.findUnique({
      where: { slug },
    });

    if (existingPost) {
      return NextResponse.json(
        { success: false, error: 'Post with this slug already exists' },
        { status: 400 }
      );
    }

    // Create the post
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content,
        featuredImage: featuredImage || null,
        authorId,
        readingTime: Math.max(1, Math.ceil(content.split(' ').length / 200)), // Estimate reading time
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

    // Add category relationships
    if (categoryIds && Array.isArray(categoryIds)) {
      for (const categoryId of categoryIds) {
        await prisma.postCategory.create({
          data: {
            postId: post.id,
            categoryId,
          },
        });
      }
    }

    // Add tag relationships
    if (tagIds && Array.isArray(tagIds)) {
      for (const tagId of tagIds) {
        await prisma.postTag.create({
          data: {
            postId: post.id,
            tagId,
          },
        });
      }
    }

    // Fetch the complete post with relationships
    const completePost = await prisma.post.findUnique({
      where: { id: post.id },
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

    return NextResponse.json(
      {
        success: true,
        post: completePost,
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create post' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );
  }
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
