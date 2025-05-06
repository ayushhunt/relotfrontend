'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Card } from '../../components/profile/ui/card';
import { Button } from '../../components/profile/ui/button';
import { ChevronRight } from 'lucide-react';
import React from 'react';

const navItems = [
  { label: 'Profile Information', href: '/account/profile-information' },
  { label: 'Manage Addresses', href: '/account/manage-address' },
  { label: 'PAN Card Information', href: '/account/pancard-information' },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-3">
            <Card className="p-6">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">AC</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Hello,</p>
                  <h2 className="font-semibold">Account</h2>
                </div>
              </div>
              <nav className="space-y-2">
                <div className="font-medium px-3 py-2">ACCOUNT SETTINGS</div>
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} legacyBehavior>
                    <a>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start ${pathname === item.href ? 'bg-blue-50 text-blue-600' : ''}`}
                      >
                        {item.label}
                      </Button>
                    </a>
                  </Link>
                ))}
                <div className="border-t my-4"></div>
                <div className="font-medium px-3 py-2">MY STUFF</div>
                {/* Add more nav sections as needed */}
              </nav>
            </Card>
          </div>
          <div className="md:col-span-9">{children}</div>
        </div>
      </div>
    </div>
  );
} 