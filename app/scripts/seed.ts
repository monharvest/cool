
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Create authors
  const authors = await Promise.all([
    prisma.author.upsert({
      where: { email: 'sarah.johnson@example.com' },
      update: {},
      create: {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        bio: 'Tech writer and digital marketing specialist with over 8 years of experience in creating engaging content for modern businesses.',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmVtYWxlJTIwYXZhdGFyfGVufDB8fDB8fHww',
        website: 'https://sarahjohnson.dev',
        twitter: '@sarahjohnson'
      }
    }),
    prisma.author.upsert({
      where: { email: 'michael.chen@example.com' },
      update: {},
      create: {
        name: 'Michael Chen',
        email: 'michael.chen@example.com',
        bio: 'Full-stack developer and startup advisor passionate about building scalable solutions and sharing knowledge with the developer community.',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
        website: 'https://michaelchen.tech',
        linkedin: 'in/michael-chen-dev'
      }
    }),
    prisma.author.upsert({
      where: { email: 'emma.rodriguez@example.com' },
      update: {},
      create: {
        name: 'Emma Rodriguez',
        email: 'emma.rodriguez@example.com',
        bio: 'UX/UI designer and creative strategist helping brands create meaningful digital experiences that connect with their audiences.',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
        website: 'https://emmarodriguez.design',
        twitter: '@emma_designs'
      }
    })
  ]);

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'technology' },
      update: {},
      create: {
        name: 'Technology',
        slug: 'technology',
        description: 'Latest trends in tech, software development, and digital innovation.',
        color: '#3B82F6'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'design' },
      update: {},
      create: {
        name: 'Design',
        slug: 'design',
        description: 'UI/UX design principles, creative inspiration, and design thinking.',
        color: '#8B5CF6'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'business' },
      update: {},
      create: {
        name: 'Business',
        slug: 'business',
        description: 'Entrepreneurship, marketing strategies, and business growth insights.',
        color: '#10B981'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'lifestyle' },
      update: {},
      create: {
        name: 'Lifestyle',
        slug: 'lifestyle',
        description: 'Work-life balance, productivity tips, and personal development.',
        color: '#F59E0B'
      }
    })
  ]);

  // Create tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: 'react' },
      update: {},
      create: { name: 'React', slug: 'react' }
    }),
    prisma.tag.upsert({
      where: { slug: 'nextjs' },
      update: {},
      create: { name: 'Next.js', slug: 'nextjs' }
    }),
    prisma.tag.upsert({
      where: { slug: 'typescript' },
      update: {},
      create: { name: 'TypeScript', slug: 'typescript' }
    }),
    prisma.tag.upsert({
      where: { slug: 'ui-design' },
      update: {},
      create: { name: 'UI Design', slug: 'ui-design' }
    }),
    prisma.tag.upsert({
      where: { slug: 'ux-research' },
      update: {},
      create: { name: 'UX Research', slug: 'ux-research' }
    }),
    prisma.tag.upsert({
      where: { slug: 'startup' },
      update: {},
      create: { name: 'Startup', slug: 'startup' }
    }),
    prisma.tag.upsert({
      where: { slug: 'productivity' },
      update: {},
      create: { name: 'Productivity', slug: 'productivity' }
    }),
    prisma.tag.upsert({
      where: { slug: 'remote-work' },
      update: {},
      create: { name: 'Remote Work', slug: 'remote-work' }
    })
  ]);

  // Create posts with relationships
  const posts = [
    {
      title: 'Building Modern React Applications with Next.js 14',
      slug: 'building-modern-react-applications-nextjs-14',
      excerpt: 'Explore the latest features and improvements in Next.js 14, from App Router to Server Components, and learn how to build fast, scalable React applications.',
      content: `# Building Modern React Applications with Next.js 14

Next.js 14 represents a significant leap forward in React application development, introducing powerful features that make building modern web applications easier than ever before.

## What's New in Next.js 14

The App Router has become stable and production-ready, offering improved performance and developer experience. Server Components allow for better optimization and faster loading times.

### Key Features:

1. **App Router Stability**: Full production support with improved routing
2. **Server Actions**: Simplified server-side logic handling
3. **Improved Performance**: Better caching and optimization strategies
4. **Enhanced Developer Experience**: Better debugging and error handling

## Getting Started

To start building with Next.js 14, you'll want to leverage TypeScript for type safety and the new app directory structure for better organization.

\`\`\`javascript
npx create-next-app@latest my-app --typescript --app
\`\`\`

## Server Components vs Client Components

Understanding when to use Server Components versus Client Components is crucial for optimal performance. Server Components are rendered on the server, reducing bundle size and improving initial load times.

## Conclusion

Next.js 14 provides an excellent foundation for modern React applications, combining performance with developer experience.`,
      featuredImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop&crop=entropy',
      readingTime: 8,
      featured: true,
      authorId: authors[1].id, // Michael Chen
      categoryIds: [categories[0].id], // Technology
      tagIds: [tags[0].id, tags[1].id, tags[2].id] // React, Next.js, TypeScript
    },
    {
      title: 'The Psychology of User Interface Design',
      slug: 'psychology-of-user-interface-design',
      excerpt: 'Understanding how users interact with interfaces on a psychological level can dramatically improve your design decisions and create more intuitive user experiences.',
      content: `# The Psychology of User Interface Design

Great user interfaces don't just look good—they understand human psychology. By applying psychological principles to UI design, we can create interfaces that feel natural and intuitive.

## Cognitive Load Theory

Every interface element adds to the user's cognitive load. The key is to minimize unnecessary complexity while maintaining functionality.

### Key Principles:

1. **Miller's Rule**: People can hold 7±2 items in working memory
2. **Fitts' Law**: Larger targets are easier to click
3. **Hick's Law**: More choices increase decision time
4. **Von Restorff Effect**: Distinctive items are more memorable

## Visual Hierarchy

Using size, color, and positioning to guide attention is fundamental to good UI design. Users scan interfaces in predictable patterns.

## Color Psychology

Different colors evoke different emotional responses:
- Blue conveys trust and professionalism
- Green suggests growth and success
- Red indicates urgency or warnings
- Orange implies creativity and enthusiasm

## Gestalt Principles

These principles explain how users perceive and organize visual information:
- **Proximity**: Related items should be grouped together
- **Similarity**: Similar items are perceived as related
- **Closure**: Users fill in gaps mentally
- **Continuity**: Eyes follow smooth paths

## Practical Applications

Apply these concepts by:
1. Grouping related functionality
2. Using consistent visual patterns
3. Providing clear feedback for user actions
4. Designing for emotional responses

Understanding psychology makes the difference between interfaces that work and interfaces that users love.`,
      featuredImage: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&h=400&fit=crop&crop=entropy',
      readingTime: 6,
      featured: true,
      authorId: authors[2].id, // Emma Rodriguez
      categoryIds: [categories[1].id], // Design
      tagIds: [tags[3].id, tags[4].id] // UI Design, UX Research
    },
    {
      title: 'Remote Work Productivity: Tools and Strategies That Actually Work',
      slug: 'remote-work-productivity-tools-strategies',
      excerpt: 'Discover proven methods and tools for maintaining high productivity while working remotely, from time management techniques to collaboration platforms.',
      content: `# Remote Work Productivity: Tools and Strategies That Actually Work

Remote work has transformed from a perk to a necessity. Success requires intentional strategies and the right tools to maintain productivity and collaboration.

## Setting Up Your Workspace

A dedicated workspace improves focus and creates boundaries between work and personal life.

### Essential Elements:
- Proper lighting (natural light when possible)
- Ergonomic chair and desk setup
- Minimal distractions
- Good internet connection

## Time Management Techniques

### The Pomodoro Technique
Work in 25-minute focused sessions followed by 5-minute breaks. This maintains energy and prevents burnout.

### Time Blocking
Schedule specific time blocks for different types of work:
- Deep work sessions
- Communication and meetings
- Administrative tasks
- Learning and development

## Essential Tools

### Communication
- **Slack**: Team messaging and file sharing
- **Zoom**: Video conferencing and screen sharing
- **Asana**: Project management and task tracking

### Productivity
- **Notion**: All-in-one workspace for notes and planning
- **Toggl**: Time tracking and productivity insights
- **Focus apps**: Block distracting websites during work hours

## Maintaining Work-Life Balance

1. Set clear boundaries between work and personal time
2. Take regular breaks throughout the day
3. Maintain social connections with colleagues
4. Exercise and get outside regularly

## Building Habits

Consistency is key to remote work success:
- Start your day with a morning routine
- Use the same workspace daily
- End work with a shutdown ritual
- Review and plan for the next day

## Overcoming Common Challenges

### Isolation
- Schedule regular video calls with team members
- Join virtual coworking sessions
- Attend online networking events

### Distractions
- Use website blockers during focused work
- Communicate boundaries with household members
- Create a dedicated work environment

Remote work productivity isn't about working more hours—it's about working more effectively.`,
      featuredImage: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=400&fit=crop&crop=entropy',
      readingTime: 7,
      featured: false,
      authorId: authors[0].id, // Sarah Johnson
      categoryIds: [categories[3].id], // Lifestyle
      tagIds: [tags[6].id, tags[7].id] // Productivity, Remote Work
    },
    {
      title: 'Scaling Your Startup: Lessons from 100+ Successful Companies',
      slug: 'scaling-startup-lessons-successful-companies',
      excerpt: 'Learn from the growth strategies of successful startups and avoid common pitfalls that prevent companies from scaling effectively.',
      content: `# Scaling Your Startup: Lessons from 100+ Successful Companies

Scaling a startup is one of the most challenging phases of business growth. Here are key insights from companies that have successfully navigated this transition.

## The Scaling Mindset

Scaling isn't just about growing bigger—it's about growing smarter. The strategies that work for a 10-person team often break down at 50 or 100 people.

### Key Mindset Shifts:
1. From doing everything to delegating effectively
2. From informal communication to structured processes
3. From personal relationships to systems-driven culture
4. From reacting to problems to preventing them

## Building Scalable Systems

### Technology Infrastructure
Your tech stack needs to handle growth:
- Cloud-native architecture for flexibility
- Automated testing and deployment
- Performance monitoring and alerting
- Data backup and security protocols

### Operational Processes
Document and standardize key processes:
- Customer onboarding workflows
- Sales and marketing funnels
- Support ticket handling
- Financial reporting and analysis

## Team Scaling Strategies

### Hiring Philosophy
- Hire for potential, not just current skills
- Cultural fit becomes increasingly important
- Build diverse teams with complementary strengths
- Invest heavily in onboarding and training

### Leadership Development
- Identify high-potential employees early
- Provide leadership training and mentorship
- Create clear career progression paths
- Establish feedback and performance review systems

## Financial Management

### Cash Flow Planning
- Maintain 6-12 months of runway
- Forecast growth scenarios accurately
- Monitor unit economics closely
- Plan for seasonal variations

### Investment Strategy
Know when to:
- Bootstrap vs. raise funding
- Prioritize growth vs. profitability
- Invest in people vs. technology
- Enter new markets vs. deepen existing ones

## Common Scaling Pitfalls

1. **Premature scaling**: Growing too fast without solid fundamentals
2. **Culture dilution**: Losing company values during rapid hiring
3. **Process paralysis**: Over-engineering processes too early
4. **Market confusion**: Trying to serve too many customer segments

## Key Performance Indicators

Track metrics that matter for scaling:
- Customer acquisition cost (CAC)
- Lifetime value (LTV)
- Monthly recurring revenue (MRR)
- Churn rate
- Employee satisfaction and retention

## The Role of Company Culture

Culture becomes your operating system at scale:
- Define clear values and behaviors
- Hire and fire based on cultural fit
- Celebrate wins and learn from failures
- Maintain transparency as you grow

Successful scaling requires balancing growth with sustainability, systems with flexibility, and ambition with realism.`,
      featuredImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop&crop=entropy',
      readingTime: 10,
      featured: true,
      authorId: authors[1].id, // Michael Chen
      categoryIds: [categories[2].id], // Business
      tagIds: [tags[5].id] // Startup
    },
    {
      title: 'TypeScript Best Practices for Large Applications',
      slug: 'typescript-best-practices-large-applications',
      excerpt: 'Master advanced TypeScript patterns and practices that will help you build maintainable, scalable applications with better developer experience.',
      content: `# TypeScript Best Practices for Large Applications

TypeScript shines in large applications where type safety, maintainability, and developer experience are crucial. Here are proven practices for TypeScript success at scale.

## Project Structure and Organization

### Barrel Exports
Use index files to create clean import paths:

\`\`\`typescript
// utils/index.ts
export * from './formatting';
export * from './validation';
export * from './api';

// Usage
import { formatCurrency, validateEmail } from '@/utils';
\`\`\`

### Domain-Driven Directory Structure
Organize by feature rather than file type:
\`\`\`
src/
├── domains/
│   ├── user/
│   │   ├── types.ts
│   │   ├── services.ts
│   │   └── components/
│   └── product/
├── shared/
└── app/
\`\`\`

## Advanced Type Patterns

### Generic Constraints
Use constraints to make generic types more specific:

\`\`\`typescript
interface Identifiable {
  id: string;
}

function updateEntity<T extends Identifiable>(
  entity: T, 
  updates: Partial<T>
): T {
  return { ...entity, ...updates };
}
\`\`\`

### Utility Types for API Responses
Create reusable patterns for common structures:

\`\`\`typescript
type ApiResponse<T> = {
  data: T;
  status: 'success' | 'error';
  message?: string;
};

type PaginatedResponse<T> = ApiResponse<T[]> & {
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
};
\`\`\`

## Error Handling Strategies

### Result Pattern
Use Result types for explicit error handling:

\`\`\`typescript
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

async function fetchUser(id: string): Promise<Result<User>> {
  try {
    const user = await api.getUser(id);
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}
\`\`\`

## Configuration and Environment

### Strict TypeScript Config
Use the strictest settings for maximum type safety:

\`\`\`json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
\`\`\`

### Environment Type Safety
Type your environment variables:

\`\`\`typescript
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'staging' | 'production';
    DATABASE_URL: string;
    JWT_SECRET: string;
  }
}
\`\`\`

## Testing with TypeScript

### Type-Safe Test Utilities
Create utilities that preserve type information:

\`\`\`typescript
function createMockUser(overrides?: Partial<User>): User {
  return {
    id: 'mock-id',
    name: 'Mock User',
    email: 'mock@example.com',
    ...overrides
  };
}
\`\`\`

## Performance Considerations

### Import Optimization
Use type-only imports when possible:

\`\`\`typescript
import type { User } from './types';
import { validateUser } from './validation';
\`\`\`

### Build Performance
- Use project references for large codebases
- Enable incremental compilation
- Use skipLibCheck for faster builds

## Common Anti-Patterns to Avoid

1. **Any abuse**: Don't use \`any\` as an escape hatch
2. **Over-engineering**: Don't create overly complex type hierarchies
3. **Ignoring strictness**: Use strict mode from the beginning
4. **Poor error handling**: Don't ignore TypeScript errors

## Migration Strategies

When adding TypeScript to existing projects:
1. Start with allowJs and checkJs
2. Convert files gradually
3. Use @ts-ignore sparingly and temporarily
4. Focus on high-value files first

TypeScript's power comes from consistent application of these practices across your entire codebase.`,
      featuredImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop&crop=entropy',
      readingTime: 9,
      featured: false,
      authorId: authors[1].id, // Michael Chen
      categoryIds: [categories[0].id], // Technology
      tagIds: [tags[2].id] // TypeScript
    },
    {
      title: 'Creating Inclusive Design Systems',
      slug: 'creating-inclusive-design-systems',
      excerpt: 'Learn how to build design systems that work for everyone, including users with disabilities, different cultures, and varying technical literacy levels.',
      content: `# Creating Inclusive Design Systems

Inclusive design systems ensure that digital products work for everyone, regardless of ability, context, or background. Here's how to build systems that truly serve all users.

## Understanding Inclusive Design

Inclusive design isn't an afterthought—it's a fundamental approach that considers the full range of human diversity from the start.

### Core Principles:
1. **Universal**: Design for the widest range of users
2. **Flexible**: Provide multiple ways to interact
3. **Clear**: Use simple, understandable language
4. **Robust**: Work across devices and assistive technologies

## Accessibility Foundations

### WCAG Guidelines
Follow Web Content Accessibility Guidelines:
- **Perceivable**: Information must be presentable in ways users can perceive
- **Operable**: Interface components must be operable
- **Understandable**: Information and UI must be understandable
- **Robust**: Content must be robust enough for assistive technologies

### Color and Contrast
- Maintain minimum 4.5:1 contrast ratio for text
- Don't rely solely on color to convey information
- Test with color blindness simulators
- Provide alternative indicators (icons, patterns)

### Typography for Accessibility
- Use readable fonts (minimum 16px for body text)
- Provide sufficient line spacing (1.5x)
- Limit line length (45-75 characters)
- Support font scaling up to 200%

## Inclusive Component Design

### Form Controls
\`\`\`html
<label for="email" class="form-label">
  Email Address
  <span class="required" aria-label="required">*</span>
</label>
<input 
  type="email" 
  id="email" 
  class="form-input"
  aria-describedby="email-error"
  aria-invalid="false"
>
<div id="email-error" class="error-message" role="alert">
  <!-- Error messages appear here -->
</div>
\`\`\`

### Navigation Components
- Provide skip links for keyboard users
- Use semantic HTML (nav, main, aside)
- Include aria-current for current page
- Support keyboard navigation patterns

### Interactive Elements
- Maintain focus indicators
- Use appropriate ARIA labels
- Provide feedback for state changes
- Ensure touch targets are at least 44px

## Cultural Inclusivity

### Internationalization (i18n)
- Design for text expansion (up to 40% longer)
- Support right-to-left languages
- Use culturally appropriate imagery
- Avoid text in images

### Cultural Sensitivity
- Research cultural norms for colors and symbols
- Provide diverse representation in imagery
- Consider different name formats
- Respect religious and cultural practices

## Technical Implementation

### Semantic HTML
Use proper HTML elements for their intended purpose:
\`\`\`html
<button><!-- For actions --></button>
<a href="/"><!-- For navigation --></a>
<input type="checkbox"><!-- For selection --></input>
\`\`\`

### ARIA Best Practices
- Use ARIA to enhance, not replace semantic HTML
- Test with screen readers
- Provide meaningful descriptions
- Update dynamic content announcements

### Progressive Enhancement
Build features in layers:
1. Basic HTML functionality
2. CSS enhancement
3. JavaScript interactivity
4. Advanced features

## Testing for Inclusivity

### Automated Testing
- Use tools like axe-core or WAVE
- Run lighthouse accessibility audits
- Test color contrast automatically
- Validate HTML and ARIA

### Manual Testing
- Navigate using only keyboard
- Test with screen readers
- Try with zoom up to 200%
- Test on various devices and browsers

### User Testing
- Include users with disabilities
- Test with diverse user groups
- Gather feedback from different cultures
- Observe actual usage patterns

## Documentation and Guidelines

### Component Documentation
Include accessibility information:
- Keyboard interactions
- Screen reader behavior
- ARIA requirements
- Color requirements

### Usage Guidelines
Provide clear guidance on:
- When to use each component
- How to implement properly
- Common mistakes to avoid
- Customization boundaries

## Measuring Success

Track inclusive design metrics:
- WCAG compliance scores
- User feedback from diverse groups
- Task completion rates across user types
- Support ticket patterns

## Building an Inclusive Team

- Include diverse perspectives in design decisions
- Provide accessibility training
- Partner with disability advocates
- Make inclusion part of your design process

Inclusive design systems create better experiences for everyone, not just users with specific needs.`,
      featuredImage: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=400&fit=crop&crop=entropy',
      readingTime: 11,
      featured: false,
      authorId: authors[2].id, // Emma Rodriguez
      categoryIds: [categories[1].id], // Design
      tagIds: [tags[3].id, tags[4].id] // UI Design, UX Research
    }
  ];

  // Create posts with their relationships
  for (const postData of posts) {
    const { categoryIds, tagIds, ...postFields } = postData;
    
    const post = await prisma.post.upsert({
      where: { slug: postFields.slug },
      update: {},
      create: postFields
    });

    // Create post-category relationships
    for (const categoryId of categoryIds) {
      await prisma.postCategory.upsert({
        where: {
          postId_categoryId: {
            postId: post.id,
            categoryId: categoryId
          }
        },
        update: {},
        create: {
          postId: post.id,
          categoryId: categoryId
        }
      });
    }

    // Create post-tag relationships
    for (const tagId of tagIds) {
      await prisma.postTag.upsert({
        where: {
          postId_tagId: {
            postId: post.id,
            tagId: tagId
          }
        },
        update: {},
        create: {
          postId: post.id,
          tagId: tagId
        }
      });
    }
  }

  // Create site settings
  const settings = [
    { key: 'site_title', value: 'Cool Inspired Blog', type: 'text' },
    { key: 'site_description', value: 'A modern magazine and blog platform built with Next.js', type: 'text' },
    { key: 'primary_color', value: '#3B82F6', type: 'color' },
    { key: 'secondary_color', value: '#8B5CF6', type: 'color' },
    { key: 'posts_per_page', value: '9', type: 'number' },
    { key: 'show_author_bio', value: 'true', type: 'boolean' },
    { key: 'enable_comments', value: 'false', type: 'boolean' },
    { key: 'social_twitter', value: '@coolblog', type: 'text' },
    { key: 'social_linkedin', value: 'company/cool-blog', type: 'text' },
    { key: 'google_analytics', value: '', type: 'text' }
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
