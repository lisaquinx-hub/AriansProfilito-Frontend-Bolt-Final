// Backend-aligned types based on DTOs

export interface HeroSection {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  primaryButtonText: string;
  primaryButtonUrl: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  backgroundImage?: string;
  videoUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface ServiceFeature {
  id?: string;
  title: string;
  displayOrder?: number;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  thumbnail?: string;
  coverImage?: string;
  shortDescription?: string;
  description: string;
  estimatedDeliveryDays?: number;
  isFeatured?: boolean;
  displayOrder?: number;
  icon?: string;
  isActive?: boolean;
  features?: ServiceFeature[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PlanFeature {
  feature: string;
}

export interface PricingPlan {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  deliveryDays: number;
  isPopular: boolean;
  displayOrder: number;
  isActive?: boolean;
  features: PlanFeature[];
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

export interface SiteSettings {
  id: string;
  siteName?: string;
  logo?: string;
  darkLogo?: string;
  favicon?: string;
  email?: string;
  phone?: string;
  address?: string;
  footerText?: string;
  copyright?: string;
  googleMap?: string;
  googleAnalytics?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Settings {
  id: string;
  siteName?: string;
  logo?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  telegram?: string;
  instagram?: string;
  linkedin?: string;
  whatsApp?: string;
  footerDescription?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SocialMedia {
  id: string;
  platform: string;
  url: string;
  icon?: string;
  displayOrder?: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  publishedPostCount?: number;
  createdAt?: string;
  updatedAt?: string;
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
  authorName?: string;
  authorAvatar?: string;
  createdAt?: string;
  updatedAt?: string;
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
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectDetailDto {
  id: string;
  userId: string;
  customerFullName?: string;
  customerEmail?: string;
  pricingPlanId: string;
  pricingPlanTitle?: string;
  projectCode?: string;
  title: string;
  description: string;
  status: number;
  progress: number;
  price: number;
  paidAmount: number;
  estimatedDeliveryDate?: string;
  startDate?: string;
  endDate?: string;
  adminNote?: string;
  customerComment?: string;
  createdAt: string;
  updatedAt?: string;
}

export type Project = ProjectDetailDto;

export interface User {
  id: string;
  fullName: string;
  email: string;
  userName?: string;
  phoneNumber?: string;
  role?: number | string;
  isActive?: boolean;
  emailConfirmed?: boolean;
  avatar?: string;
  lastLoginAt?: string;
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
  updatedAt?: string;
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

export interface InvoiceDetailDto {
  id: string;
  invoiceNumber?: string;
  userId?: string;
  customerFullName?: string;
  customerEmail?: string;
  projectId?: string;
  projectTitle?: string;
  amount: number;
  discountAmount?: number;
  taxAmount?: number;
  totalAmount?: number;
  status: number;
  description?: string;
  dueDate?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export type Invoice = InvoiceDetailDto;

export interface PaymentDetailDto {
  id: string;
  invoiceId?: string;
  invoiceNumber?: string;
  amount: number;
  gateway?: string;
  authority?: string;
  refId?: string;
  status: number;
  cardPan?: string;
  trackingCode?: string;
  paidAt?: string;
  createdAt: string;
}

export type Payment = PaymentDetailDto;

export interface TicketMessageDto {
  id: string;
  ticketId: string;
  userId: string;
  userFullName?: string;
  message: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber?: string;
  userId?: string;
  customerFullName?: string;
  customerEmail?: string;
  title: string;
  description: string;
  status: number;
  priority: number;
  assignedToUserId?: string;
  assignedToFullName?: string;
  closedAt?: string;
  createdAt: string;
  updatedAt?: string;
  messages?: TicketMessageDto[];
}

export interface Notification {
  id: string;
  userId?: string;
  userFullName?: string;
  userEmail?: string;
  type?: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt?: string;
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

export interface PortfolioListItem {
  id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  thumbnail: string;
  clientName: string;
  projectDate: string;
  isFeatured: boolean;
  displayOrder: number;
  categoryName?: string;
  categorySlug?: string;
  technologies?: PortfolioTechnology[];
}

export interface PortfolioDetail {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  clientName: string;
  projectDate: string;
  thumbnail: string;
  websiteUrl: string;
  githubUrl?: string;
  isFeatured: boolean;
  displayOrder: number;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  images?: PortfolioImage[];
  technologies?: PortfolioTechnology[];
}

export interface PortfolioImage {
  id: string;
  imageUrl: string;
  isCover: boolean;
  displayOrder: number;
}

export interface PortfolioTechnology {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}

export interface PortfolioCategory {
  id: string;
  name: string;
  slug: string;
  displayOrder?: number;
  portfolioCount?: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}
