// import React from "react";

// function Footer() {
//   return (
//     <footer className="footer">
//       <div className="footer-container">
//         <div className="footer-section">
//           <h3>Quick Links</h3>
//           <ul className="footer-links">
//             <li>
//               <a href="#buy">Buy</a>
//             </li>
//             <li>
//               <a href="#sell">Sell</a>
//             </li>
//             <li>
//               <a href="#faq">FAQ</a>
//             </li>
//             <li>
//               <a href="#">Financing</a>
//             </li>
//             <li>
//               <a href="#">Warranty</a>
//             </li>
//           </ul>
//         </div>
//         <div className="footer-section">
//           <h3>Support</h3>
//           <ul className="footer-links">
//             <li>
//               <a href="#contact">Contact Us</a>
//             </li>
//             <li>
//               <a href="#faq">Help Center</a>
//             </li>
//             <li>
//               <a href="#">Terms of Service</a>
//             </li>
//             <li>
//               <a href="#">Privacy Policy</a>
//             </li>
//           </ul>
//         </div>
//         <div className="footer-section">
//           <h3>Stay Connected</h3>
//           <p>Get the latest luxury car listings and exclusive deals.</p>
//           <div className="newsletter-signup">
//             <input
//               type="email"
//               className="newsletter-input"
//               placeholder="Enter your email"
//             />
//             <button className="newsletter-btn">Subscribe</button>
//           </div>
//           <div className="social-icons">
//             <a href="#" className="social-icon">
//               𝕏
//             </a>
//             <a href="#" className="social-icon">
//               📷
//             </a>
//             <a href="#" className="social-icon">
//               💬
//             </a>
//           </div>
//         </div>
//       </div>

//       {/* Footer bottom */}
//       <div className="mt-12 border-t border-blue-400 pt-6 text-center text-sm text-blue-300">
//         &copy; {new Date().getFullYear()} Motoket. All rights reserved.
//       </div>
//     </footer>
//   );
// }

// export default Footer;

import React, { useState } from "react";
import {
  Mail,
  Twitter,
  Instagram,
  MessageCircle,
  Phone,
  HelpCircle,
  Shield,
  FileText,
} from "lucide-react";

function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-black dark:bg-gray-900 text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Quick Links Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-yellow-400 dark:text-yellow-300 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Buy", href: "#buy" },
                { name: "Sell", href: "#sell" },
                { name: "FAQ", href: "#faq" },
                { name: "Financing", href: "#financing" },
                { name: "Warranty", href: "#warranty" },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-yellow-400 dark:text-gray-400 dark:hover:text-yellow-300 transition-colors duration-300 text-sm md:text-base"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-yellow-400 dark:text-yellow-300 mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Contact Us", href: "#contact", icon: Phone },
                { name: "Help Center", href: "#help", icon: HelpCircle },
                { name: "Terms of Service", href: "#terms", icon: FileText },
                { name: "Privacy Policy", href: "#privacy", icon: Shield },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="flex items-center space-x-2 text-gray-300 hover:text-yellow-400 dark:text-gray-400 dark:hover:text-yellow-300 transition-colors duration-300 text-sm md:text-base group"
                  >
                    <link.icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="md:col-span-2 lg:col-span-2 space-y-4">
            <h3 className="text-lg font-semibold text-yellow-400 dark:text-yellow-300 mb-4">
              Stay Connected
            </h3>
            <p className="text-gray-300 dark:text-gray-400 text-sm md:text-base leading-relaxed">
              Get the latest luxury car listings and exclusive deals delivered
              to your inbox.
            </p>

            {/* Newsletter Subscription */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-transparent border border-gray-600 dark:border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <button
                  onClick={handleSubscribe}
                  disabled={isSubscribed}
                  className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {isSubscribed ? "Subscribed!" : "Subscribe"}
                </button>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex space-x-4 pt-4">
              {[
                { icon: Twitter, href: "#twitter", label: "Twitter" },
                { icon: Instagram, href: "#instagram", label: "Instagram" },
                { icon: MessageCircle, href: "#chat", label: "Chat" },
                { icon: Mail, href: "#email", label: "Email" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 md:w-12 md:h-12 bg-gray-800 dark:bg-gray-700 hover:bg-yellow-400 text-white hover:text-black rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:rotate-6"
                >
                  <social.icon className="w-5 h-5 md:w-6 md:h-6" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 dark:text-gray-500 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Motoket. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center md:justify-end items-center space-x-6 text-xs text-gray-400 dark:text-gray-500">
              <span>Made with ❤️ for car enthusiasts</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Premium Auto Marketplace</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
    </footer>
  );
}

export default Footer;