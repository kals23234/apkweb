import { useState } from "react";
import { Achievement } from "@shared/schema";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Share2, Eye, EyeOff, Trophy, Brain, Award, Zap, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { getGlowTextStyle } from "@/lib/utils";

// Extend the apiRequest type for our component
type ExtendedApiRequest = (
  url: string,
  options?: RequestInit
) => Promise<any>;
import { formatDistanceToNow } from "date-fns";

interface AchievementCardProps {
  achievement: Achievement;
  isOwner?: boolean;
  showShareLink?: boolean;
}

export default function AchievementCard({ 
  achievement, 
  isOwner = false,
  showShareLink = false 
}: AchievementCardProps) {
  const { toast } = useToast();
  const [isPublic, setIsPublic] = useState(achievement.isPublic);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Get icon based on achievement type
  const getAchievementIcon = () => {
    switch (achievement.type) {
      case "test_completion":
        return <Target className="h-6 w-6 text-blue-500" />;
      case "brain_region_mastery":
        return <Brain className="h-6 w-6 text-purple-500" />;
      case "tensor_pattern":
        return <Zap className="h-6 w-6 text-yellow-500" />;
      default:
        return <Trophy className="h-6 w-6 text-amber-500" />;
    }
  };
  
  // Get base URL for sharing
  const getShareUrl = () => {
    const protocol = window.location.protocol;
    const host = window.location.host;
    return `${protocol}//${host}/shared/${achievement.shareHash}`;
  };
  
  // Toggle visibility of achievement
  const toggleVisibility = async () => {
    if (!isOwner) return;
    
    setIsUpdating(true);
    try {
      const extendedApiRequest = apiRequest as ExtendedApiRequest;
      await extendedApiRequest(`/api/achievements/${achievement.id}`, {
        method: "PATCH",
        body: JSON.stringify({ isPublic: !isPublic }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      setIsPublic(!isPublic);
      
      // Show success toast
      toast({
        title: !isPublic ? "Achievement made public" : "Achievement made private",
        description: !isPublic 
          ? "Others can now view this achievement via the share link" 
          : "This achievement is now private",
      });
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['/api/users', achievement.userId, 'achievements'] });
      queryClient.invalidateQueries({ queryKey: ['/api/public-achievements'] });
    } catch (error) {
      console.error("Error updating achievement visibility:", error);
      toast({
        title: "Error updating visibility",
        description: "There was a problem updating your achievement's visibility",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Copy share link to clipboard
  const copyShareLink = () => {
    if (!navigator.clipboard) {
      toast({
        title: "Copy not supported",
        description: "Your browser doesn't support clipboard access",
        variant: "destructive",
      });
      return;
    }
    
    navigator.clipboard.writeText(getShareUrl())
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
  
  // Format achievement date
  const formatDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };
  
  return (
    <Card className="w-full overflow-hidden border-2 border-primary/20 bg-black/40 backdrop-blur-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            {getAchievementIcon()}
            <Badge variant={isPublic ? "default" : "outline"}>
              {achievement.type.replace(/_/g, " ")}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formatDate(achievement.achievedAt)}
            </span>
          </div>
          
          {isOwner && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {isPublic ? <Eye size={12} /> : <EyeOff size={12} />}
              </span>
              <Switch 
                disabled={isUpdating}
                checked={isPublic} 
                onCheckedChange={toggleVisibility}
                aria-label="Toggle achievement visibility"
              />
            </div>
          )}
        </div>
        <CardTitle style={getGlowTextStyle("#F5A623")}>
          {achievement.title}
        </CardTitle>
        <CardDescription>
          {achievement.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="rounded-lg bg-black/30 p-3 text-sm text-foreground/90">
          {achievement.metadata && typeof achievement.metadata === 'object' && 'details' in achievement.metadata && (
            <p>{String(achievement.metadata.details)}</p>
          )}
          
          {achievement.metadata && typeof achievement.metadata === 'object' && 
           'stats' in achievement.metadata && 
           achievement.metadata.stats && 
           typeof achievement.metadata.stats === 'object' && (
            <div className="mt-2 grid grid-cols-2 gap-2">
              {Object.entries(achievement.metadata.stats as Record<string, any>).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-muted-foreground">{key.replace(/_/g, " ")}:</span>
                  <span className="font-medium">{String(value)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      
      {(isOwner || showShareLink) && (
        <CardFooter className="pt-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="ml-auto flex items-center gap-1"
            onClick={copyShareLink}
            disabled={!isPublic}
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}