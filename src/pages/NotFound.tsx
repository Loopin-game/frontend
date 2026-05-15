import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full bg-volt/20 animate-ping" />
          <div className="absolute inset-2 rounded-full bg-volt/40 animate-pulse" />
          <div className="absolute inset-4 rounded-full bg-volt flex items-center justify-center">
            <span className="font-display text-2xl font-bold">?</span>
          </div>
        </div>

        <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight mb-4">404</h1>
        <h2 className="font-display text-2xl font-semibold mb-4">Lost in the Grid</h2>
        <p className="text-muted-foreground mb-8">This territory hasn't been captured yet.</p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/">
            <Button variant="hero" size="lg">
              <Home className="w-5 h-5" />
              Return Home
            </Button>
          </Link>
          <Button variant="outline" size="lg" onClick={() => window.history.back()}>
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
