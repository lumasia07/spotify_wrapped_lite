'use client';

import Image from 'next/image';
import { 
  Mail, 
  Twitter, 
  Github, 
  Instagram, 
  MessageCircle,
  ExternalLink,
  Heart,
  Music,
  Send
} from 'lucide-react';

const FooterSection = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Features', href: '#features', icon: Music },
      { name: 'Pricing', href: '#pricing', icon: ExternalLink },
      { name: 'API', href: '#api', icon: ExternalLink },
      { name: 'Updates', href: '#updates', icon: ExternalLink }
    ],
    company: [
      { name: 'About', href: '#about', icon: ExternalLink },
      { name: 'Blog', href: '#blog', icon: ExternalLink },
      { name: 'Careers', href: '#careers', icon: ExternalLink },
      { name: 'Contact', href: '#contact', icon: Mail }
    ],
    support: [
      { name: 'Help Center', href: '#help', icon: ExternalLink },
      { name: 'Privacy Policy', href: '#privacy', icon: ExternalLink },
      { name: 'Terms of Service', href: '#terms', icon: ExternalLink },
      { name: 'Status', href: '#status', icon: ExternalLink }
    ]
  };

  const socialLinks = [
    { name: 'Twitter', href: '#', icon: Twitter, color: 'hover:bg-blue-500' },
    { name: 'GitHub', href: '#', icon: Github, color: 'hover:bg-gray-600' },
    { name: 'Discord', href: '#', icon: MessageCircle, color: 'hover:bg-indigo-500' },
    { name: 'Instagram', href: '#', icon: Instagram, color: 'hover:bg-pink-500' }
  ];

  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8 sm:mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <div className="relative w-8 h-8">
                <Image
                  src="/Spotify_Primary_Logo_RGB_Green.png"
                  alt="Spotify Wrapped Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-lg sm:text-xl font-bold text-white">Spotify Wrapped Lite</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md text-sm sm:text-base leading-relaxed">
              Discover your musical journey with personalized insights and analytics. 
              Connect with Spotify to unlock your unique listening story.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-3 sm:space-x-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className={`w-10 h-10 bg-gray-800 ${social.color} rounded-full flex items-center justify-center transition-all duration-300 text-white hover:text-white transform hover:scale-110`}
                    aria-label={social.name}
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-base sm:text-lg">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => {
                const IconComponent = link.icon;
                return (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-green-400 transition-colors duration-200 flex items-center space-x-2 text-sm sm:text-base group"
                    >
                      <IconComponent className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      <span>{link.name}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-base sm:text-lg">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => {
                const IconComponent = link.icon;
                return (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-green-400 transition-colors duration-200 flex items-center space-x-2 text-sm sm:text-base group"
                    >
                      <IconComponent className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      <span>{link.name}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-base sm:text-lg">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => {
                const IconComponent = link.icon;
                return (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-green-400 transition-colors duration-200 flex items-center space-x-2 text-sm sm:text-base group"
                    >
                      <IconComponent className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      <span>{link.name}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="max-w-md mx-auto text-center">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Mail className="w-5 h-5 text-green-400" />
              <h3 className="text-white font-semibold text-base sm:text-lg">Stay in the loop</h3>
            </div>
            <p className="text-gray-400 mb-4 text-sm sm:text-base">Get notified about new features and updates</p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200 text-sm"
              />
              <button className="px-6 py-3 bg-green-500 hover:bg-green-600 text-black font-medium rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2">
                <Send className="w-4 h-4" />
                <span>Subscribe</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 text-gray-400 text-sm">
            <span>© {currentYear} Spotify Wrapped Lite. Made with</span>
            <Heart className="w-4 h-4 text-red-500 animate-pulse" />
            <span>for music lovers</span>
          </div>
          <div className="flex flex-wrap justify-center space-x-4 sm:space-x-6 text-sm text-gray-400">
            <a href="#" className="hover:text-green-400 transition-colors duration-200 flex items-center space-x-1">
              <ExternalLink className="w-3 h-3" />
              <span>Privacy Policy</span>
            </a>
            <a href="#" className="hover:text-green-400 transition-colors duration-200 flex items-center space-x-1">
              <ExternalLink className="w-3 h-3" />
              <span>Terms of Service</span>
            </a>
            <a href="#" className="hover:text-green-400 transition-colors duration-200 flex items-center space-x-1">
              <ExternalLink className="w-3 h-3" />
              <span>Cookie Policy</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
