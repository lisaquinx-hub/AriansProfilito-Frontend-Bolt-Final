import {
  BriefcaseBusiness,
  Building2,
  Code2,
  Globe2,
  LayoutDashboard,
  Palette,
  SearchCheck,
  Server,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Store,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, LucideIcon> = {
  shoppingcart: ShoppingCart,
  cart: ShoppingCart,
  ecommerce: ShoppingCart,
  store: Store,
  building2: Building2,
  building: Building2,
  corporate: Building2,
  business: BriefcaseBusiness,
  briefcasebusiness: BriefcaseBusiness,
  code2: Code2,
  code: Code2,
  custom: Code2,
  smartphone: Smartphone,
  mobile: Smartphone,
  layoutdashboard: LayoutDashboard,
  dashboard: LayoutDashboard,
  globe2: Globe2,
  globe: Globe2,
  website: Globe2,
  palette: Palette,
  design: Palette,
  server: Server,
  backend: Server,
  wrench: Wrench,
  search: SearchCheck,
  seo: SearchCheck,
  security: ShieldCheck,
  shield: ShieldCheck,
};

function normalizeIconName(value?: string | null): string {
  return (value || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

function inferIconFromTitle(title: string): LucideIcon {
  if (/فروشگاه|خرید|shop|e-?commerce/i.test(title)) return ShoppingCart;
  if (/شرکت|سازمانی|corporate|business/i.test(title)) return Building2;
  if (/سفارشی|اختصاصی|custom/i.test(title)) return Code2;
  if (/موبایل|اپلیکیشن|mobile|app/i.test(title)) return Smartphone;
  if (/داشبورد|dashboard/i.test(title)) return LayoutDashboard;
  if (/طراح|design/i.test(title)) return Palette;
  if (/سرور|بک.?اند|backend|server/i.test(title)) return Server;
  if (/سئو|بهینه|seo|search/i.test(title)) return SearchCheck;
  if (/امن|security|ssl/i.test(title)) return ShieldCheck;
  if (/وب|سایت|website|web/i.test(title)) return Globe2;
  return BriefcaseBusiness;
}

interface ServiceIconProps {
  icon?: string | null;
  title: string;
  className?: string;
}

export function ServiceIcon({ icon, title, className }: ServiceIconProps) {
  const Icon = iconMap[normalizeIconName(icon)] || inferIconFromTitle(title);

  return <Icon aria-hidden="true" className={cn('h-7 w-7', className)} />;
}
