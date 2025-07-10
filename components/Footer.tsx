
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-surface/50 border-t border-gray-700/50 text-white py-10">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About Section */}
        <div>
          <h2 className="text-lg font-orbitron font-semibold mb-3">About RakhiStore</h2>
          <p className="text-sm text-gray-300">
            RakhiStore by Naman Goel offers premium handcrafted Rakhis and festive gifts to celebrate sibling love.
            Quality, tradition, and care—delivered to your doorstep.
          </p>
        </div>

        {/* Contact Section */}
        <div>
          <h2 className="text-lg font-orbitron font-semibold mb-3">Contact</h2>
          <p className="text-sm text-gray-300">📞 Phone: <a href="tel:9412118305" className="hover:text-brand-cyan transition-colors">9412118305</a></p>
          <p className="text-sm text-gray-300">📧 Email: <a href="mailto:namangoel236@gmail.com" className="hover:text-brand-cyan transition-colors">namangoel236@gmail.com</a></p>
          <p className="text-sm text-gray-300">📍 Location: Vishkarma Chowk, Muzaffarnagar (251001), Uttar Pradesh, India</p>
        </div>

        {/* Social Section */}
        <div>
          <h2 className="text-lg font-orbitron font-semibold mb-3">Follow Us</h2>
          <div className="flex space-x-4 mt-2">
            <a href="https://wa.me/919412118305" className="text-gray-300 hover:text-green-400 transition-colors" target="_blank" rel="noopener noreferrer">💬 WhatsApp</a>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-gray-700/50 mt-8 pt-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} RakhiStore | All Rights Reserved. <br />
        Designed & Developed by <span className="text-white font-semibold">Navneet Sharma</span>
      </div>
    </footer>
  );
};

export default Footer;
