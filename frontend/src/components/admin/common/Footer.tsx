import { Mail, HelpCircle, Settings } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          {/* Left Side - Copyright */}
          <div className="text-gray-600 text-sm">
            © {currentYear} Team Liquid All rights reserved.
          </div>

          {/* Right Side - Links */}
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              Trợ giúp
            </a>
            <a
              href="#"
              className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Settings className="w-4 h-4" />
              Cài đặt
            </a>
            <a
              href="mailto:support@admin.com"
              className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Mail className="w-4 h-4" />
              Hỗ trợ
            </a>
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
              v2.1.0
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
