import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Calendar } from "lucide-react";
import { Portfolio } from "@/context/PortfolioContext";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface PortfolioDetailDialogProps {
  portfolio: Portfolio;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PortfolioDetailDialog = ({ portfolio, open, onOpenChange }: PortfolioDetailDialogProps) => {
  const images = Array.isArray(portfolio.images) 
    ? portfolio.images 
    : typeof portfolio.images === 'string' 
    ? JSON.parse(portfolio.images) 
    : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {portfolio.name}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4" />
              {new Date(portfolio.created_at || '').toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            {portfolio.project_link && (
              <Button 
                variant="link" 
                size="sm" 
                className="p-0 h-auto"
                onClick={() => window.open(portfolio.project_link, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                View Live Project
              </Button>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Description Section */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Project Description</h3>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {portfolio.description}
            </p>
          </div>

          {/* Image Gallery */}
          {images.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Project Gallery</h3>
                <Badge variant="secondary">
                  {images.length} {images.length === 1 ? 'Image' : 'Images'}
                </Badge>
              </div>

              <Carousel className="w-full">
                <CarouselContent>
                  {images.map((img: any, index: number) => (
                    <CarouselItem key={index}>
                      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted">
                        <img
                          src={img.image}
                          alt={`${portfolio.name} - Image ${index + 1}`}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
                          }}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {images.length > 1 && (
                  <>
                    <CarouselPrevious className="left-2" />
                    <CarouselNext className="right-2" />
                  </>
                )}
              </Carousel>

              {/* Thumbnail Navigation */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 mt-4">
                  {images.map((img: any, index: number) => (
                    <div 
                      key={index}
                      className="relative aspect-square overflow-hidden rounded border border-border cursor-pointer hover:border-primary transition-colors"
                    >
                      <img
                        src={img.image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/100x100?text=Img';
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Project Link Button */}
          {portfolio.project_link && (
            <Button 
              className="w-full"
              onClick={() => window.open(portfolio.project_link, '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Visit Project Website
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
