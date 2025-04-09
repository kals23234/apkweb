import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="border-t border-primary/20 p-6 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="mb-4 md:mb-0">
          <h2 className="font-display text-lg font-bold">
            <span className="text-primary">Bharadwaj</span> Framework
          </h2>
          <p className="text-xs opacity-70">World's First NeuroPhysics Tensor Based Cognitive Model</p>
        </div>
        
        <div className="flex items-center space-x-6">
          <Link href="/frameworks">
            <a className="text-sm hover:text-primary transition-colors">Frameworks</a>
          </Link>
          <Link href="/brain-map">
            <a className="text-sm hover:text-primary transition-colors">Brain Map</a>
          </Link>
          <Link href="/tensors">
            <a className="text-sm hover:text-primary transition-colors">Tensors</a>
          </Link>
        </div>
      </div>
      
      <div className="pt-4 border-t border-neutral-800/30 text-center">
        <p className="text-sm text-blue-400 font-mono tracking-wide bg-blue-900/20 px-3 py-1 rounded-full border border-blue-800/20 inline-block">
          Bharadwaj Mainframe Created & Designed By Abinash Bharadwaj
        </p>
        <p className="text-xs text-neutral-400 mt-2 max-w-2xl mx-auto">
          Exploring Cognitive Physics & Tensor Based Neuro Solutions for Advance Therapy
        </p>
      </div>
    </footer>
  );
};

export default Footer;
