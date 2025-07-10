import React from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const AnimatedSection: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [ref, isVisible] = useIntersectionObserver<HTMLDivElement>({ threshold: 0.1 });
  return (
    <div ref={ref} className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      {children}
    </div>
  );
};

const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      <header className="text-center">
        <h1 className="font-orbitron text-4xl md:text-6xl font-black text-white uppercase tracking-widest">Our Story</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300">
          We are more than a store. We are architects of memories, blending time-honored customs with heartfelt design.
        </p>
      </header>
      
      <AnimatedSection>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="md:order-last">
            <h2 className="font-orbitron text-3xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-gray-300 mb-4">
              At RakhiStore, we believe Raksha Bandhan is not just a festival — it's a heartfelt expression of sibling love. Our mission is to bring beauty, meaning, and convenience to your celebration.
            </p>
            <p className="text-gray-300">
              We curate and create Rakhis that are not just threads, but threads of love that connect hearts, no matter the distance.
            </p>
          </div>
          <img src="https://images.pexels.com/photos/7944062/pexels-photo-7944062.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Crafting Rakhis" className="rounded-lg shadow-lg shadow-brand-purple/20 w-full h-auto object-cover aspect-video" />
        </div>
      </AnimatedSection>

      <AnimatedSection>
        <div className="text-center">
            <h2 className="font-orbitron text-3xl font-bold text-white mb-8">What Sets Us Apart</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="bg-brand-surface/50 p-6 rounded-lg border border-gray-700/50 h-full">
                    <h3 className="font-semibold text-brand-cyan text-xl mb-2">Smart Recommender</h3>
                    <p className="text-sm text-gray-400">Our AI assistant helps you find the perfect Rakhi based on your needs.</p>
                </div>
                <div className="bg-brand-surface/50 p-6 rounded-lg border border-gray-700/50 h-full">
                    <h3 className="font-semibold text-brand-cyan text-xl mb-2">Modern Aesthetics</h3>
                    <p className="text-sm text-gray-400">A fusion of handmade charm and modern design principles.</p>
                </div>
                <div className="bg-brand-surface/50 p-6 rounded-lg border border-gray-700/50 h-full">
                    <h3 className="font-semibold text-brand-cyan text-xl mb-2">Quality Craftsmanship</h3>
                    <p className="text-sm text-gray-400">Our designs are chosen with emotion and crafted with care.</p>
                </div>
                 <div className="bg-brand-surface/50 p-6 rounded-lg border border-gray-700/50 h-full">
                    <h3 className="font-semibold text-brand-cyan text-xl mb-2">Sustainable Packaging</h3>
                    <p className="text-sm text-gray-400">Beautiful, premium finishing with an eco-friendly approach.</p>
                </div>
            </div>
        </div>
      </AnimatedSection>

      <AnimatedSection>
        <div className="grid md:grid-cols-2 gap-12 items-center">
           <img src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="The RakhiStore Team" className="rounded-lg shadow-lg shadow-brand-pink/20 w-full h-auto object-cover aspect-video" />
           <div>
              <h2 className="font-orbitron text-3xl font-bold text-white mb-4">The Team</h2>
              <p className="text-gray-300 mb-4">
                RakhiStore was brought to life by <strong className="text-white">Naman Goel</strong>, a visionary entrepreneur passionate about tradition and creativity.
              </p>
               <p className="text-gray-300">
                With the technical expertise of <strong className="text-white">Navneet Sharma</strong>, the site was built to serve families and hearts across India, blending craftsmanship with technology.
              </p>
           </div>
        </div>
      </AnimatedSection>
      
       <AnimatedSection>
        <div className="bg-brand-surface/50 p-8 md:p-12 rounded-2xl border border-gray-700/50 text-center">
            <h2 className="font-orbitron text-3xl font-bold text-white mb-4">Contact & Connect</h2>
             <p className="text-gray-300 mb-2">📧 Email: <a href="mailto:namangoel236@gmail.com" className="hover:text-brand-cyan transition-colors">namangoel236@gmail.com</a></p>
             <p className="text-gray-300 mb-2">📞 Phone: <a href="tel:9412118305" className="hover:text-brand-cyan transition-colors">9412118305</a></p>
             <p className="text-gray-300 mb-4">📍 Location: Vishkarma Chowk, Muzaffarnagar (251001), Uttar Pradesh, India</p>
            <div className="flex justify-center space-x-6 mt-4">
                <a href="https://wa.me/919412118305" className="text-gray-300 hover:text-green-400 transition-colors" target="_blank" rel="noopener noreferrer">💬 WhatsApp</a>
            </div>
        </div>
      </AnimatedSection>

    </div>
  );
};

export default AboutPage;