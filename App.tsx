import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/ToasterComponent";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import FrameworksPage from "@/pages/FrameworksPage";
import FrameworkDetail from "@/pages/FrameworkDetail";
import BrainMap from "@/pages/BrainMap";
import TensorGeometry from "@/pages/TensorGeometry";
import NeurofeedbackPage from "@/pages/NeurofeedbackPage";
import TensorPatternsPage from "@/pages/TensorPatternsPage";
import TherapyMatchingPage from "./pages/TherapyMatchingPage";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ParticleBackground from "@/components/ParticleBackground";
import SystemStatusMonitor from "@/components/SystemStatusMonitor";

function App() {
  return (
    <div className="relative flex flex-col min-h-screen bg-neutral-dark text-neutral-light font-sans overflow-x-hidden">
      <ParticleBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/frameworks" component={FrameworksPage} />
            <Route path="/frameworks/:id" component={FrameworkDetail} />
            <Route path="/brain-map" component={BrainMap} />
            <Route path="/tensors" component={TensorGeometry} />
            <Route path="/tensor-patterns" component={TensorPatternsPage} />
            <Route path="/neurofeedback" component={NeurofeedbackPage} />
            <Route path="/therapy-matching" component={TherapyMatchingPage} />
            <Route component={NotFound} />
          </Switch>
        </main>
        <Footer />
      </div>
      <Toaster />
      <SystemStatusMonitor />
    </div>
  );
}

export default App;
