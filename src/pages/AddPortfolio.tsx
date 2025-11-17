import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePortfolio } from "@/context/PortfolioContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, X, ImageIcon, FileText } from "lucide-react";

const AddPortfolio = () => {
  const { addPortfolio, loading } = usePortfolio();
  const { toast } = useToast();
  const [portfolioData, setPortfolioData] = useState({
    name: "",
    description: "",
    project_link: "",
    uploaded_images: [] as File[],
  });
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    images: "",
  });
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const validateForm = () => {
    const newErrors = {
      name: "",
      description: "",
      images: "",
    };
    let isValid = true;

    // Validate name
    if (!portfolioData.name.trim()) {
      newErrors.name = "Project name is required";
      isValid = false;
    } else if (portfolioData.name.trim().length < 3) {
      newErrors.name = "Project name must be at least 3 characters";
      isValid = false;
    } else if (portfolioData.name.trim().length > 100) {
      newErrors.name = "Project name must not exceed 100 characters";
      isValid = false;
    }

    // Validate description
    if (!portfolioData.description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    } else if (portfolioData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
      isValid = false;
    } else if (portfolioData.description.trim().length > 2000) {
      newErrors.description = "Description must not exceed 2000 characters";
      isValid = false;
    }

    // Validate images
    if (portfolioData.uploaded_images.length === 0) {
      newErrors.images = "At least one image is required";
      isValid = false;
    } else if (portfolioData.uploaded_images.length > 10) {
      newErrors.images = "Maximum 10 images allowed";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      // Validate file types and sizes
      const validFiles = filesArray.filter(file => {
        const isValidType = file.type.startsWith('image/');
        const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
        
        if (!isValidType) {
          toast({
            title: "Invalid file type",
            description: `${file.name} is not an image file`,
            variant: "destructive",
          });
          return false;
        }
        
        if (!isValidSize) {
          toast({
            title: "File too large",
            description: `${file.name} exceeds 5MB limit`,
            variant: "destructive",
          });
          return false;
        }
        
        return true;
      });
      
      const newImages = [...portfolioData.uploaded_images, ...validFiles];
      
      if (newImages.length > 10) {
        toast({
          title: "Too many images",
          description: "Maximum 10 images allowed",
          variant: "destructive",
        });
        return;
      }
      
      // Create preview URLs
      const newPreviews = validFiles.map(file => URL.createObjectURL(file));
      setImagePreviews([...imagePreviews, ...newPreviews]);
      
      setPortfolioData({ ...portfolioData, uploaded_images: newImages });
      setErrors({ ...errors, images: "" });
    }
  };

  const removeImage = (index: number) => {
    const newImages = portfolioData.uploaded_images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    
    // Revoke the URL to free memory
    URL.revokeObjectURL(imagePreviews[index]);
    
    setPortfolioData({ ...portfolioData, uploaded_images: newImages });
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', portfolioData.name.trim());
      formData.append('description', portfolioData.description.trim());
      if (portfolioData.project_link.trim()) {
        formData.append('project_link', portfolioData.project_link.trim());
      }
      portfolioData.uploaded_images.forEach((image, index) => {
        formData.append('images', image);
      });

      await addPortfolio(formData);

      toast({
        title: "Success!",
        description: "Portfolio item added successfully",
      });

      // Reset form
      setPortfolioData({
        name: "",
        description: "",
        project_link: "",
        uploaded_images: [],
      });
      setImagePreviews([]);
      setErrors({ name: "", description: "", images: "" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add portfolio item",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12 animate-fade-in">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Add Portfolio Project
            </h1>
            <p className="text-lg text-muted-foreground">
              Showcase your best work and attract potential clients
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-5 gap-8">
              {/* LEFT SIDE - Image Upload */}
              <div className="lg:col-span-2">
                <Card className="sticky top-24 bg-background/40 backdrop-blur-xl border border-border/50 shadow-[var(--shadow-glass)] overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="w-5 h-5" />
                      Project Images
                    </CardTitle>
                    <CardDescription>
                      Upload images to showcase your project (Max 10 images, 5MB each)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    {/* Upload Area */}
                    <div className="space-y-4">
                      <label
                        htmlFor="images"
                        className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border/50 rounded-xl cursor-pointer bg-muted/30 hover:bg-muted/50 transition-all hover:border-primary/50 group"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-12 h-12 text-muted-foreground mb-3 group-hover:text-primary transition-colors" />
                          <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">PNG, JPG, WEBP (MAX. 5MB)</p>
                        </div>
                        <input
                          id="images"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          multiple
                          onChange={handleFileChange}
                        />
                      </label>
                      {errors.images && (
                        <p className="text-sm text-destructive">{errors.images}</p>
                      )}
                    </div>

                    {/* Image Previews */}
                    {imagePreviews.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold">
                          Uploaded Images ({imagePreviews.length}/10)
                        </Label>
                        <div className="grid grid-cols-2 gap-3">
                          {imagePreviews.map((preview, index) => (
                            <div
                              key={index}
                              className="relative group rounded-lg overflow-hidden border border-border/50 bg-muted/30 aspect-square"
                            >
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/90"
                              >
                                <X className="w-4 h-4" />
                              </button>
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                                <p className="text-xs text-white truncate">
                                  {portfolioData.uploaded_images[index]?.name}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* RIGHT SIDE - Project Details Form */}
              <div className="lg:col-span-3">
                <Card className="bg-background/40 backdrop-blur-xl border border-border/50 shadow-[var(--shadow-glass)]">
                  <CardHeader className="bg-gradient-to-r from-accent/10 to-primary/10">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Project Details
                    </CardTitle>
                    <CardDescription>
                      Provide detailed information about your project
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    {/* Project Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-base font-semibold">
                        Project Name *
                      </Label>
                      <Input
                        id="name"
                        value={portfolioData.name}
                        onChange={(e) => {
                          setPortfolioData({ ...portfolioData, name: e.target.value });
                          setErrors({ ...errors, name: "" });
                        }}
                        placeholder="e.g., E-commerce Platform Redesign"
                        className="bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary transition-colors h-12"
                      />
                      {errors.name && (
                        <p className="text-sm text-destructive">{errors.name}</p>
                      )}
                    </div>

                    {/* Project Link */}
                    <div className="space-y-2">
                      <Label htmlFor="project_link" className="text-base font-semibold">
                        Project Link (Optional)
                      </Label>
                      <Input
                        id="project_link"
                        type="url"
                        value={portfolioData.project_link}
                        onChange={(e) => setPortfolioData({ ...portfolioData, project_link: e.target.value })}
                        placeholder="https://example.com/project"
                        className="bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary transition-colors h-12"
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-base font-semibold">
                        Project Description *
                      </Label>
                      <Textarea
                        id="description"
                        value={portfolioData.description}
                        onChange={(e) => {
                          setPortfolioData({ ...portfolioData, description: e.target.value });
                          setErrors({ ...errors, description: "" });
                        }}
                        placeholder="Describe your project, the challenges you faced, technologies used, and the results achieved..."
                        className="min-h-[280px] bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary transition-colors resize-none"
                      />
                      <div className="flex justify-between items-center">
                        {errors.description && (
                          <p className="text-sm text-destructive">{errors.description}</p>
                        )}
                        <p className="text-xs text-muted-foreground ml-auto">
                          {portfolioData.description.length}/2000 characters
                        </p>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity shadow-lg"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Adding Portfolio...
                        </>
                      ) : (
                        <>
                          <Upload className="w-5 h-5 mr-2" />
                          Add to Portfolio
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddPortfolio;
