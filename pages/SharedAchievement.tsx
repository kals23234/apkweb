import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Container } from "@/components/ui/container";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Achievement } from "@shared/schema";
import AchievementCard from "@/components/AchievementCard";

export default function SharedAchievement() {
  const { toast } = useToast();
  const [, params] = useRoute("/shared/:shareHash");
  const shareHash = params?.shareHash;
  
  // Fetch shared achievement
  const { data: achievement, isLoading, error } = useQuery({
    queryKey: ['/api/shared-achievements', shareHash],
    queryFn: async () => {
      return apiRequest(`/api/shared-achievements/${shareHash}`) as Promise<Achievement>;
    },
    enabled: !!shareHash
  });
  
  // Copy current URL to clipboard
  const copyCurrentUrl = () => {
    if (!navigator.clipboard) {
      toast({
        title: "Copy not supported",
        description: "Your browser doesn't support clipboard access",
        variant: "destructive",
      });
      return;
    }
    
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        toast({
          title: "Share link copied!",
          description: "The achievement link has been copied to clipboard",
        });
      })
      .catch(() => {
        toast({
          title: "Copy failed",
          description: "Failed to copy link to clipboard",
          variant: "destructive",
        });
      });
  };
  
  // If the achievement is not public, show an error
  useEffect(() => {
    if (achievement && !achievement.isPublic) {
      toast({
        title: "Private achievement",
        description: "This achievement is no longer shared publicly",
        variant: "destructive",
      });
    }
  }, [achievement, toast]);
  
  return (
    <div className="py-12">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Link href="/achievements">
              <Button variant="ghost" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Achievements
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={copyCurrentUrl}
            >
              <Share2 className="h-4 w-4" />
              Share This View
            </Button>
          </div>
          
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          ) : error || !achievement || !achievement.isPublic ? (
            <div className="text-center py-16 border border-dashed border-primary/30 rounded-lg">
              <h2 className="text-2xl font-bold mb-2">Achievement Unavailable</h2>
              <p className="text-muted-foreground mb-6">
                This achievement is either private or no longer exists
              </p>
              <Link href="/achievements">
                <Button variant="default">
                  View Public Achievements
                </Button>
              </Link>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Shared Achievement</h1>
                <p className="text-muted-foreground">
                  This achievement was shared by {achievement.userId ? `user #${achievement.userId}` : 'a user'} 
                  of the Bharadwaj Cognitive Framework
                </p>
              </div>
              
              <div className="bg-black/30 p-6 rounded-lg border border-primary/20 backdrop-blur-md">
                <AchievementCard 
                  achievement={achievement} 
                  showShareLink={true}
                />
                
                <div className="mt-8 p-4 bg-black/40 rounded-lg border border-yellow-500/30">
                  <h3 className="text-lg font-medium mb-2 text-yellow-400">About Bharadwaj Cognitive Assessments</h3>
                  <p className="text-sm text-muted-foreground">
                    The Bharadwaj Cognitive Framework is an advanced neurological assessment system that measures 
                    cognitive capabilities across multiple dimensions. Achievements represent significant milestones 
                    in a user's cognitive development journey.
                  </p>
                  <div className="mt-4 text-center">
                    <p className="text-xs text-muted-foreground mb-2">Want to assess your own cognitive patterns?</p>
                    <Link href="/">
                      <Button variant="outline" size="sm">
                        Explore the Framework
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}