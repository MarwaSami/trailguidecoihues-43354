import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePortfolio } from "@/context/PortfolioContext";
import { Loader2, ExternalLink, Calendar, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PortfolioDetailDialog } from "@/components/portfolio/PortfolioDetailDialog";
import { Portfolio } from "@/context/PortfolioContext";

const ViewPortfolio = () => {
  const { portfolios, loading, error } = usePortfolio();
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
              <p className="text-muted-foreground">Loading portfolios...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Error Loading Portfolios</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                My Portfolio
              </h1>
              <p className="text-muted-foreground">
                Showcase of my projects and achievements
              </p>
            </div>
            <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white">
              <a href="/add-portfolio">Add New Portfolio</a>
            </Button>
          </div>
        </div>

        {portfolios.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
              <ImageIcon className="w-16 h-16 text-muted-foreground/50" />
              <div className="text-center space-y-2">
                <p className="text-xl font-medium text-muted-foreground">No portfolios yet</p>
                <p className="text-sm text-muted-foreground">
                  Start adding your projects to showcase your work
                </p>
              </div>
              <Button asChild>
                <a href="/add-portfolio">Add Portfolio</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolios.map((portfolio) => (
              <Card 
                key={portfolio.id} 
                className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-border/50 bg-gradient-to-br from-background to-background/80"
                onClick={() => setSelectedPortfolio(portfolio)}
              >
                <div className="relative h-48 overflow-hidden bg-muted">
                  {portfolio.images && Array.isArray(portfolio.images) && portfolio.images.length > 0 ? (
                    <img
                      src={portfolio.images[0].image}
                      alt={portfolio.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Portfolio+Image';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-16 h-16 text-muted-foreground/30" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                      <ImageIcon className="w-3 h-3 mr-1" />
                      {Array.isArray(portfolio.images) ? portfolio.images.length : 0}
                    </Badge>
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors">
                    {portfolio.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 text-sm">
                    {portfolio.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {new Date(portfolio.created_at || '').toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>

                  {portfolio.project_link && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full group/btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(portfolio.project_link, '_blank');
                      }}
                    >
                      <ExternalLink className="w-3 h-3 mr-2 group-hover/btn:translate-x-0.5 transition-transform" />
                      View Project
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {selectedPortfolio && (
        <PortfolioDetailDialog
          portfolio={selectedPortfolio}
          open={!!selectedPortfolio}
          onOpenChange={(open) => !open && setSelectedPortfolio(null)}
        />
      )}
    </div>
  );
};

export default ViewPortfolio;
