import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useNeurofeedback, NeurofeedbackEvent } from '@/hooks/use-neurofeedback';
import { brainRegions } from '../data/brainRegions';
import { Button } from './ui/button';

interface NeurofeedbackVisualizerProps {
  userId?: number | null;
  demoMode?: boolean;
}

export default function NeurofeedbackVisualizer({ 
  userId = 1, // Default to user ID 1 for demo purposes
  demoMode = true 
}: NeurofeedbackVisualizerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const brainModelsRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const activeRegionsRef = useRef<Map<string, { 
    mesh: THREE.Mesh; 
    startTime: number; 
    duration: number;
    intensity: number;
  }>>(new Map());
  
  const [isRotating, setIsRotating] = useState(true);
  const [isPulsating, setIsPulsating] = useState(true);
  const [activeRegionCount, setActiveRegionCount] = useState(0);
  
  // Use our WebSocket hook to receive neurofeedback events
  const { 
    isConnected, 
    events, 
    error, 
    simulateEvent 
  } = useNeurofeedback({
    userId,
    onEvent: (event) => handleNeurofeedbackEvent(event),
    autoConnect: !demoMode // Only auto-connect if not in demo mode
  });

  // Function to handle incoming neurofeedback events
  const handleNeurofeedbackEvent = (event: NeurofeedbackEvent) => {
    if (!sceneRef.current) return;
    
    const brainRegionMesh = brainModelsRef.current.get(event.brainRegionId);
    if (!brainRegionMesh) return;
    
    // Clone the mesh to create an activated version
    const activatedMesh = brainRegionMesh.clone();
    
    // Calculate color based on intensity
    const intensity = event.intensity || 5;
    const normalizedIntensity = Math.min(Math.max(intensity / 10, 0.3), 1.0);
    
    // Get color from metadata or use default
    let color = event.metadata?.brainRegionColor || '#00ffff';
    
    // Create glowing material
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.7,
    });
    
    activatedMesh.material = material;
    
    // Add to scene
    sceneRef.current.add(activatedMesh);
    
    // Store activated region in our ref
    activeRegionsRef.current.set(event.id.toString(), {
      mesh: activatedMesh,
      startTime: Date.now(),
      duration: event.duration || 3000,
      intensity: normalizedIntensity
    });
    
    // Update count of active regions
    setActiveRegionCount(activeRegionsRef.current.size);
  };

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create scene, camera, renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color('#000000');
    
    const camera = new THREE.PerspectiveCamera(
      50, 
      containerRef.current.clientWidth / containerRef.current.clientHeight, 
      0.1, 
      1000
    );
    cameraRef.current = camera;
    camera.position.z = 15;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current = renderer;
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    
    // Add directional light
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);
    
    // Add point lights for dramatic effect
    const pointLight1 = new THREE.PointLight(0x80a0ff, 2, 50);
    pointLight1.position.set(10, 5, 10);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xff8080, 2, 50);
    pointLight2.position.set(-10, -5, -10);
    scene.add(pointLight2);
    
    // Create brain regions
    brainRegions.forEach(region => {
      let geometry;
      
      // Create appropriate geometry based on region shape
      switch (region.shape) {
        case 'ellipsoid':
          geometry = new THREE.SphereGeometry(region.size, 16, 16);
          geometry.scale(1.5, 1, 1);
          break;
        case 'rounded':
          geometry = new THREE.BoxGeometry(region.size, region.size, region.size);
          break;
        case 'sphere':
        default:
          geometry = new THREE.SphereGeometry(region.size, 32, 32);
      }
      
      // Create mesh with base material
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(region.color),
        transparent: true,
        opacity: 0.3,
        roughness: 0.3,
        metalness: 0.7
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...region.position);
      
      // Add to scene and store reference
      scene.add(mesh);
      brainModelsRef.current.set(region.id, mesh);
    });
    
    // Create a "brain container" sphere for visual effect
    const brainSphereGeometry = new THREE.SphereGeometry(8, 32, 32);
    const brainSphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x0033ff,
      transparent: true,
      opacity: 0.05,
      wireframe: true
    });
    const brainSphere = new THREE.Mesh(brainSphereGeometry, brainSphereMaterial);
    scene.add(brainSphere);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate the entire scene if rotation is enabled
      if (isRotating) {
        scene.rotation.y += 0.001;
        scene.rotation.x = Math.sin(Date.now() * 0.0005) * 0.1;
      }
      
      // Handle active regions animations (pulsing, fading)
      if (isPulsating) {
        const now = Date.now();
        
        activeRegionsRef.current.forEach((activeData, key) => {
          const { mesh, startTime, duration, intensity } = activeData;
          const elapsed = now - startTime;
          
          if (elapsed < duration) {
            // Calculate pulse based on elapsed time
            const pulse = Math.sin(elapsed * 0.01) * 0.2 + 0.8;
            
            // Scale the mesh based on pulse and intensity
            mesh.scale.set(
              1 + (pulse * intensity * 0.5),
              1 + (pulse * intensity * 0.5),
              1 + (pulse * intensity * 0.5)
            );
            
            // Fade out toward end of duration
            if (elapsed > duration * 0.7) {
              const opacity = 0.7 * (1 - (elapsed - duration * 0.7) / (duration * 0.3));
              if (mesh.material instanceof THREE.MeshBasicMaterial) {
                mesh.material.opacity = opacity;
              }
            }
          } else {
            // Remove expired activations
            scene.remove(mesh);
            activeRegionsRef.current.delete(key);
            setActiveRegionCount(activeRegionsRef.current.size);
          }
        });
      }
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      // Clean up all meshes
      activeRegionsRef.current.forEach(({ mesh }) => {
        scene.remove(mesh);
      });
      
      brainModelsRef.current.forEach((mesh) => {
        scene.remove(mesh);
      });
    };
  }, []);

  // Function to trigger a random brain region activation for demo purposes
  const triggerRandomRegion = async () => {
    if (!demoMode || !simulateEvent) return;
    
    // Get random brain region
    const randomIndex = Math.floor(Math.random() * brainRegions.length);
    const randomRegion = brainRegions[randomIndex];
    
    // Random intensity between 3 and 8
    const intensity = Math.floor(Math.random() * 6) + 3;
    
    // Simulate event
    await simulateEvent(randomRegion.id, intensity);
  };

  return (
    <div className="relative w-full h-[500px] rounded-lg overflow-hidden border border-gray-800">
      {/* Visualization container */}
      <div ref={containerRef} className="w-full h-full bg-black"></div>
      
      {/* Controls overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 justify-between items-center">
        <div>
          <span className="px-3 py-1 rounded-full bg-gray-800 text-white text-xs">
            {activeRegionCount} active regions
          </span>
          {error && (
            <span className="ml-2 px-3 py-1 rounded-full bg-blue-900 text-white text-xs font-mono animate-pulse">
              {error}
            </span>
          )}
          {isConnected && (
            <span className="ml-2 px-3 py-1 rounded-full bg-green-900 text-white text-xs">
              Connected
            </span>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsRotating(!isRotating)}
          >
            {isRotating ? 'Stop Rotation' : 'Start Rotation'}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsPulsating(!isPulsating)}
          >
            {isPulsating ? 'Stop Pulsing' : 'Start Pulsing'}
          </Button>
          
          {demoMode && (
            <Button 
              variant="default" 
              size="sm" 
              onClick={triggerRandomRegion}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Trigger Random Region
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}