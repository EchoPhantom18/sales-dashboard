import {
  LayoutDashboard,
  ShoppingCart,
  TrendingUp,
  Users,
  UserCheck,
  BarChart3,
  Wrench,
  Globe,
  Crown,
  Settings,
  HelpCircle,
  LogOut,
  FileText,
} from 'lucide-react';

export interface NavItem {
  label: string;
  icon: React.ElementType;
  active?: boolean;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const navSections: NavSection[] = [
  {
    title: 'Sales Operations',
    items: [
      { label: 'Overview', icon: LayoutDashboard, active: true },
      { label: 'Orders', icon: ShoppingCart },
      { label: 'Pipeline', icon: TrendingUp },
      { label: 'Manage Team', icon: Users },
      { label: 'Customers', icon: UserCheck },
    ],
  },
  {
    title: 'Analytics',
    items: [
      { label: 'Reports', icon: BarChart3 },
      { label: 'Forecasting', icon: FileText },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Channels', icon: Globe },
      { label: 'Upgrade Plan', icon: Crown },
      { label: 'Settings', icon: Settings },
    ],
  },
];

export const footerNav: NavItem[] = [
  { label: 'Support', icon: HelpCircle },
  { label: 'Log out', icon: LogOut },
];

export const calendarCategories = ['Enterprise', 'SMB', 'Startup', 'Partner'];

export function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  }
  if (value >= 1000) {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 0 })}`;
  }
  return `$${value.toFixed(2)}`;
}

export function formatLargeCurrency(value: number): string {
  const str = value.toLocaleString('en-IN');
  return `$${str}`;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export const avatarColors = [
  'bg-purple-200 text-purple-700',
  'bg-blue-200 text-blue-700',
  'bg-pink-200 text-pink-700',
  'bg-green-200 text-green-700',
  'bg-yellow-200 text-yellow-700',
  'bg-indigo-200 text-indigo-700',
];
