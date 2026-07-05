import Link from "next/link";
import { MessageCircle, ExternalLink, Share2, Code2 } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Resume Builder", href: "/builder" },
    { label: "ATS Guide", href: "/ats-guide" },
    { label: "Pricing", href: "/pricing" },
    { label: "Templates", href: "/builder/preview" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Refund Policy", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center mb-4">
              <div className="flex items-center justify-center bg-[#000080] px-3 py-1.5 rounded-lg shadow-sm transition-transform hover:scale-105">
                <span className="font-display font-bold text-xl tracking-tight">
                  <span className="text-white">Intelli</span>
                  <span className="text-[#FF9900]">co</span>
                </span>
              </div>
            </Link>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-sm">
              Build ATS-optimized resumes in minutes using AI. Get more interviews, land your dream job.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a
                href="https://wa.me/919999999999?text=Hi%2C%20I%20need%20help%20with%20Intellico"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-green-400 border border-green-500/20 bg-green-500/5 hover:bg-green-500/10 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Support
              </a>
            </div>
            <div className="flex items-center gap-3 mt-4">
              {[
                { icon: Share2, href: "#", label: "Twitter" },
                { icon: ExternalLink, href: "#", label: "LinkedIn" },
                { icon: Code2, href: "#", label: "GitHub" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg glass flex items-center justify-center text-zinc-500 hover:text-white hover:border-brand-500/30 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-600">
            © {new Date().getFullYear()} Intellico. All rights reserved.
          </p>
          <p className="text-sm text-zinc-600">
            Made with ❤️ in India 🇮🇳 &nbsp;·&nbsp; Payments secured by{" "}
            <span className="text-brand-400">Razorpay</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
