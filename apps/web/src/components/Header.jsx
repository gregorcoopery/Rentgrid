import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Menu, ChevronDown, Building2, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { usePermissions } from '@/components/PermissionProvider.jsx';
import { getDashboardRoute } from '@/lib/permissions';


const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { role } = usePermissions();
  const dashboardRoute = getDashboardRoute(role) || '/tenant-dashboard';

  const isActive = (path) => {
    if (path.includes('?')) {
      return location.pathname === path.split('?')[0] && location.search === '?' + path.split('?')[1];
    }
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-extrabold text-gradient tracking-tight">RentGrid</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link
              to="/"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
            >
              Home
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors focus:outline-none">
                  Rentals <ChevronDown className="ml-1 h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/browse-rentals?segment=general" className="w-full cursor-pointer font-medium">
                    <Building2 className="mr-2 h-4 w-4" />
                    General Rentals
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/for-students" className="w-full cursor-pointer font-medium">
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Student Rentals
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              to="/for-landlords"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/for-landlords') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
            >
              For Landlords
            </Link>
            <Link
              to="/for-agents"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/for-agents') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
            >
              For Agents
            </Link>
            <Link
              to="/for-service-providers"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/for-service-providers') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
            >
              For Service Providers
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center space-x-3">
            <SignedOut>
              <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
                <Link to="/sign-in">Sign In</Link>
              </Button>
            </SignedOut>
            <SignedIn>
              <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
                <Link to={dashboardRoute}>Dashboard</Link>
              </Button>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm shadow-primary/20 rounded-full px-6">
              <Link to="/for-landlords">List Property</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" aria-label="Open Menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col h-full">
                <div className="flex items-center space-x-2 mb-8 mt-4">
                  <span className="text-2xl font-extrabold text-gradient tracking-tight">RentGrid</span>
                </div>
                <nav className="flex flex-col space-y-1 flex-1">
                  <Link
                    to="/"
                    onClick={() => setIsOpen(false)}
                    className={`px-4 py-3 rounded-lg text-base font-medium transition-colors ${isActive('/') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                      }`}
                  >
                    Home
                  </Link>
                  <div className="py-2 px-4 text-sm font-bold text-foreground tracking-wider uppercase mt-2">Rentals</div>
                  <Link
                    to="/browse-rentals?segment=general"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors ml-4"
                  >
                    <Building2 className="mr-3 h-5 w-5" /> General Rentals
                  </Link>
                  <Link
                    to="/for-students"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors ml-4"
                  >
                    <GraduationCap className="mr-3 h-5 w-5" /> Student Rentals
                  </Link>

                  <div className="py-2 px-4 text-sm font-bold text-foreground tracking-wider uppercase mt-4">Partners</div>
                  <Link
                    to="/for-landlords"
                    onClick={() => setIsOpen(false)}
                    className={`px-4 py-3 rounded-lg text-base font-medium transition-colors ${isActive('/for-landlords') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                      }`}
                  >
                    For Landlords
                  </Link>
                  <Link
                    to="/for-agents"
                    onClick={() => setIsOpen(false)}
                    className={`px-4 py-3 rounded-lg text-base font-medium transition-colors ${isActive('/for-agents') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                      }`}
                  >
                    For Agents
                  </Link>
                  <Link
                    to="/for-service-providers"
                    onClick={() => setIsOpen(false)}
                    className={`px-4 py-3 rounded-lg text-base font-medium transition-colors ${isActive('/for-service-providers') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                      }`}
                  >
                    For Service Providers
                  </Link>
                </nav>
                <div className="pt-6 mt-auto border-t border-border flex flex-col space-y-3 pb-8">
                  <SignedOut>
                    <Button variant="outline" className="w-full justify-center rounded-full" asChild>
                      <Link to="/sign-in" onClick={() => setIsOpen(false)}>
                        Sign In
                      </Link>
                    </Button>
                  </SignedOut>
                  <SignedIn>
                    <Button variant="outline" className="w-full justify-center rounded-full" asChild>
                      <Link to={dashboardRoute} onClick={() => setIsOpen(false)}>
                        Dashboard
                      </Link>
                    </Button>
                    <div className="flex justify-center py-2">
                      <UserButton afterSignOutUrl="/" />
                    </div>
                  </SignedIn>
                  <Button className="w-full justify-center rounded-full shadow-sm shadow-primary/20" asChild>
                    <Link to="/for-landlords" onClick={() => setIsOpen(false)}>
                      List Property
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
