import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ThemeToggle } from "@/components/theme-toggle";
import { generateImage, downloadImage } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const examplePrompts = [
  "A serene landscape with mountains at sunset",
  "A futuristic city with flying cars",
  "A magical forest with glowing mushrooms",
];

const Index = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<Blob | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt first",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const image = await generateImage(prompt);
      setGeneratedImage(image);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      downloadImage(generatedImage, `generated-${Date.now()}.png`);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container max-w-6xl px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            AI Image Generator
          </h1>
          <ThemeToggle />
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Textarea
              placeholder="Enter your prompt here..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px] resize-none"
            />
            <div className="flex flex-wrap gap-2">
              {examplePrompts.map((examplePrompt) => (
                <button
                  key={examplePrompt}
                  onClick={() => setPrompt(examplePrompt)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {examplePrompt}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full sm:w-auto"
          >
            {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isGenerating ? "Generating..." : "Generate Image"}
          </Button>

          <div className="relative rounded-lg overflow-hidden bg-muted aspect-square max-w-2xl mx-auto">
            {isGenerating ? (
              <div className="absolute inset-0 bg-muted">
                <div className="h-full w-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full animate-shimmer" />
                </div>
              </div>
            ) : generatedImage ? (
              <>
                <img
                  src={URL.createObjectURL(generatedImage)}
                  alt="Generated"
                  className="w-full h-full object-cover"
                />
                <Button
                  onClick={handleDownload}
                  className="absolute bottom-4 right-4"
                  variant="secondary"
                >
                  Download
                </Button>
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                Your generated image will appear here
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;