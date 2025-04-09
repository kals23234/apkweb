import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';

interface FrameworkVisualizerProps {
  frameworkId: string;
  color: string;
  title: string;
  description?: string;
}

const FrameworkVisualizer: React.FC<FrameworkVisualizerProps> = ({
  frameworkId,
  color,
  title,
  description = ''
}) => {
  // Component state variables
  const [isHovered, setIsHovered] = useState(false);
  const [timeValue, setTimeValue] = useState(0);
  
  // Refs for Three.js setup
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const objectsRef = useRef<THREE.Object3D[]>([]);
  const clockRef = useRef<THREE.Clock>(new THREE.Clock());
  
  // Utility function to create particles
  const createParticles = (color: THREE.Color, count: number = 200, radius: number = 2, size: number = 0.03) => {
    if (!sceneRef.current) return;
    
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Use spherical coordinates for even distribution
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      
      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta) * (0.5 + Math.random() * 0.5);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * (0.5 + Math.random() * 0.5);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi) * (0.5 + Math.random() * 0.5);
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      color: color,
      size: size,
      transparent: true,
      opacity: 0.6,
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    sceneRef.current.add(particles);
    objectsRef.current.push(particles);
    
    return particles;
  };
  
  // Create energy field visualization
  const createEnergyField = (color: THREE.Color) => {
    if (!sceneRef.current) return;
    
    const lineCount = 20;
    const lineSegments = 10;
    
    for (let i = 0; i < lineCount; i++) {
      const points = [];
      
      // Create a curved energy line
      for (let j = 0; j <= lineSegments; j++) {
        const t = j / lineSegments;
        const angle = Math.PI * 2 * t + (i / lineCount) * Math.PI * 2;
        
        const radius = 2 * (0.7 + Math.sin(t * Math.PI) * 0.3);
        const x = Math.cos(angle) * radius;
        const y = (t - 0.5) * 3;
        const z = Math.sin(angle) * radius;
        
        points.push(new THREE.Vector3(x, y, z));
      }
      
      const energyGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const energyMaterial = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.5
      });
      
      const energyLine = new THREE.Line(energyGeometry, energyMaterial);
      sceneRef.current.add(energyLine);
      objectsRef.current.push(energyLine);
    }
  };

  // Default visualization for unknown frameworks
  const createDefaultViz = (color: THREE.Color) => {
    if (!sceneRef.current) return;
    
    // Create simple sphere
    const geometry = new THREE.SphereGeometry(1.5, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.3,
      wireframe: true,
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    sceneRef.current.add(mesh);
    objectsRef.current.push(mesh);
    
    // Add some particles
    createParticles(color, 200);
  };
  
  // Function to animate the framework visualization
  const animateFrameworkVisualization = (framework: string, time: number, speedMultiplier: number = 1.0) => {
    if (!objectsRef.current || objectsRef.current.length === 0 || !sceneRef.current) return;
    
    switch (framework) {
      case "bucp-dt":
        // Rotate rings at different speeds
        objectsRef.current.forEach((obj, index) => {
          if (index >= 0 && index <= 3) { // Rings
            obj.rotation.z = time * (0.1 + index * 0.05) * speedMultiplier;
          }
        });
        break;
        
      case "alien-cognition":
        // Move alien structures in exotic patterns
        objectsRef.current.forEach((obj, index) => {
          if (index === 0) { // Central tetrahedron
            obj.rotation.x = time * 0.3 * speedMultiplier;
            obj.rotation.y = time * 0.5 * speedMultiplier;
          } else if (index >= 1 && index <= 3) { // Orbiting shapes
            // Orbit around the center
            const orbitSpeed = 0.2 + (index * 0.1);
            const orbitRadius = 2;
            
            obj.position.x = Math.cos(time * orbitSpeed * speedMultiplier) * orbitRadius;
            obj.position.z = Math.sin(time * orbitSpeed * speedMultiplier) * orbitRadius;
            
            // Own rotation
            obj.rotation.x = time * 0.5 * speedMultiplier;
            obj.rotation.y = time * 0.3 * speedMultiplier;
          } else if (obj instanceof THREE.Line) {
            // Update beam connections
            if (index > 3 && index <= 6) {
              const targetIndex = index - 3;
              if (targetIndex >= 1 && targetIndex <= 3) {
                const target = objectsRef.current[targetIndex];
                
                if (obj.geometry instanceof THREE.BufferGeometry) {
                  const positions = obj.geometry.attributes.position.array;
                  
                  // Update end point position (the start point is at 0,0,0)
                  positions[3] = target.position.x;
                  positions[4] = target.position.y;
                  positions[5] = target.position.z;
                  
                  obj.geometry.attributes.position.needsUpdate = true;
                }
              }
            }
          }
        });
        break;
        
      case "tensor-geometry":
        // Group contains all tensor elements
        if (objectsRef.current.length > 0) {
          const tensorGroup = objectsRef.current[0];
          
          // Rotate the entire tensor network
          tensorGroup.rotation.y = time * 0.1 * speedMultiplier;
          tensorGroup.rotation.z = Math.sin(time * 0.2 * speedMultiplier) * 0.2;
        }
        break;
        
      case "quantum-mind":
        // Animate quantum wave and particles
        objectsRef.current.forEach((obj, index) => {
          if (index === 0 && obj instanceof THREE.Mesh && obj.geometry instanceof THREE.PlaneGeometry) {
            // Wave motion
            const geometry = obj.geometry;
            const positionAttribute = geometry.attributes.position;
            
            for (let i = 0; i < positionAttribute.count; i++) {
              const x = positionAttribute.getX(i);
              const y = positionAttribute.getY(i);
              
              // Create animated wave pattern
              const z = Math.sin(x * 1.5 + time * speedMultiplier) * 0.2 + 
                         Math.sin(y * 2 + time * 0.7 * speedMultiplier) * 0.2;
              
              positionAttribute.setZ(i, z);
            }
            
            positionAttribute.needsUpdate = true;
            geometry.computeVertexNormals();
          } else if (index === 1 && obj instanceof THREE.Points) {
            // Quantum particles following the wave
            const positions = obj.geometry.attributes.position.array;
            
            for (let i = 0; i < positions.length; i += 3) {
              const x = positions[i];
              const y = positions[i + 1];
              
              // Follow the wave function
              positions[i + 2] = Math.sin(x * 1.5 + time * speedMultiplier) * 0.2 + 
                                 Math.sin(y * 2 + time * 0.7 * speedMultiplier) * 0.2;
            }
            
            obj.geometry.attributes.position.needsUpdate = true;
          }
        });
        break;
        
      case "neurotensor":
        // Pulse the neural network connections
        objectsRef.current.forEach((obj) => {
          if (obj instanceof THREE.Line) {
            // Pulse neural connections
            if (obj.material instanceof THREE.LineBasicMaterial) {
              obj.material.opacity = 0.1 + Math.sin(time * 3 * speedMultiplier) * 0.1;
            }
          }
        });
        break;
        
      case "consciousness-tensor":
        // Rotate layered consciousness spheres at different rates
        objectsRef.current.forEach((obj, index) => {
          if (index === 0) { // Outer layer
            obj.rotation.x = time * 0.1 * speedMultiplier;
            obj.rotation.y = time * 0.15 * speedMultiplier;
          } else if (index === 1) { // Middle layer
            obj.rotation.x = -time * 0.15 * speedMultiplier;
            obj.rotation.y = -time * 0.1 * speedMultiplier;
          } else if (index === 2) { // Inner core
            obj.rotation.x = time * 0.2 * speedMultiplier;
            obj.rotation.z = time * 0.1 * speedMultiplier;
          }
        });
        break;
        
      case "quantum-physics":
        // Quantum particle movement and wave function collapse
        objectsRef.current.forEach((obj, index) => {
          if (obj instanceof THREE.Points) {
            // Random quantum fluctuations
            const positions = obj.geometry.attributes.position.array;
            
            for (let i = 0; i < positions.length; i += 3) {
              // Apply quantum fluctuations
              positions[i] += (Math.random() - 0.5) * 0.01 * speedMultiplier;
              positions[i + 1] += (Math.random() - 0.5) * 0.01 * speedMultiplier;
              positions[i + 2] += (Math.random() - 0.5) * 0.01 * speedMultiplier;
            }
            
            obj.geometry.attributes.position.needsUpdate = true;
          }
        });
        break;
        
      case "metapsychology":
        // Animate the meta-psychological layers
        objectsRef.current.forEach((obj, index) => {
          // Rotation for different layers
          obj.rotation.x = time * (0.1 + index * 0.02) * speedMultiplier;
          obj.rotation.y = time * (0.15 - index * 0.03) * speedMultiplier;
          
          // Pulse effect
          if (obj instanceof THREE.Mesh) {
            const scale = 1 + Math.sin(time * (0.5 + index * 0.2) * speedMultiplier) * 0.07;
            obj.scale.set(scale, scale, scale);
          }
        });
        break;
        
      default:
        // Simple rotation for unknown frameworks
        objectsRef.current.forEach((obj) => {
          obj.rotation.y = time * 0.2 * speedMultiplier;
        });
    }
  };

  // Create visualization based on framework ID
  const createVisualization = () => {
    if (!sceneRef.current) return;
    
    // Clear previous objects
    objectsRef.current.forEach((obj) => {
      if (sceneRef.current) {
        sceneRef.current.remove(obj);
      }
    });
    
    objectsRef.current = [];
    
    const threeColor = new THREE.Color(color);
    
    // Create visualization based on framework ID
    switch (frameworkId) {
      case "bucp-dt":
        // Create a multi-layered circular structure for BUCP-DT
        const outerRingGeo = new THREE.TorusGeometry(2, 0.1, 16, 64);
        const outerRingMat = new THREE.MeshStandardMaterial({
          color: threeColor,
          emissive: threeColor,
          emissiveIntensity: 0.3,
          metalness: 0.8,
          roughness: 0.2,
        });
        const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
        outerRing.rotation.x = Math.PI / 2;
        sceneRef.current.add(outerRing);
        objectsRef.current.push(outerRing);
        
        // Create inner rings
        for (let i = 0; i < 3; i++) {
          const radius = 1.6 - (i * 0.5);
          const ringGeo = new THREE.TorusGeometry(radius, 0.05, 16, 64);
          const ringMat = new THREE.MeshStandardMaterial({
            color: threeColor,
            emissive: threeColor,
            emissiveIntensity: 0.3 + (i * 0.1),
            transparent: true,
            opacity: 0.7,
            metalness: 0.8,
            roughness: 0.2,
          });
          const ring = new THREE.Mesh(ringGeo, ringMat);
          ring.rotation.x = Math.PI / 2;
          ring.rotation.y = i * (Math.PI / 6);
          sceneRef.current.add(ring);
          objectsRef.current.push(ring);
        }
        
        // Add nodes and connecting lines
        createParticles(threeColor, 300);
        break;
        
      case "alien-cognition":
        // Create alien cognition visualization
        const tetraGeo = new THREE.TetrahedronGeometry(1.2);
        const tetraMat = new THREE.MeshStandardMaterial({
          color: threeColor,
          emissive: threeColor,
          emissiveIntensity: 0.3,
          wireframe: true,
          transparent: true,
          opacity: 0.7,
        });
        const tetra = new THREE.Mesh(tetraGeo, tetraMat);
        sceneRef.current.add(tetra);
        objectsRef.current.push(tetra);
        
        // Create orbiting geometric shapes
        const shapes = [
          new THREE.OctahedronGeometry(0.4),
          new THREE.DodecahedronGeometry(0.3),
          new THREE.IcosahedronGeometry(0.25)
        ];
        
        for (let i = 0; i < shapes.length; i++) {
          const shapeMat = new THREE.MeshStandardMaterial({
            color: threeColor,
            emissive: threeColor,
            emissiveIntensity: 0.5,
            metalness: 0.8,
            roughness: 0.2,
            transparent: true,
            opacity: 0.8,
          });
          
          const mesh = new THREE.Mesh(shapes[i], shapeMat);
          
          // Position in orbit
          const orbitRadius = 2;
          const angle = (i / shapes.length) * Math.PI * 2;
          mesh.position.x = Math.cos(angle) * orbitRadius;
          mesh.position.z = Math.sin(angle) * orbitRadius;
          
          sceneRef.current.add(mesh);
          objectsRef.current.push(mesh);
        }
        
        // Add particles
        createParticles(threeColor, 500, 3, 0.02);
        break;
        
      case "tensor-geometry":
        // Create tensor network representation
        const tensorGroup = new THREE.Group();
        sceneRef.current.add(tensorGroup);
        objectsRef.current.push(tensorGroup);
        
        // Create tensor nodes in a grid pattern
        const nodeCount = 4;
        const nodeSize = 0.15;
        const gridSpacing = 1;
        
        for (let x = -nodeCount/2; x < nodeCount/2; x++) {
          for (let y = -nodeCount/2; y < nodeCount/2; y++) {
            for (let z = -nodeCount/2; z < nodeCount/2; z++) {
              // Skip some nodes for more interesting pattern
              if (Math.random() > 0.7) continue;
              
              const nodeMat = new THREE.MeshStandardMaterial({
                color: threeColor,
                emissive: threeColor,
                emissiveIntensity: 0.5,
                metalness: 0.8,
                roughness: 0.2,
              });
              
              const nodeGeo = new THREE.SphereGeometry(nodeSize, 16, 16);
              const node = new THREE.Mesh(nodeGeo, nodeMat);
              
              node.position.set(
                x * gridSpacing, 
                y * gridSpacing, 
                z * gridSpacing
              );
              
              tensorGroup.add(node);
            }
          }
        }
        
        createParticles(threeColor, 200);
        break;
        
      case "quantum-mind":
        // Create quantum wave function visualization
        const waveGeometry = new THREE.PlaneGeometry(4, 4, 32, 32);
        
        // Set wave pattern
        const positionAttribute = waveGeometry.attributes.position;
        for (let i = 0; i < positionAttribute.count; i++) {
          const x = positionAttribute.getX(i);
          const y = positionAttribute.getY(i);
          const z = Math.sin(x * 1.5) * 0.2 + Math.sin(y * 2) * 0.2;
          positionAttribute.setZ(i, z);
        }
        
        waveGeometry.computeVertexNormals();
        
        const waveMaterial = new THREE.MeshStandardMaterial({
          color: threeColor,
          emissive: threeColor,
          emissiveIntensity: 0.3,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.6,
          wireframe: true,
        });
        
        const wave = new THREE.Mesh(waveGeometry, waveMaterial);
        wave.rotation.x = Math.PI / 2;
        sceneRef.current.add(wave);
        objectsRef.current.push(wave);
        
        // Create quantum particles
        const particleCount = 100;
        const particleGeometry = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
          const x = (Math.random() - 0.5) * 4;
          const y = (Math.random() - 0.5) * 4;
          const z = Math.sin(x * 1.5) * 0.2 + Math.sin(y * 2) * 0.2;
          
          particlePositions[i * 3] = x;
          particlePositions[i * 3 + 1] = 0;
          particlePositions[i * 3 + 2] = z;
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
          color: threeColor,
          size: 0.05,
          transparent: true,
          opacity: 0.8,
        });
        
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        sceneRef.current.add(particles);
        objectsRef.current.push(particles);
        
        // Add energy field
        createEnergyField(threeColor);
        break;
        
      case "neurotensor":
        // Create neural network structure
        const coreGeo = new THREE.SphereGeometry(0.8, 32, 32);
        const coreMat = new THREE.MeshStandardMaterial({
          color: threeColor,
          emissive: threeColor,
          emissiveIntensity: 0.3,
          transparent: true,
          opacity: 0.6,
        });
        
        const core = new THREE.Mesh(coreGeo, coreMat);
        sceneRef.current.add(core);
        objectsRef.current.push(core);
        
        // Create neural nodes & connections
        createParticles(threeColor, 200, 2.5, 0.04);
        break;
        
      case "consciousness-tensor":
        // Create consciousness layers
        // Outer layer
        const outerGeo = new THREE.IcosahedronGeometry(2, 1);
        const outerMat = new THREE.MeshStandardMaterial({
          color: threeColor,
          emissive: threeColor,
          emissiveIntensity: 0.2,
          wireframe: true,
          transparent: true,
          opacity: 0.3,
        });
        
        const outerSphere = new THREE.Mesh(outerGeo, outerMat);
        sceneRef.current.add(outerSphere);
        objectsRef.current.push(outerSphere);
        
        // Middle layer
        const middleGeo = new THREE.IcosahedronGeometry(1.3, 2);
        const middleMat = new THREE.MeshStandardMaterial({
          color: threeColor,
          emissive: threeColor,
          emissiveIntensity: 0.3,
          wireframe: true,
          transparent: true,
          opacity: 0.6,
        });
        
        const middleSphere = new THREE.Mesh(middleGeo, middleMat);
        sceneRef.current.add(middleSphere);
        objectsRef.current.push(middleSphere);
        
        // Core layer
        const coreGeo2 = new THREE.IcosahedronGeometry(0.7, 3);
        const coreMat2 = new THREE.MeshStandardMaterial({
          color: threeColor,
          emissive: threeColor,
          emissiveIntensity: 0.5,
          wireframe: false,
          transparent: true,
          opacity: 0.8,
        });
        
        const coreSphere = new THREE.Mesh(coreGeo2, coreMat2);
        sceneRef.current.add(coreSphere);
        objectsRef.current.push(coreSphere);
        
        // Add particles
        createParticles(threeColor, 200, 2, 0.03);
        break;
        
      case "quantum-physics":
        // Create quantum physics visualization
        createParticles(threeColor, 300, 2, 0.05);
        createEnergyField(threeColor);
        break;
        
      case "metapsychology":
        // Create metapsychology visualization
        const layers = 5;
        
        for (let i = 0; i < layers; i++) {
          const radius = 0.5 + i * 0.4;
          const detail = Math.max(0, 2 - i);
          
          const geo = new THREE.IcosahedronGeometry(radius, detail);
          const mat = new THREE.MeshStandardMaterial({
            color: threeColor,
            emissive: threeColor,
            emissiveIntensity: 0.3 - (i * 0.05),
            wireframe: i !== 0, // Solid core, wireframe outer layers
            transparent: true,
            opacity: 1.0 - (i * 0.15),
          });
          
          const layer = new THREE.Mesh(geo, mat);
          layer.rotation.x = i * 0.2;
          layer.rotation.y = i * 0.3;
          
          sceneRef.current.add(layer);
          objectsRef.current.push(layer);
        }
        
        // Add particles
        createParticles(threeColor, 200);
        break;
        
      default:
        // Default visualization for unknown frameworks
        createDefaultViz(threeColor);
        break;
    }
  };

  // Initialize Three.js scene
  const initScene = () => {
    if (!containerRef.current) return;
    
    // Create scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      60,                                                      // Field of view
      containerRef.current.clientWidth / containerRef.current.clientHeight,  // Aspect ratio
      0.1,                                                     // Near clipping plane
      1000                                                     // Far clipping plane
    );
    camera.position.z = 5;
    cameraRef.current = camera;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);  // Transparent background
    
    // Clear container and add renderer
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Create visualization based on framework
    createVisualization();
    
    // Start animation loop
    clockRef.current.start();
    animate();
  };
  
  // Animation loop
  const animate = () => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;
    
    // Get time value for animations
    const newTimeValue = clockRef.current.getElapsedTime();
    setTimeValue(newTimeValue);
    
    // Animate framework visualization
    animateFrameworkVisualization(frameworkId, newTimeValue, isHovered ? 1.5 : 1.0);
    
    // Rotate camera slightly to create floating effect
    if (cameraRef.current) {
      cameraRef.current.position.x = Math.sin(newTimeValue * 0.2) * 0.5;
      cameraRef.current.position.y = Math.sin(newTimeValue * 0.1) * 0.3;
      cameraRef.current.lookAt(0, 0, 0);
    }
    
    // Render scene
    rendererRef.current.render(sceneRef.current, cameraRef.current);
    
    // Continue animation loop
    animationFrameRef.current = requestAnimationFrame(animate);
  };
  
  // Handle window resize
  const handleResize = () => {
    if (
      !containerRef.current ||
      !rendererRef.current ||
      !cameraRef.current
    ) return;
    
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    
    // Update camera aspect ratio
    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();
    
    // Update renderer size
    rendererRef.current.setSize(width, height);
  };
  
  // Initialize scene on mount
  useEffect(() => {
    initScene();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup on unmount
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      window.removeEventListener('resize', handleResize);
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      
      if (sceneRef.current) {
        // Dispose of all objects
        sceneRef.current.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach(material => material.dispose());
              } else {
                object.material.dispose();
              }
            }
          }
        });
      }
    };
  }, []);
  
  // Recreate visualization when framework ID or color changes
  useEffect(() => {
    if (sceneRef.current) {
      createVisualization();
    }
  }, [frameworkId, color]);
  
  // Render visualization with overlaid info
  return (
    <motion.div 
      ref={containerRef}
      className="relative w-full h-64 rounded-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Info overlay */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 p-4 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="text-xl font-bold text-white">{title}</h3>
        {description && (
          <p className="text-sm text-gray-300 mt-1">{description}</p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default FrameworkVisualizer;