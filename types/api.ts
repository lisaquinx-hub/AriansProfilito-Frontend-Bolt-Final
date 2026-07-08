export interface HeroSection {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  backgroundImage?: string;
  videoUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon?: string;
  isActive?: boolean;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  description?: string;
  features: string[];
  isPopular?: boolean;
  isActive?: boolean;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  displayOrder?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Settings {
  id?: string;
  siteName?: string;
  logo?: string;
  darkLogo?: string;
  favicon?: string;
  email?: string;
  phone?: string;
  phoneNumber?: string;
  address?: string;
  footerText?: string;
  footerDescription?: string;
  copyright?: string;
  googleMap?: string;
  googleAnalytics?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SiteSettings extends Settings {}

export interface SocialMedia {
  id: string;
  platform: string;
  url: string;
  icon?: string;
  displayOrder?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  publishedPostCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  readTime?: number;
  isPublished: boolean;
  publishedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string;
  categoryId?: string;
  categoryName?: string;
  author?: string;
  authorAvatar?: string;
  views?: number;
  likes?: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  blogPostId: string;
  blogPostTitle?: string;
  userId?: string;
  userFullName?: string;
  userEmail?: string;
  parentCommentId?: string;
  fullName: string;
  email: string;
  message: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Technology {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  portfolioCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  metric?: string;
  metricValue?: string;
  image?: string;
  category?: string;
  featured?: boolean;
  completionTime?: string;
  startingPrice?: string;
  technologies?: string[];
  features?: string[];
  gallery?: string[];
  videoUrl?: string;
  clientName?: string;
  projectUrl?: string;
  isActive?: boolean;
  displayOrder?: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  userName?: string;
  avatar?: string;
  role?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: string;
  userId?: string;
  userFullName?: string;
  userEmail?: string;
  activity: string;
  description?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId?: string;
  userFullName?: string;
  userEmail?: string;
  action: string;
  entityName: string;
  entityId?: string;
  oldValues?: string;
  newValues?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  userId?: string;
  userName?: string;
  projectId?: string;
  projectName?: string;
  amount: number;
  tax?: number;
  totalAmount: number;
  status: string;
  dueDate?: string;
  paidAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  invoiceId?: string;
  userId?: string;
  userName?: string;
  amount: number;
  method: string;
  transactionId?: string;
  status: string;
  paidAt?: string;
  notes?: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userId?: string;
  userName?: string;
  subject: string;
  description: string;
  status: string;
  priority?: string;
  assignedTo?: string;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type?: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface AdminDashboardStats {
  usersCount: number;
  projectsCount: number;
  invoicesCount: number;
  paymentsCount: number;
  supportTicketsCount: number;
  blogPostsCount: number;
  pendingCommentsCount: number;
}

export interface CreateCommentRequest {
  blogPostId: string;
  parentCommentId?: string | null;
  fullName: string;
  email: string;
  message: string;
}
