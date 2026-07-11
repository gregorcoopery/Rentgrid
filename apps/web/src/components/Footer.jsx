import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin } from 'lucide-react';
import { usePermissions } from '@/components/PermissionProvider.jsx';
import { getDashboardRoute } from '@/lib/permissions';

const Footer = () => {
  const { role } = usePermissions();
  const dashboardRoute = getDashboardRoute(role);
  const footerLinks = {
    'Rentals': [
      { name: 'General Rentals', path: '/browse-rentals?segment=general' },
      { name: 'Student Rentals', path: '/for-students' },
      { name: 'Browse All', path: '/browse-rentals' },
    ],
    'Partners': [
      { name: 'For Landlords', path: '/for-landlords' },
      { name: 'For Agents', path: '/for-agents' },
      { name: dashboardRoute ? 'My Dashboard' : 'Browse Rentals', path: dashboardRoute || '/browse-rentals' },
    ],
    'Support': [
      { name: 'FAQ', path: '/faq' },
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/rentgrid.ng', label: 'Facebook' },
    { icon: Twitter, href: 'https://x.com/rentgrid_ng', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com/rentgrid.ng', label: 'Instagram' },
    { icon: Linkedin, href: 'https://linkedin.com/company/rentgrid-ng', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-secondary/50 border-t border-border mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-extrabold text-gradient tracking-tight">RentGrid</span>
            </Link>
            <p className="text-base text-muted-foreground max-w-sm leading-relaxed">
              Nigeria's trusted marketplace for verified general and student rentals. Transparent pricing, secure payments, and verified properties.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors shadow-sm"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <span className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 block">{category}</span>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-base text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} RentGrid. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <span className="flex items-center"><Mail className="w-4 h-4 mr-2" /> support@rentgrid.ng</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
