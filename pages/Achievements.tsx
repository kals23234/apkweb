import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Trophy, Plus } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { InsertAchievement, Achievement } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AchievementCard from "@/components/AchievementCard";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { getRandomString } from "@/lib/utils";

export default function Achievements() {
  // Temporary userId (in a real app, would come from auth)
  const DEFAULT_USER_ID = 1;
  
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newAchievement, setNewAchievement] = useState<Partial<InsertAchievement>>({
    userId: DEFAULT_USER_ID,
    title: "",
    description: "",
    type: "cognitive_milestone",
    metadata: { details: "", stats: {} },
    isPublic: false,
    shareHash: getRandomString(10)
  });
  
  // Add a new achievement stat field
  const [newStatKey, setNewStatKey] = useState("");
  const [newStatValue, setNewStatValue] = useState("");
  
  // Fetch user achievements
  const { data: achievements, isLoading, error } = useQuery({
    queryKey: ['/api/users', DEFAULT_USER_ID, 'achievements'],
    queryFn: async () => {
      return apiRequest(`/api/users/${DEFAULT_USER_ID}/achievements`) as Promise<Achievement[]>;
    }
  });
  
  // Fetch public achievements
  const { data: publicAchievements, isLoading: isLoadingPublic } = useQuery({
    queryKey: ['/api/public-achievements'],
    queryFn: async () => {
      return apiRequest('/api/public-achievements') as Promise<Achievement[]>;
    }
  });
  
  // Create achievement mutation
  const createAchievement = useMutation({
    mutationFn: async (achievement: InsertAchievement) => {
      const extendedApiRequest = apiRequest as (url: string, options?: RequestInit) => Promise<any>;
      return extendedApiRequest('/api/achievements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(achievement),
      });
    },
    onSuccess: () => {
      // Reset form and close dialog
      setNewAchievement({
        userId: DEFAULT_USER_ID,
        title: "",
        description: "",
        type: "cognitive_milestone",
        metadata: { details: "", stats: {} },
        isPublic: false,
        shareHash: getRandomString(10)
      });
      setIsCreateDialogOpen(false);
      
      // Show success toast
      toast({
        title: "Achievement created",
        description: "Your new achievement has been saved successfully",
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/users', DEFAULT_USER_ID, 'achievements'] });
      if (newAchievement.isPublic) {
        queryClient.invalidateQueries({ queryKey: ['/api/public-achievements'] });
      }
    },
    onError: (error) => {
      console.error("Error creating achievement:", error);
      toast({
        title: "Error creating achievement",
        description: "There was an error saving your achievement. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Handle form submission
  const handleCreateAchievement = () => {
    // Validate required fields
    if (!newAchievement.title || !newAchievement.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Create achievement
    createAchievement.mutate(newAchievement as InsertAchievement);
  };
  
  // Add a new stat to the achievement
  const addStat = () => {
    if (!newStatKey.trim() || !newStatValue.trim()) return;
    
    setNewAchievement(prev => {
      const updatedMetadata = {
        ...prev.metadata,
        stats: {
          ...(prev.metadata?.stats || {}),
          [newStatKey]: newStatValue
        }
      };
      
      return {
        ...prev,
        metadata: updatedMetadata
      };
    });
    
    // Clear input fields
    setNewStatKey("");
    setNewStatValue("");
  };
  
  // Remove a stat from the achievement
  const removeStat = (key: string) => {
    setNewAchievement(prev => {
      if (!prev.metadata?.stats) return prev;
      
      const updatedStats = { ...prev.metadata.stats };
      delete updatedStats[key];
      
      return {
        ...prev,
        metadata: {
          ...prev.metadata,
          stats: updatedStats
        }
      };
    });
  };
  
  return (
    <div className="min-h-screen py-8">
      <Container>
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold inline-flex items-center">
                <Trophy className="mr-2 h-8 w-8 text-yellow-500" />
                <span style={{ background: "linear-gradient(to right, #F5A623, #FFD700)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Cognitive Achievements
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mt-2">
                Track your neurological progress and share your cognitive milestones
              </p>
            </div>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="relative overflow-hidden group bg-gradient-to-r from-yellow-600 to-amber-500 hover:from-yellow-500 hover:to-amber-400 text-white">
                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <Plus className="mr-2 h-4 w-4" />
                  New Achievement
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md bg-black/90 border-primary/20 backdrop-blur-xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl">Record New Achievement</DialogTitle>
                  <DialogDescription>
                    Document your cognitive progress and breakthroughs
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newAchievement.title}
                      onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
                      placeholder="e.g., Mastered Fractal Cognition"
                      className="bg-black/50"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newAchievement.description}
                      onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}
                      placeholder="Brief description of your achievement"
                      className="bg-black/50 resize-none"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="type">Achievement Type</Label>
                    <Select
                      value={newAchievement.type}
                      onValueChange={(value) => setNewAchievement({ ...newAchievement, type: value })}
                    >
                      <SelectTrigger className="bg-black/50">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/90 border-primary/20">
                        <SelectItem value="cognitive_milestone">Cognitive Milestone</SelectItem>
                        <SelectItem value="test_completion">Test Completion</SelectItem>
                        <SelectItem value="brain_region_mastery">Brain Region Mastery</SelectItem>
                        <SelectItem value="tensor_pattern">Tensor Pattern Recognition</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="details">Detailed Notes</Label>
                    <Textarea
                      id="details"
                      value={newAchievement.metadata?.details || ""}
                      onChange={(e) => setNewAchievement({
                        ...newAchievement,
                        metadata: {
                          ...newAchievement.metadata,
                          details: e.target.value
                        }
                      })}
                      placeholder="Additional details about your achievement"
                      className="bg-black/50 resize-none"
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <Label>Achievement Stats</Label>
                    
                    <div className="flex space-x-2">
                      <Input
                        value={newStatKey}
                        onChange={(e) => setNewStatKey(e.target.value)}
                        placeholder="Stat name"
                        className="bg-black/50 flex-1"
                      />
                      <Input
                        value={newStatValue}
                        onChange={(e) => setNewStatValue(e.target.value)}
                        placeholder="Value"
                        className="bg-black/50 w-24"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={addStat}
                        className="shrink-0"
                      >
                        Add
                      </Button>
                    </div>
                    
                    {newAchievement.metadata?.stats && Object.keys(newAchievement.metadata.stats).length > 0 && (
                      <div className="space-y-2 mt-2">
                        {Object.entries(newAchievement.metadata.stats).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between p-2 rounded bg-black/30">
                            <div>
                              <span className="font-medium">{key}:</span>
                              <span className="ml-2">{value}</span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeStat(key)}
                              className="h-6 w-6 p-0 rounded-full"
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isPublic"
                      checked={newAchievement.isPublic}
                      onCheckedChange={(checked) => setNewAchievement({ ...newAchievement, isPublic: checked })}
                    />
                    <Label htmlFor="isPublic">Make this achievement public and shareable</Label>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button
                    onClick={handleCreateAchievement}
                    className="w-full bg-gradient-to-r from-yellow-600 to-amber-500 hover:from-yellow-500 hover:to-amber-400"
                    disabled={createAchievement.isPending}
                  >
                    {createAchievement.isPending ? "Saving..." : "Save Achievement"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <Tabs defaultValue="my_achievements" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
              <TabsTrigger value="my_achievements">My Achievements</TabsTrigger>
              <TabsTrigger value="public">Community Achievements</TabsTrigger>
            </TabsList>
            
            <TabsContent value="my_achievements">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="h-64 rounded-lg bg-black/30"></div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-lg text-red-400">Error loading your achievements</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/users', DEFAULT_USER_ID, 'achievements'] })}
                  >
                    Try Again
                  </Button>
                </div>
              ) : achievements && achievements.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {achievements.map((achievement) => (
                    <AchievementCard
                      key={achievement.id}
                      achievement={achievement}
                      isOwner={true}
                      showShareLink={true}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed border-primary/30 rounded-lg">
                  <Trophy className="mx-auto h-12 w-12 text-primary/50 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Achievements Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Record your cognitive milestones and track your progress
                  </p>
                  <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="bg-gradient-to-r from-primary/80 to-primary/60 hover:from-primary/70 hover:to-primary/50"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Achievement
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="public">
              {isLoadingPublic ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="h-64 rounded-lg bg-black/30"></div>
                  ))}
                </div>
              ) : publicAchievements && publicAchievements.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {publicAchievements.map((achievement) => (
                    <AchievementCard
                      key={achievement.id}
                      achievement={achievement}
                      isOwner={achievement.userId === DEFAULT_USER_ID}
                      showShareLink={true}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed border-primary/30 rounded-lg">
                  <Trophy className="mx-auto h-12 w-12 text-primary/50 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Public Achievements</h3>
                  <p className="text-muted-foreground mb-6">
                    Be the first to share your cognitive milestones with the community
                  </p>
                  <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="bg-gradient-to-r from-primary/80 to-primary/60 hover:from-primary/70 hover:to-primary/50"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create & Share Achievement
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </Container>
    </div>
  );
}