import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SignOutButton } from '@clerk/nextjs';
import { Bell, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { submitWorkflow } from '@/lib/marketplace-client';

export function notifyDashboardAction(title, description = 'This workspace action is ready for backend integration.') {
  toast({ title, description });
}

export async function runDashboardWorkflow(kind, title, data = {}, description = 'The workflow request has been recorded.') {
  try {
    await submitWorkflow(kind, data);
    toast({ title, description });
  } catch (error) {
    toast({
      title: 'Action could not be completed',
      description: error.message,
    });
  }
}

export function DashboardSidebar({ portalLabel, navItems, activeSection, onSectionChange }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 border-r border-border/50 bg-secondary/30 hidden lg:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border/50">
          <Link to="/" className="text-2xl font-extrabold text-gradient tracking-tight">RentGrid</Link>
        </div>
        <div className="p-4">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 px-2">{portalLabel}</p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.label;

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => onSectionChange(item.label)}
                  className={`w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile Header Bar (replaces sidebar on mobile) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4 bg-background border-b border-border/50">
        <Link to="/" className="text-xl font-extrabold text-gradient tracking-tight">RentGrid</Link>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">{activeSection}</span>
          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="p-2 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-14 left-0 right-0 z-40 bg-background border-b border-border/50 shadow-lg">
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.label;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    onSectionChange(item.label);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}

export function DashboardHeaderActions({ initials, avatarClassName = 'bg-primary/20 text-primary border-primary/30' }) {
  return (
    <div className="flex items-center space-x-3">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="rounded-full text-muted-foreground"
        aria-label="View notifications"
        onClick={() => notifyDashboardAction('Notifications', 'You have no new notifications right now.')}
      >
        <Bell className="h-5 w-5" />
      </Button>
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold border ${avatarClassName}`}
        role="img"
        aria-label="User avatar"
      >
        {initials}
      </div>
      <SignOutButton redirectUrl="/">
        <Button type="button" variant="outline" size="sm" className="rounded-full">
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </SignOutButton>
    </div>
  );
}
