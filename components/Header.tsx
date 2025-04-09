import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, Mail, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";

const Header = () => {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { title: "Frameworks", path: "/frameworks" },
    { title: "Brain Map", path: "/brain-map" },
    { title: "Tensors", path: "/tensors" },
    { title: "Tensor Patterns", path: "/tensor-patterns" },
    { title: "Neurofeedback", path: "/neurofeedback" },
    { title: "Therapy Matching", path: "/therapy-matching" },
  ];

  const isActive = (path: string) => location === path;

  return (
    <header className="p-4 flex items-center justify-between border-b border-primary/20 backdrop-blur-sm">
      <div className="flex items-center space-x-2">
        <Link href="/">
          <div className="relative w-10 h-10 cursor-pointer">
            <div className="absolute inset-0 bg-primary rounded-lg animate-pulse-slow opacity-70"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-6 h-6 text-neutral-light" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </Link>
        <Link href="/">
          <div className="flex flex-col cursor-pointer">
            <div className="relative text-xs text-blue-400 font-mono tracking-wider bg-blue-900/20 px-3 py-1 rounded-full border border-blue-900/30 flex items-center">
              <span className="mr-2">ADVANCED BHARADWAJ TENSOR INTERFACE v.MaxMind</span>
              {/* Floating particles */}
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-pulse-slow"></div>
              <div className="absolute -bottom-1 right-2 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse-slow" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute top-0 right-4 w-1 h-1 bg-cyan-400 rounded-full animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
            </div>
            <h1 className="font-display text-xl font-bold tracking-tight">
              <span className="text-primary glow-text">Abinash Bharadwaj's</span> Neuro Cognitive - Advance Physics Based Tensor Model
            </h1>
          </div>
        </Link>
      </div>
      
      <nav className="hidden md:flex items-center space-x-8 text-sm">
        {navItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <a className={`hover:text-primary transition-colors py-2 border-b-2 ${isActive(item.path) ? 'border-primary' : 'border-transparent'}`}>
              {item.title}
            </a>
          </Link>
        ))}
      </nav>

      <div className="flex items-center space-x-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="hidden md:flex text-primary">
              <Mail className="mr-2 h-4 w-4" />
              Contact
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-neutral-dark border-primary/20 backdrop-blur-sm">
            <DialogHeader>
              <DialogTitle className="text-2xl text-primary">Contact Information</DialogTitle>
              <DialogDescription>
                Book a counselling session or get in touch for cognitive assessments
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="flex items-start space-x-4 p-3 rounded-lg bg-primary/10">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium text-white">Email</h3>
                  <p className="text-neutral-light">abnadvance@gmail.com</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-3 rounded-lg bg-primary/10">
                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium text-white">Book a Session</h3>
                  <p className="text-neutral-light">For cognitive assessment and therapy sessions, please email to schedule an appointment.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-3 rounded-lg bg-primary/10">
                <svg className="h-5 w-5 text-primary mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
                <div>
                  <h3 className="font-medium text-white">Online Consultations</h3>
                  <p className="text-neutral-light">International clients welcome. Virtual sessions available worldwide.</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" className="w-full bg-primary/80 hover:bg-primary">
                <a href="mailto:abnadvance@gmail.com" className="w-full flex items-center justify-center">
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Now
                </a>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Button variant="ghost" size="icon" className="rounded-full bg-primary/20 hover:bg-primary/30">
          <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </Button>

        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="rounded-full bg-primary/20 hover:bg-primary/30">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-neutral-dark border-primary/20 backdrop-blur-sm">
            <div className="flex flex-col gap-6 mt-10">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <a 
                    className={`text-lg font-display ${isActive(item.path) ? 'text-primary' : 'text-neutral-light'} hover:text-primary transition-colors`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.title}
                  </a>
                </Link>
              ))}
              
              <Dialog>
                <DialogTrigger asChild>
                  <a className="text-lg font-display text-primary flex items-center cursor-pointer">
                    <Mail className="mr-2 h-5 w-5" />
                    Contact
                  </a>
                </DialogTrigger>
                <DialogContent className="bg-neutral-dark border-primary/20 backdrop-blur-sm">
                  <DialogHeader>
                    <DialogTitle className="text-2xl text-primary">Contact Information</DialogTitle>
                    <DialogDescription>
                      Book a counselling session or get in touch for cognitive assessments
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4 space-y-4">
                    <div className="flex items-start space-x-4 p-3 rounded-lg bg-primary/10">
                      <Mail className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium text-white">Email</h3>
                        <p className="text-neutral-light">abnadvance@gmail.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4 p-3 rounded-lg bg-primary/10">
                      <Calendar className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium text-white">Book a Session</h3>
                        <p className="text-neutral-light">For cognitive assessment and therapy sessions, please email to schedule an appointment.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4 p-3 rounded-lg bg-primary/10">
                      <svg className="h-5 w-5 text-primary mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                      </svg>
                      <div>
                        <h3 className="font-medium text-white">Online Consultations</h3>
                        <p className="text-neutral-light">International clients welcome. Virtual sessions available worldwide.</p>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" className="w-full bg-primary/80 hover:bg-primary">
                      <a href="mailto:abnadvance@gmail.com" className="w-full flex items-center justify-center">
                        <Mail className="mr-2 h-4 w-4" />
                        Contact Now
                      </a>
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
