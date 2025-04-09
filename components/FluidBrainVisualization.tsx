import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { BrainRegion } from '@/data/brainRegions';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { FaPlay, FaPause, FaRedo, FaEye, FaEyeSlash, FaExpand } from 'react-icons/fa';

interface FluidBrainVisualizationProps {
  regions: BrainRegion[];
  activeRegionId?: string | null;
  onRegionClick?: (region: BrainRegion) => void;
  height?: number;
  width?: number;
}

const FluidBrainVisualization: React.FC<FluidBrainVisualizationProps> = ({
  regions,
  activeRegionId = null,
  onRegionClick,
  height = 600,
  width = 800,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const regionMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const connectionsRef = useRef<THREE.Line[]>([]);
  const animationIdRef = useRef<number | null>(null);
  const greyMatterRef = useRef<THREE.Points | null>(null);
  const fluidParticlesRef = useRef<THREE.Points | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [showConnections, setShowConnections] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(0.2);
  const [fluidSpeed, setFluidSpeed] = useState(0.5);
  const [hoverRegionId, setHoverRegionId] = useState<string | null>(null);
  const [showGreyMatter, setShowGreyMatter] = useState(true);
  const [greyMatterActivity, setGreyMatterActivity] = useState(0.5);
  
  // Raycaster for mouse interactions
  const raycasterRef = useRef(new THREE.Raycaster());
  const mousePositionRef = useRef(new THREE.Vector2());
  
  // Connection points between regions
  const [connectionPoints, setConnectionPoints] = useState<{from: string, to: string, strength: number}[]>([]);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Setup Three.js scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x000000);
    
    // Set up camera
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 15);
    cameraRef.current = camera;
    
    // Set up renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Add point lights for dramatic effect
    const pointLight1 = new THREE.PointLight(0x3080ff, 2, 20);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xff4040, 2, 20);
    pointLight2.position.set(-5, -5, -5);
    scene.add(pointLight2);
    
    // Create brain center sphere
    const brainCoreGeometry = new THREE.SphereGeometry(2, 32, 32);
    const brainCoreMaterial = new THREE.MeshStandardMaterial({
      color: 0x101020,
      transparent: true,
      opacity: 0.3,
      roughness: 0.7,
      metalness: 0.3,
    });
    const brainCore = new THREE.Mesh(brainCoreGeometry, brainCoreMaterial);
    scene.add(brainCore);
    
    // Create brain regions
    regions.forEach((region) => {
      let geometry;
      
      // Create appropriate geometry based on region shape
      switch (region.shape) {
        case 'ellipsoid':
          geometry = new THREE.SphereGeometry(region.size, 16, 16);
          geometry.scale(1.3, 1, 1);
          break;
        case 'rounded':
          geometry = new THREE.BoxGeometry(region.size, region.size, region.size);
          break;
        case 'sphere':
        default:
          geometry = new THREE.SphereGeometry(region.size, 32, 32);
      }
      
      // Create material with glow effect
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(region.color),
        transparent: true,
        opacity: 0.7,
        roughness: 0.3,
        metalness: 0.7,
        emissive: new THREE.Color(region.color),
        emissiveIntensity: 0.2,
      });
      
      // Create mesh and position it
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...region.position);
      mesh.userData = { regionId: region.id, regionData: region };
      
      // Add to scene and store reference
      scene.add(mesh);
      regionMeshesRef.current.set(region.id, mesh);
    });
    
    // Create connections between regions
    const createConnections = () => {
      // Remove existing connections
      connectionsRef.current.forEach(connection => {
        scene.remove(connection);
      });
      connectionsRef.current = [];
      
      // Create new connections
      const connections: {from: string, to: string, strength: number}[] = [];
      
      // For each region, connect to 2-3 others
      regions.forEach(region => {
        // Get 2-3 random regions to connect to
        const numConnections = Math.floor(Math.random() * 2) + 2; // 2-3 connections
        const otherRegions = [...regions].filter(r => r.id !== region.id);
        const shuffled = otherRegions.sort(() => 0.5 - Math.random());
        const selectedRegions = shuffled.slice(0, numConnections);
        
        selectedRegions.forEach(targetRegion => {
          const connectionExists = connections.some(
            c => (c.from === region.id && c.to === targetRegion.id) || 
                 (c.from === targetRegion.id && c.to === region.id)
          );
          
          if (!connectionExists) {
            const strength = Math.random() * 0.8 + 0.2; // 0.2-1.0 connection strength
            connections.push({ from: region.id, to: targetRegion.id, strength });
          }
        });
      });
      
      setConnectionPoints(connections);
      
      // Create visual connections
      connections.forEach(connection => {
        const sourceRegion = regionMeshesRef.current.get(connection.from);
        const targetRegion = regionMeshesRef.current.get(connection.to);
        
        if (sourceRegion && targetRegion) {
          const points = [];
          points.push(sourceRegion.position.clone());
          
          // Add a midpoint with a random offset to make curves
          const midpoint = new THREE.Vector3().lerpVectors(
            sourceRegion.position,
            targetRegion.position,
            0.5
          );
          
          // Add some random displacement to the midpoint
          midpoint.x += (Math.random() - 0.5) * 2;
          midpoint.y += (Math.random() - 0.5) * 2;
          midpoint.z += (Math.random() - 0.5) * 2;
          
          points.push(midpoint);
          points.push(targetRegion.position.clone());
          
          const curve = new THREE.CatmullRomCurve3(points);
          const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(20));
          
          const material = new THREE.LineBasicMaterial({
            color: new THREE.Color(sourceRegion.userData.regionData.color),
            transparent: true,
            opacity: connection.strength * 0.7, // Make stronger connections more visible
            linewidth: 1,
          });
          
          const line = new THREE.Line(geometry, material);
          line.userData = {
            sourceId: connection.from,
            targetId: connection.to,
            strength: connection.strength,
          };
          
          scene.add(line);
          connectionsRef.current.push(line);
        }
      });
    };
    
    createConnections();
    
    // Create grey matter particles
    const createGreyMatter = () => {
      const particleCount = 2000;
      const particleGeometry = new THREE.BufferGeometry();
      
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);
      
      const color = new THREE.Color();
      
      for (let i = 0; i < particleCount; i++) {
        // Create particles in a brain-like shape (elongated sphere)
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        // Random radius with more particles near the center
        const radius = 4 + (Math.pow(Math.random(), 2) * 4);
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta) * 0.7; // Slightly flattened in y
        const z = radius * Math.cos(phi) * 1.2; // Elongated in z
        
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
        
        // Random grey to light blue colors
        const grey = 0.3 + Math.random() * 0.3;
        color.setRGB(grey * 0.8, grey * 0.9, grey * 1.2);
        
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
        
        // Random sizes
        sizes[i] = Math.random() * 0.1 + 0.05;
      }
      
      particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      
      const particleMaterial = new THREE.PointsMaterial({
        size: 0.1,
        transparent: true,
        opacity: 0.6,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      });
      
      const particles = new THREE.Points(particleGeometry, particleMaterial);
      scene.add(particles);
      
      greyMatterRef.current = particles;
      
      return particles;
    };
    
    const greyMatter = createGreyMatter();
    
    // Create fluid particles that flow around the brain
    const createFluidParticles = () => {
      const particleCount = 500;
      const particleGeometry = new THREE.BufferGeometry();
      
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);
      const velocities = new Float32Array(particleCount * 3);
      
      for (let i = 0; i < particleCount; i++) {
        // Random positions in a large sphere around the brain
        const radius = 8 + Math.random() * 6;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);
        
        // Set random velocities (for fluid motion)
        velocities[i * 3] = (Math.random() - 0.5) * 0.02;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
        
        // Blue to cyan colors
        const blueShade = 0.5 + Math.random() * 0.5;
        colors[i * 3] = 0.1 + Math.random() * 0.3; // Red
        colors[i * 3 + 1] = 0.3 + Math.random() * 0.4; // Green
        colors[i * 3 + 2] = blueShade; // Blue
        
        // Random sizes
        sizes[i] = Math.random() * 0.15 + 0.05;
      }
      
      particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      
      // Store velocities in userData
      const userData = { velocities };
      
      const particleMaterial = new THREE.PointsMaterial({
        size: 0.15,
        transparent: true,
        opacity: 0.6,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      });
      
      const particles = new THREE.Points(particleGeometry, particleMaterial);
      particles.userData = userData;
      scene.add(particles);
      
      fluidParticlesRef.current = particles;
      
      return particles;
    };
    
    const fluidParticles = createFluidParticles();
    
    // Animation function
    const animate = () => {
      if (!isPlaying) return;
      
      // Rotate the entire scene
      if (sceneRef.current) {
        sceneRef.current.rotation.y += 0.002 * rotationSpeed;
      }
      
      // Breathe effect for brain regions
      regionMeshesRef.current.forEach((mesh, regionId) => {
        const time = Date.now() * 0.001;
        const breatheFactor = Math.sin(time + parseInt(regionId, 36) % 10) * 0.05 + 1;
        
        mesh.scale.set(breatheFactor, breatheFactor, breatheFactor);
        
        // If this region is active or hovered, make it glow more
        if (activeRegionId === regionId || hoverRegionId === regionId) {
          if (mesh.material instanceof THREE.MeshStandardMaterial) {
            mesh.material.emissiveIntensity = 0.6 + Math.sin(time * 3) * 0.2;
            mesh.material.opacity = 0.9;
          }
        } else {
          if (mesh.material instanceof THREE.MeshStandardMaterial) {
            mesh.material.emissiveIntensity = 0.2;
            mesh.material.opacity = 0.7;
          }
        }
      });
      
      // Animate connections
      if (showConnections) {
        connectionsRef.current.forEach((line, index) => {
          const time = Date.now() * 0.001;
          const sourceId = line.userData.sourceId;
          const targetId = line.userData.targetId;
          const strength = line.userData.strength;
          
          // Pulse effect for connections
          const pulseIntensity = (Math.sin(time * strength * 2 + index) * 0.3 + 0.7) * strength;
          
          if (line.material instanceof THREE.LineBasicMaterial) {
            line.material.opacity = pulseIntensity * 0.7;
            
            // If source or target is active, highlight the connection
            if (activeRegionId === sourceId || activeRegionId === targetId || 
                hoverRegionId === sourceId || hoverRegionId === targetId) {
              line.material.opacity = pulseIntensity * 0.9;
              line.material.color.setRGB(1, 1, 1);
            } else {
              const sourceRegion = regionMeshesRef.current.get(sourceId);
              if (sourceRegion && sourceRegion.material instanceof THREE.MeshStandardMaterial) {
                const color = new THREE.Color(sourceRegion.material.color);
                line.material.color.copy(color);
              }
            }
          }
        });
      }
      
      // Animate grey matter particles
      if (greyMatterRef.current && showGreyMatter) {
        const positions = greyMatterRef.current.geometry.attributes.position.array as Float32Array;
        const sizes = greyMatterRef.current.geometry.attributes.size.array as Float32Array;
        const colors = greyMatterRef.current.geometry.attributes.color.array as Float32Array;
        
        for (let i = 0; i < positions.length / 3; i++) {
          const i3 = i * 3;
          
          // Subtle movement
          const time = Date.now() * 0.001;
          const offset = Math.sin(time * 0.5 + i * 0.1) * 0.03 * greyMatterActivity;
          
          // Circular orbit around original position
          const x = positions[i3];
          const y = positions[i3 + 1];
          const z = positions[i3 + 2];
          const distance = Math.sqrt(x * x + y * y + z * z);
          
          // Move particle in a small circle around its position
          positions[i3] += Math.sin(time + i) * 0.01 * greyMatterActivity;
          positions[i3 + 1] += Math.cos(time + i * 0.7) * 0.01 * greyMatterActivity;
          positions[i3 + 2] += Math.sin(time * 0.8 + i * 0.3) * 0.01 * greyMatterActivity;
          
          // Keep particles within the brain shape by normalizing distance
          const newDistance = Math.sqrt(
            positions[i3] * positions[i3] +
            positions[i3 + 1] * positions[i3 + 1] +
            positions[i3 + 2] * positions[i3 + 2]
          );
          
          const scale = distance / newDistance;
          positions[i3] *= scale;
          positions[i3 + 1] *= scale;
          positions[i3 + 2] *= scale;
          
          // Pulse size
          sizes[i] = (Math.random() * 0.05 + 0.05) * (1 + Math.sin(time + i) * 0.3 * greyMatterActivity);
          
          // Subtle color changes
          const colorPulse = 0.1 * Math.sin(time + i * 10) * greyMatterActivity;
          colors[i3] += colorPulse;
          colors[i3 + 1] += colorPulse;
          colors[i3 + 2] += colorPulse;
          
          // Clamp colors
          colors[i3] = Math.max(0, Math.min(1, colors[i3]));
          colors[i3 + 1] = Math.max(0, Math.min(1, colors[i3 + 1]));
          colors[i3 + 2] = Math.max(0, Math.min(1, colors[i3 + 2]));
        }
        
        greyMatterRef.current.geometry.attributes.position.needsUpdate = true;
        greyMatterRef.current.geometry.attributes.size.needsUpdate = true;
        greyMatterRef.current.geometry.attributes.color.needsUpdate = true;
      }
      
      // Animate fluid particles
      if (fluidParticlesRef.current) {
        const positions = fluidParticlesRef.current.geometry.attributes.position.array as Float32Array;
        const velocities = fluidParticlesRef.current.userData.velocities as Float32Array;
        
        for (let i = 0; i < positions.length / 3; i++) {
          const i3 = i * 3;
          
          // Update position with velocity
          positions[i3] += velocities[i3] * fluidSpeed;
          positions[i3 + 1] += velocities[i3 + 1] * fluidSpeed;
          positions[i3 + 2] += velocities[i3 + 2] * fluidSpeed;
          
          // Calculate distance from center
          const x = positions[i3];
          const y = positions[i3 + 1];
          const z = positions[i3 + 2];
          const distanceSquared = x * x + y * y + z * z;
          
          // If too far from center, pull back
          if (distanceSquared > 225) { // 15^2
            // Add a force towards the center
            velocities[i3] -= x * 0.0001 * fluidSpeed;
            velocities[i3 + 1] -= y * 0.0001 * fluidSpeed;
            velocities[i3 + 2] -= z * 0.0001 * fluidSpeed;
          }
          
          // If too close to center, push away
          if (distanceSquared < 36) { // 6^2
            // Add a force away from the center
            velocities[i3] += x * 0.0002 * fluidSpeed;
            velocities[i3 + 1] += y * 0.0002 * fluidSpeed;
            velocities[i3 + 2] += z * 0.0002 * fluidSpeed;
          }
          
          // Add a gentle swirling motion
          const time = Date.now() * 0.0005;
          const swirl = 0.0001 * fluidSpeed;
          velocities[i3] += Math.sin(time + x * 0.1) * swirl;
          velocities[i3 + 1] += Math.cos(time + y * 0.1) * swirl;
          velocities[i3 + 2] += Math.sin(time + z * 0.1) * swirl;
          
          // Dampen velocity to prevent excessive speed
          velocities[i3] *= 0.999;
          velocities[i3 + 1] *= 0.999;
          velocities[i3 + 2] *= 0.999;
        }
        
        fluidParticlesRef.current.geometry.attributes.position.needsUpdate = true;
      }
      
      // Render scene
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
      
      // Continue animation loop
      animationIdRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Mouse interaction
    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current || !cameraRef.current || !sceneRef.current) return;
      
      // Calculate mouse position in normalized device coordinates (-1 to +1)
      const rect = containerRef.current.getBoundingClientRect();
      mousePositionRef.current.x = ((event.clientX - rect.left) / containerRef.current.clientWidth) * 2 - 1;
      mousePositionRef.current.y = -((event.clientY - rect.top) / containerRef.current.clientHeight) * 2 + 1;
      
      // Update the raycaster
      raycasterRef.current.setFromCamera(mousePositionRef.current, cameraRef.current);
      
      // Check for intersections with brain regions
      const regionMeshes = Array.from(regionMeshesRef.current.values());
      const intersects = raycasterRef.current.intersectObjects(regionMeshes);
      
      if (intersects.length > 0 && intersects[0].object.userData.regionId) {
        const hoveredRegionId = intersects[0].object.userData.regionId;
        setHoverRegionId(hoveredRegionId);
        containerRef.current.style.cursor = 'pointer';
      } else {
        setHoverRegionId(null);
        containerRef.current.style.cursor = 'default';
      }
    };
    
    // Mouse click
    const handleMouseClick = (event: MouseEvent) => {
      if (!containerRef.current || !cameraRef.current || !sceneRef.current || !onRegionClick) return;
      
      // Calculate mouse position in normalized device coordinates (-1 to +1)
      const rect = containerRef.current.getBoundingClientRect();
      mousePositionRef.current.x = ((event.clientX - rect.left) / containerRef.current.clientWidth) * 2 - 1;
      mousePositionRef.current.y = -((event.clientY - rect.top) / containerRef.current.clientHeight) * 2 + 1;
      
      // Update the raycaster
      raycasterRef.current.setFromCamera(mousePositionRef.current, cameraRef.current);
      
      // Check for intersections with brain regions
      const regionMeshes = Array.from(regionMeshesRef.current.values());
      const intersects = raycasterRef.current.intersectObjects(regionMeshes);
      
      if (intersects.length > 0 && intersects[0].object.userData.regionData) {
        const clickedRegion = intersects[0].object.userData.regionData;
        onRegionClick(clickedRegion);
      }
    };
    
    // Add event listeners
    containerRef.current.addEventListener('mousemove', handleMouseMove);
    containerRef.current.addEventListener('click', handleMouseClick);
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeEventListener('mousemove', handleMouseMove);
      containerRef.current?.removeEventListener('click', handleMouseClick);
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      // Clean up meshes
      regionMeshesRef.current.forEach((mesh) => {
        scene.remove(mesh);
      });
      
      connectionsRef.current.forEach((line) => {
        scene.remove(line);
      });
      
      if (greyMatterRef.current) {
        scene.remove(greyMatterRef.current);
      }
      
      if (fluidParticlesRef.current) {
        scene.remove(fluidParticlesRef.current);
      }
    };
  }, [regions, onRegionClick]);
  
  // Update animation state when isPlaying changes
  useEffect(() => {
    if (isPlaying && !animationIdRef.current) {
      const animate = () => {
        if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;
        
        // Rotate the entire scene
        if (sceneRef.current) {
          sceneRef.current.rotation.y += 0.002 * rotationSpeed;
        }
        
        // Render scene
        rendererRef.current.render(sceneRef.current, cameraRef.current);
        
        // Continue animation loop
        animationIdRef.current = requestAnimationFrame(animate);
      };
      
      animate();
    } else if (!isPlaying && animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    }
  }, [isPlaying, rotationSpeed]);
  
  // Update connections visibility
  useEffect(() => {
    if (connectionsRef.current) {
      connectionsRef.current.forEach((line) => {
        line.visible = showConnections;
      });
    }
  }, [showConnections]);
  
  // Update grey matter visibility
  useEffect(() => {
    if (greyMatterRef.current) {
      greyMatterRef.current.visible = showGreyMatter;
    }
  }, [showGreyMatter]);
  
  // Create component for the grey matter control panel
  const GreyMatterControlPanel = () => (
    <motion.div 
      className="absolute top-4 right-4 bg-black/60 rounded-lg p-3 border border-blue-900/30 backdrop-blur-sm w-64"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-blue-400">Grey Matter Simulation</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 w-6 p-0"
          onClick={() => setShowGreyMatter(!showGreyMatter)}
        >
          {showGreyMatter ? <FaEye size={12} /> : <FaEyeSlash size={12} />}
        </Button>
      </div>
      
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>Activity Level</span>
            <span>{Math.round(greyMatterActivity * 100)}%</span>
          </div>
          <Slider
            value={[greyMatterActivity]}
            max={1}
            step={0.05}
            onValueChange={(value) => setGreyMatterActivity(value[0])}
            disabled={!showGreyMatter}
          />
        </div>
        
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>Fluid Dynamics</span>
            <span>{Math.round(fluidSpeed * 100)}%</span>
          </div>
          <Slider
            value={[fluidSpeed]}
            max={1}
            step={0.05}
            onValueChange={(value) => setFluidSpeed(value[0])}
          />
        </div>
      </div>
      
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="p-2 bg-blue-900/20 rounded">
          <div className="font-medium mb-1">Neuron Count</div>
          <div className="font-mono text-blue-300">2,345 x 10^6</div>
        </div>
        <div className="p-2 bg-blue-900/20 rounded">
          <div className="font-medium mb-1">Signal Velocity</div>
          <div className="font-mono text-blue-300">100 m/s</div>
        </div>
      </div>
    </motion.div>
  );
  
  // Create component for the brain info when region is hovered
  const BrainRegionInfo = () => {
    const hoveredRegion = regions.find(r => r.id === hoverRegionId);
    const activeRegion = regions.find(r => r.id === activeRegionId);
    const displayRegion = hoveredRegion || activeRegion;
    
    if (!displayRegion) return null;
    
    return (
      <motion.div 
        className="absolute bottom-4 left-4 right-4 bg-black/60 rounded-lg p-3 border border-blue-900/30 backdrop-blur-sm"
        style={{ borderColor: displayRegion.color + '80' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-start gap-3">
          <div 
            className="w-3 h-3 rounded-full mt-1.5" 
            style={{ backgroundColor: displayRegion.color }}
          />
          
          <div className="flex-1">
            <div className="flex justify-between">
              <h3 className="font-medium" style={{ color: displayRegion.color }}>{displayRegion.name}</h3>
              <span className="text-xs bg-black/40 px-2 py-0.5 rounded font-mono">{displayRegion.acronym}</span>
            </div>
            
            <p className="text-sm opacity-80 mt-1">{displayRegion.function}</p>
            
            <div className="mt-2">
              <div className="text-xs opacity-70 mb-1">Associated Tests:</div>
              <div className="flex flex-wrap gap-1">
                {displayRegion.tests.map(testCode => (
                  <span key={testCode} className="text-xs px-2 py-0.5 bg-blue-900/30 rounded">
                    {testCode}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };
  
  return (
    <div className="w-full h-full relative">
      <div 
        ref={containerRef} 
        className="w-full h-full bg-black rounded-lg overflow-hidden"
        style={{ height: `${height}px` }}
      />
      
      {/* Controls */}
      <div className="absolute top-4 left-4 flex space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 bg-black/60 border-blue-900/30"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? <FaPause className="mr-2 h-3 w-3" /> : <FaPlay className="mr-2 h-3 w-3" />}
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 bg-black/60 border-blue-900/30"
          onClick={() => setShowConnections(!showConnections)}
        >
          {showConnections ? 'Hide' : 'Show'} Connections
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 bg-black/60 border-blue-900/30"
          onClick={() => {
            if (sceneRef.current) {
              sceneRef.current.rotation.set(0, 0, 0);
            }
          }}
        >
          <FaRedo className="mr-2 h-3 w-3" />
          Reset
        </Button>
      </div>
      
      {/* Rotation speed slider */}
      <div className="absolute top-16 left-4 bg-black/60 rounded-lg p-2 border border-blue-900/30 backdrop-blur-sm w-48">
        <div className="flex justify-between text-xs mb-1">
          <span>Rotation Speed</span>
          <span>{Math.round(rotationSpeed * 5)}x</span>
        </div>
        <Slider
          value={[rotationSpeed]}
          max={2}
          step={0.1}
          onValueChange={(value) => setRotationSpeed(value[0])}
        />
      </div>
      
      {/* Grey matter controls */}
      <GreyMatterControlPanel />
      
      {/* Region info */}
      {(hoverRegionId || activeRegionId) && <BrainRegionInfo />}
    </div>
  );
};

export default FluidBrainVisualization;