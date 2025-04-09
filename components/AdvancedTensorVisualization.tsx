import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';

export interface AdvancedTensorVisualizationProps {
  type: "spiral" | "torus" | "fractal" | "cube" | "field" | "radial";
  color: string;
  title: string;
  description: string;
  isActive?: boolean;
}

const AdvancedTensorVisualization: React.FC<AdvancedTensorVisualizationProps> = ({
  type,
  color,
  title,
  description,
  isActive = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const objectsRef = useRef<THREE.Object3D[]>([]);
  
  useEffect(() => {
    if (!containerRef.current || !isActive) return;

    try {
      // Set up scene
      const scene = new THREE.Scene();
      sceneRef.current = scene;
      
      // Create camera
      const camera = new THREE.PerspectiveCamera(
        75,
        containerRef.current.clientWidth / containerRef.current.clientHeight,
        0.1,
        1000
      );
      camera.position.z = 5;
      cameraRef.current = camera;
      
      // Create renderer with better error handling
      const renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        powerPreference: 'high-performance',
        preserveDrawingBuffer: true
      });
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(window.devicePixelRatio);
      
      // Clean up any existing canvas before adding a new one
      const existingCanvas = containerRef.current.querySelector('canvas');
      if (existingCanvas) {
        containerRef.current.removeChild(existingCanvas);
      }
      
      containerRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;
      
      // Add lights with more dramatic effect
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
      directionalLight.position.set(1, 1, 1);
      scene.add(directionalLight);
      
      // Add colored point light based on the tensor type
      const pointLight = new THREE.PointLight(color, 1.5, 100);
      pointLight.position.set(0, 0, 3);
      scene.add(pointLight);
      
      // Add a secondary point light for better highlights
      const secondaryLight = new THREE.PointLight(0xffffff, 0.8, 50);
      secondaryLight.position.set(-2, 2, 2);
      scene.add(secondaryLight);
      
      // Create objects based on type
      createObjects();
      
      // Add fog for depth effect
      scene.fog = new THREE.FogExp2(0x000000, 0.08);
      
      // Handle resize with debouncing
      let resizeTimeout: number | null = null;
      const handleResize = () => {
        if (resizeTimeout) {
          window.clearTimeout(resizeTimeout);
        }
        
        resizeTimeout = window.setTimeout(() => {
          if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
          
          cameraRef.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
          rendererRef.current.setPixelRatio(window.devicePixelRatio);
        }, 100);
      };
      
      window.addEventListener('resize', handleResize);
      
      // Interaction handlers for better user experience
      let isMouseDown = false;
      let previousMousePosition = { x: 0, y: 0 };
      
      const handleMouseMove = (event: MouseEvent) => {
        if (!isMouseDown || !sceneRef.current) return;
        
        const deltaX = event.clientX - previousMousePosition.x;
        const deltaY = event.clientY - previousMousePosition.y;
        
        // Apply rotation to the entire scene for interactive movement
        objectsRef.current.forEach((obj) => {
          obj.rotation.y += deltaX * 0.005;
          obj.rotation.x += deltaY * 0.005;
        });
        
        previousMousePosition = {
          x: event.clientX,
          y: event.clientY
        };
      };
      
      const handleMouseDown = (event: MouseEvent) => {
        isMouseDown = true;
        previousMousePosition = {
          x: event.clientX,
          y: event.clientY
        };
      };
      
      const handleMouseUp = () => {
        isMouseDown = false;
      };
      
      // Add mouse interaction for more immersive experience
      containerRef.current.addEventListener('mousemove', handleMouseMove);
      containerRef.current.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mouseup', handleMouseUp);
      
      // Animation loop with better clock sync
      const clock = new THREE.Clock();
      
      const animate = () => {
        try {
          if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;
          
          const delta = clock.getDelta();
          
          // Check if paused by looking for the 'paused' class on the container
          const isPaused = containerRef.current?.classList.contains('paused');
          
          if (!isPaused) {
            // Get animation speed from CSS variable or default to 1.0 if not set
            const speedStr = getComputedStyle(document.documentElement).getPropertyValue('--tensor-animation-speed') || '1s';
            const speedValue = 1 / parseFloat(speedStr); // Convert time to speed (e.g., 0.5s → 2.0x speed)
            
            // Apply gentle continuous rotation with speed adjustment
            objectsRef.current.forEach((obj) => {
              obj.rotation.x += 0.005 * delta * 60 * speedValue; // Normalize by frame rate and apply speed
              obj.rotation.y += 0.01 * delta * 60 * speedValue;
            });
            
            // Special animations based on type
            animateFramework(speedValue);
          }
          
          // Always render the scene, even when paused
          rendererRef.current.render(sceneRef.current, cameraRef.current);
          animationFrameRef.current = requestAnimationFrame(animate);
        } catch (err) {
          console.error("Animation error:", err);
          // If animation fails, try to recover
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = requestAnimationFrame(animate);
          }
        }
      };
      
      animate();
      
      // Force initial render
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
      
      // Mark this as an active simulation element
      if (containerRef.current) {
        containerRef.current.classList.add('simulation-element');
        containerRef.current.classList.add('running');
      }
      
      return () => {
        // Clean up all event listeners
        window.removeEventListener('resize', handleResize);
        if (containerRef.current) {
          containerRef.current.removeEventListener('mousemove', handleMouseMove);
          containerRef.current.removeEventListener('mousedown', handleMouseDown);
        }
        window.removeEventListener('mouseup', handleMouseUp);
        
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        
        if (rendererRef.current && containerRef.current) {
          try {
            containerRef.current.removeChild(rendererRef.current.domElement);
          } catch (err) {
            console.error("Error removing renderer:", err);
          }
        }
        
        // Clear objects with proper memory management
        objectsRef.current.forEach((obj) => {
          if (sceneRef.current) {
            sceneRef.current.remove(obj);
            // Dispose of geometries and materials to prevent memory leaks
            if (obj instanceof THREE.Mesh) {
              if (obj.geometry) obj.geometry.dispose();
              if (obj.material instanceof THREE.Material) {
                obj.material.dispose();
              } else if (Array.isArray(obj.material)) {
                obj.material.forEach(material => material.dispose());
              }
            }
          }
        });
        
        objectsRef.current = [];
        
        // Dispose of renderer
        if (rendererRef.current) {
          rendererRef.current.dispose();
        }
      };
    } catch (err) {
      console.error("Error setting up 3D visualization:", err);
      // Try to clean up any partial setup
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [type, color, isActive]);
  
  const createObjects = () => {
    if (!sceneRef.current) return;
    
    // Clear previous objects
    objectsRef.current.forEach((obj) => {
      if (sceneRef.current) {
        sceneRef.current.remove(obj);
      }
    });
    objectsRef.current = [];
    
    // Create new objects based on type
    const threeColor = new THREE.Color(color);
    
    switch (type) {
      case "spiral":
        createSpiral(threeColor);
        break;
      case "torus":
        createTorus(threeColor);
        break;
      case "fractal":
        createFractal(threeColor);
        break;
      case "cube":
        createCube(threeColor);
        break;
      case "field":
        createField(threeColor);
        break;
      case "radial":
        createRadial(threeColor);
        break;
    }
  };
  
  const createSpiral = (color: THREE.Color) => {
    if (!sceneRef.current) return;
    
    const points = [];
    const numPoints = 1000;
    
    for (let i = 0; i < numPoints; i++) {
      const t = i / numPoints * Math.PI * 10;
      const radius = 0.1 + t * 0.05;
      
      const x = radius * Math.cos(t * 3);
      const y = radius * Math.sin(t * 3);
      const z = t * 0.1 - 2;
      
      points.push(new THREE.Vector3(x, y, z));
    }
    
    const curve = new THREE.CatmullRomCurve3(points);
    const geometry = new THREE.TubeGeometry(curve, 100, 0.05, 8, false);
    
    const material = new THREE.MeshStandardMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.3,
      metalness: 0.8,
      roughness: 0.2,
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    sceneRef.current.add(mesh);
    objectsRef.current.push(mesh);
    
    // Add particle system along the spiral
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(numPoints * 3);
    
    for (let i = 0; i < numPoints; i++) {
      const t = i / numPoints * Math.PI * 10;
      const radius = 0.1 + t * 0.05;
      
      const x = radius * Math.cos(t * 3) + (Math.random() - 0.5) * 0.2;
      const y = radius * Math.sin(t * 3) + (Math.random() - 0.5) * 0.2;
      const z = t * 0.1 - 2 + (Math.random() - 0.5) * 0.2;
      
      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      color: color,
      size: 0.03,
      transparent: true,
      opacity: 0.7,
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    sceneRef.current.add(particles);
    objectsRef.current.push(particles);
  };
  
  const createTorus = (color: THREE.Color) => {
    if (!sceneRef.current) return;
    
    // Main torus
    const geometry = new THREE.TorusGeometry(1, 0.3, 16, 100);
    const material = new THREE.MeshStandardMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.3,
      metalness: 0.8,
      roughness: 0.2,
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    sceneRef.current.add(mesh);
    objectsRef.current.push(mesh);
    
    // Inner torus
    const innerGeometry = new THREE.TorusGeometry(0.6, 0.15, 16, 100);
    const innerMaterial = new THREE.MeshStandardMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.5,
      metalness: 0.8,
      roughness: 0.2,
      transparent: true,
      opacity: 0.7,
    });
    
    const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
    innerMesh.rotation.x = Math.PI / 2;
    sceneRef.current.add(innerMesh);
    objectsRef.current.push(innerMesh);
    
    // Add particles around the torus
    const numParticles = 500;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(numParticles * 3);
    
    for (let i = 0; i < numParticles; i++) {
      const t = i / numParticles * Math.PI * 2;
      const s = i / numParticles * Math.PI * 2;
      const radius = 1 + (Math.random() - 0.5) * 0.5;
      
      const x = radius * Math.cos(t) * 1.2;
      const y = radius * Math.sin(t) * 1.2;
      const z = (Math.random() - 0.5) * 0.5;
      
      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      color: color,
      size: 0.03,
      transparent: true,
      opacity: 0.5,
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    sceneRef.current.add(particles);
    objectsRef.current.push(particles);
  };
  
  const createFractal = (color: THREE.Color) => {
    if (!sceneRef.current) return;
    
    // Create a recursive fractal structure
    const createBranch = (
      position: THREE.Vector3, 
      direction: THREE.Vector3, 
      length: number, 
      thickness: number,
      depth: number
    ) => {
      if (depth <= 0 || !sceneRef.current) return;
      
      // Create cylinder for branch
      const geometry = new THREE.CylinderGeometry(thickness * 0.5, thickness, length, 8);
      geometry.translate(0, length / 2, 0);
      
      const material = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.3,
        metalness: 0.6,
        roughness: 0.4,
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      
      // Position and orient the branch
      mesh.position.copy(position);
      
      // Align cylinder to direction
      const quaternion = new THREE.Quaternion();
      quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
      mesh.setRotationFromQuaternion(quaternion);
      
      sceneRef.current.add(mesh);
      objectsRef.current.push(mesh);
      
      // Calculate new position for child branches
      const newPos = position.clone().add(direction.clone().multiplyScalar(length));
      
      // Create child branches with random directions
      if (depth > 1) {
        const numBranches = 2; // Can increase for more complex structures
        
        for (let i = 0; i < numBranches; i++) {
          // Create random direction that's not too far from parent direction
          const randDir = new THREE.Vector3(
            direction.x + (Math.random() - 0.5) * 1.0,
            direction.y + (Math.random() - 0.5) * 1.0,
            direction.z + (Math.random() - 0.5) * 1.0
          ).normalize();
          
          createBranch(
            newPos,
            randDir,
            length * 0.7, // Each generation gets smaller
            thickness * 0.7,
            depth - 1
          );
        }
      }
    };
    
    // Start with a few base branches
    const numBaseBranches = 3;
    
    for (let i = 0; i < numBaseBranches; i++) {
      const angle = (i / numBaseBranches) * Math.PI * 2;
      const direction = new THREE.Vector3(
        Math.cos(angle),
        0.5, // Grow upward
        Math.sin(angle)
      ).normalize();
      
      createBranch(
        new THREE.Vector3(0, -1, 0), // Start from bottom
        direction,
        0.8,
        0.1,
        3 // 3 levels of recursion
      );
    }
    
    // Add particles around the fractal
    const numParticles = 300;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(numParticles * 3);
    
    for (let i = 0; i < numParticles; i++) {
      const radius = 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      color: color,
      size: 0.03,
      transparent: true,
      opacity: 0.5,
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    sceneRef.current.add(particles);
    objectsRef.current.push(particles);
  };
  
  const createCube = (color: THREE.Color) => {
    if (!sceneRef.current) return;
    
    // Main cube
    const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const edges = new THREE.EdgesGeometry(geometry);
    const material = new THREE.LineBasicMaterial({ color: color });
    
    const wireframe = new THREE.LineSegments(edges, material);
    sceneRef.current.add(wireframe);
    objectsRef.current.push(wireframe);
    
    // Inner cubes
    const numInnerCubes = 3;
    
    for (let i = 0; i < numInnerCubes; i++) {
      const size = 1.2 - (i * 0.3);
      const innerGeometry = new THREE.BoxGeometry(size, size, size);
      const innerEdges = new THREE.EdgesGeometry(innerGeometry);
      const innerMaterial = new THREE.LineBasicMaterial({ 
        color: color, 
        transparent: true,
        opacity: 0.7 - (i * 0.1)
      });
      
      const innerWireframe = new THREE.LineSegments(innerEdges, innerMaterial);
      innerWireframe.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      
      sceneRef.current.add(innerWireframe);
      objectsRef.current.push(innerWireframe);
    }
    
    // Add vertices at cube corners
    const cornerPositions = [
      new THREE.Vector3(0.75, 0.75, 0.75),
      new THREE.Vector3(0.75, 0.75, -0.75),
      new THREE.Vector3(0.75, -0.75, 0.75),
      new THREE.Vector3(0.75, -0.75, -0.75),
      new THREE.Vector3(-0.75, 0.75, 0.75),
      new THREE.Vector3(-0.75, 0.75, -0.75),
      new THREE.Vector3(-0.75, -0.75, 0.75),
      new THREE.Vector3(-0.75, -0.75, -0.75),
    ];
    
    cornerPositions.forEach(pos => {
      const sphereGeometry = new THREE.SphereGeometry(0.08, 16, 16);
      const sphereMaterial = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.5,
      });
      
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.copy(pos);
      
      if (sceneRef.current) {
        sceneRef.current.add(sphere);
        objectsRef.current.push(sphere);
      }
    });
    
    // Add particles inside the cube
    const numParticles = 200;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(numParticles * 3);
    
    for (let i = 0; i < numParticles; i++) {
      const x = (Math.random() - 0.5) * 1.4;
      const y = (Math.random() - 0.5) * 1.4;
      const z = (Math.random() - 0.5) * 1.4;
      
      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      color: color,
      size: 0.03,
      transparent: true,
      opacity: 0.5,
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    sceneRef.current.add(particles);
    objectsRef.current.push(particles);
  };
  
  const createField = (color: THREE.Color) => {
    if (!sceneRef.current) return;
    
    // Create vector field with arrows
    const arrowCount = 100;
    const fieldSize = 4;
    
    for (let i = 0; i < arrowCount; i++) {
      // Random position within a sphere
      const radius = 2 * Math.random();
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      const position = new THREE.Vector3(x, y, z);
      
      // Direction based on vector field (e.g., rotating field)
      const direction = new THREE.Vector3(
        -y * 0.5,
        x * 0.5,
        z * 0.2
      ).normalize();
      
      // Create arrow
      const arrowLength = 0.2 + Math.random() * 0.3;
      const arrowGeometry = new THREE.CylinderGeometry(0.01, 0.05, arrowLength, 8);
      arrowGeometry.translate(0, arrowLength / 2, 0);
      
      const arrowMaterial = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.5 + Math.random() * 0.5,
      });
      
      const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
      arrow.position.copy(position);
      
      // Orient the arrow along the direction
      const quaternion = new THREE.Quaternion();
      quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
      arrow.setRotationFromQuaternion(quaternion);
      
      sceneRef.current.add(arrow);
      objectsRef.current.push(arrow);
    }
    
    // Add field lines as curves
    const lineCount = 10;
    
    for (let i = 0; i < lineCount; i++) {
      const points = [];
      const steps = 100;
      
      // Start at random position
      const startRadius = 0.5;
      const startTheta = Math.random() * Math.PI * 2;
      const startPhi = Math.acos(2 * Math.random() - 1);
      
      let x = startRadius * Math.sin(startPhi) * Math.cos(startTheta);
      let y = startRadius * Math.sin(startPhi) * Math.sin(startTheta);
      let z = startRadius * Math.cos(startPhi);
      
      const position = new THREE.Vector3(x, y, z);
      
      // Create field line by following the vector field
      for (let j = 0; j < steps; j++) {
        points.push(position.clone());
        
        // Calculate field direction at this point (same formula as arrows)
        const direction = new THREE.Vector3(
          -position.y * 0.5,
          position.x * 0.5,
          position.z * 0.2
        ).normalize().multiplyScalar(0.05);
        
        // Move along the field
        position.add(direction);
        
        // Stop if we go too far
        if (position.length() > 2.5) break;
      }
      
      const curve = new THREE.CatmullRomCurve3(points);
      const geometry = new THREE.TubeGeometry(curve, 50, 0.01, 8, false);
      
      const material = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.5,
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      sceneRef.current.add(mesh);
      objectsRef.current.push(mesh);
    }
  };
  
  const createRadial = (color: THREE.Color) => {
    if (!sceneRef.current) return;
    
    // Create concentric rings
    const ringCount = 5;
    
    for (let i = 0; i < ringCount; i++) {
      const radius = 0.5 + i * 0.3;
      const geometry = new THREE.TorusGeometry(radius, 0.02, 16, 100);
      
      const material = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 1 - (i / ringCount) * 0.5,
      });
      
      const ring = new THREE.Mesh(geometry, material);
      ring.rotation.x = Math.PI / 2;
      
      sceneRef.current.add(ring);
      objectsRef.current.push(ring);
    }
    
    // Create radial spokes
    const spokeCount = 12;
    
    for (let i = 0; i < spokeCount; i++) {
      const angle = (i / spokeCount) * Math.PI * 2;
      
      const points = [];
      const innerRadius = 0.2;
      const outerRadius = 2.0;
      
      points.push(new THREE.Vector3(
        innerRadius * Math.cos(angle),
        0,
        innerRadius * Math.sin(angle)
      ));
      
      points.push(new THREE.Vector3(
        outerRadius * Math.cos(angle),
        0,
        outerRadius * Math.sin(angle)
      ));
      
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      
      const material = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.7,
      });
      
      const line = new THREE.Line(geometry, material);
      sceneRef.current.add(line);
      objectsRef.current.push(line);
    }
    
    // Add particles that flow along the radial pattern
    const numParticles = 200;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(numParticles * 3);
    
    for (let i = 0; i < numParticles; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.2 + Math.random() * 1.8;
      
      const x = radius * Math.cos(angle);
      const y = (Math.random() - 0.5) * 0.2;
      const z = radius * Math.sin(angle);
      
      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      color: color,
      size: 0.03,
      transparent: true,
      opacity: 0.7,
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    sceneRef.current.add(particles);
    objectsRef.current.push(particles);
    
    // Central sphere
    const sphereGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    const sphereMaterial = new THREE.MeshStandardMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.5,
    });
    
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sceneRef.current.add(sphere);
    objectsRef.current.push(sphere);
  };
  
  const animateFramework = (speedMultiplier = 1.0) => {
    if (!objectsRef.current || objectsRef.current.length === 0 || !sceneRef.current) return;
    
    const time = Date.now() * 0.001; // Current time in seconds
    
    // Add simulation-element class to parent container for external control
    if (containerRef.current) {
      containerRef.current.classList.add('simulation-element');
      
      // Check if simulation is paused
      if (containerRef.current.classList.contains('paused')) {
        return; // Skip animation if paused
      }
      
      // Add a subtle breathing effect to the container for immersive effect
      const pulseValue = Math.sin(time * 1.5) * 0.03 + 1;
      containerRef.current.style.transform = `scale(${pulseValue})`;
    }
    
    // Global particle systems enhancements for data-like appearance
    objectsRef.current.forEach((obj) => {
      if (obj instanceof THREE.Points && obj.geometry.attributes.position) {
        const positions = obj.geometry.attributes.position.array as Float32Array;
        const count = positions.length / 3;
        
        // Apply wave-like movement to particles based on their position
        for (let i = 0; i < count; i++) {
          const idx = i * 3;
          const x = positions[idx];
          const y = positions[idx + 1];
          const z = positions[idx + 2];
          
          // Add subtle oscillation based on position with speed adjustment
          positions[idx] += Math.sin(time * 2 * speedMultiplier + y * 3) * 0.001 * speedMultiplier;
          positions[idx + 1] += Math.cos(time * 1.5 * speedMultiplier + x * 2) * 0.001 * speedMultiplier;
          positions[idx + 2] += Math.sin(time * 2.5 * speedMultiplier + z + i * 0.01) * 0.0015 * speedMultiplier;
        }
        obj.geometry.attributes.position.needsUpdate = true;
        
        // Update material properties for more vibrant appearance
        if (obj.material instanceof THREE.PointsMaterial) {
          obj.material.size = 0.03 + Math.sin(time * 1.5) * 0.01;
          obj.material.opacity = 0.6 + Math.sin(time + Math.cos(time * 0.5)) * 0.3;
        }
      }
    });
    
    switch (type) {
      case "spiral":
        // Make the spiral breathe and rotate with more dynamic movement
        objectsRef.current.forEach((obj, index) => {
          // Apply different animations to different objects with speed adjustment
          if (index === 0) { // Main spiral
            obj.rotation.z = time * 0.3 * speedMultiplier;
            obj.rotation.x = Math.sin(time * 0.5 * speedMultiplier) * 0.2;
            // Add some undulation
            obj.position.y = Math.sin(time * speedMultiplier) * 0.1;
            // Add pulsing effect
            obj.scale.set(
              1 + Math.sin(time * 2 * speedMultiplier) * 0.1,
              1 + Math.sin(time * 2 * speedMultiplier) * 0.1,
              1 + Math.sin(time * 2 * speedMultiplier) * 0.1
            );
          } else if (index === 1) { // Particles
            obj.rotation.z = -time * 0.1 * speedMultiplier;
            // Make particles shimmer
            if (obj instanceof THREE.Points && obj.material instanceof THREE.PointsMaterial) {
              obj.material.size = 0.03 + Math.sin(time * 3 * speedMultiplier) * 0.01;
              obj.material.opacity = 0.5 + Math.sin(time * 2 * speedMultiplier) * 0.3;
            }
            
            // Update particle positions for flowing effect
            if (obj instanceof THREE.Points && obj.geometry.attributes.position) {
              const positions = obj.geometry.attributes.position.array;
              for (let i = 0; i < positions.length; i += 3) {
                positions[i + 2] += Math.sin(time * 2 * speedMultiplier + i * 0.01) * 0.002 * speedMultiplier;
              }
              obj.geometry.attributes.position.needsUpdate = true;
            }
          }
        });
        break;
        
      case "torus":
        // Make the tori rotate in different directions with more complexity
        objectsRef.current.forEach((obj, index) => {
          if (index === 0) { // Main torus
            obj.rotation.x = time * 0.5;
            obj.rotation.z = Math.sin(time * 0.3) * 0.2;
            // Gentle oscillation
            obj.position.y = Math.sin(time) * 0.05;
            // Pulsing effect
            obj.scale.set(
              1 + Math.sin(time) * 0.05,
              1 + Math.sin(time) * 0.05,
              1 + Math.sin(time) * 0.05
            );
          } else if (index === 1) { // Inner torus
            obj.rotation.y = -time * 0.4;
            obj.rotation.z = time * 0.2;
            // Counter oscillation
            obj.position.y = -Math.sin(time) * 0.05;
            // Complementary pulsing
            obj.scale.set(
              1 + Math.cos(time) * 0.08,
              1 + Math.cos(time) * 0.08,
              1 + Math.cos(time) * 0.08
            );
          } else if (index === 2) { // Particles
            obj.rotation.x = time * 0.1;
            obj.rotation.y = time * 0.2;
            
            // Make particles flow around torus
            if (obj instanceof THREE.Points && obj.geometry.attributes.position) {
              const positions = obj.geometry.attributes.position.array;
              for (let i = 0; i < positions.length; i += 3) {
                const x = positions[i];
                const y = positions[i + 1];
                
                // Rotate particles around the center
                const angle = 0.005;
                const cos = Math.cos(angle);
                const sin = Math.sin(angle);
                
                positions[i] = x * cos - y * sin;
                positions[i + 1] = x * sin + y * cos;
                positions[i + 2] += Math.sin(time * 3 + i * 0.01) * 0.001;
              }
              obj.geometry.attributes.position.needsUpdate = true;
            }
          }
        });
        break;
        
      case "fractal":
        // Enhanced fractal animations with growth patterns
        objectsRef.current.forEach((obj, index) => {
          if (obj instanceof THREE.Mesh && obj.geometry instanceof THREE.CylinderGeometry) {
            // Pulsing effect unique to each branch
            const pulseOffset = index * 0.2;
            obj.scale.set(
              1 + Math.sin(time * 2 + pulseOffset) * 0.08,
              1 + Math.sin(time * 2 + pulseOffset) * 0.08,
              1 + Math.sin(time * 2 + pulseOffset) * 0.08
            );
            
            // Subtle rotational movement
            obj.rotation.z += 0.001 * (index % 2 ? 1 : -1);
          } else if (obj instanceof THREE.Points) {
            // Particle system rotation
            obj.rotation.x = time * 0.1;
            obj.rotation.z = time * 0.05;
            
            // Make particles pulse
            if (obj.material instanceof THREE.PointsMaterial) {
              obj.material.size = 0.03 + Math.sin(time * 1.5) * 0.01;
            }
          }
        });
        break;
        
      case "cube":
        // Enhanced cube animations with more complex movement
        const group = objectsRef.current.find(obj => obj instanceof THREE.Group);
        
        objectsRef.current.forEach((obj, index) => {
          if (index >= 1 && index <= 3) { // Inner cubes
            // More complex rotation patterns
            obj.rotation.x = time * 0.2 * (index % 2 ? 1 : -1);
            obj.rotation.y = time * 0.3 * (index % 3 ? 1 : -1);
            obj.rotation.z = Math.sin(time * 0.1 * index) * 0.1;
            
            // Pulsate slightly
            const scale = 1 + Math.sin(time * (0.5 + index * 0.1)) * 0.05;
            obj.scale.set(scale, scale, scale);
          } else if (index === 0) { // Main cube wireframe
            // Slow continuous rotation
            obj.rotation.x = time * 0.1;
            obj.rotation.y = time * 0.15;
          } else if (obj instanceof THREE.Mesh && obj.geometry instanceof THREE.SphereGeometry) {
            // Corner spheres
            const pulseScale = 1 + Math.sin(time * 2 + index * 0.2) * 0.1;
            obj.scale.set(pulseScale, pulseScale, pulseScale);
            
            // Make them emit light in pulses
            if (obj.material instanceof THREE.MeshStandardMaterial) {
              obj.material.emissiveIntensity = 0.3 + Math.sin(time * 3 + index) * 0.2;
            }
          } else if (obj instanceof THREE.Points) {
            // Particle system
            obj.rotation.x = time * 0.05;
            obj.rotation.y = -time * 0.03;
            
            // Internal swirling effect
            if (obj.geometry instanceof THREE.BufferGeometry) {
              const positions = obj.geometry.attributes.position.array;
              for (let i = 0; i < positions.length; i += 3) {
                const x = positions[i];
                const y = positions[i + 1];
                const z = positions[i + 2];
                const distance = Math.sqrt(x * x + y * y + z * z);
                
                // Only affect particles near the edges
                if (distance > 0.5) {
                  positions[i] += Math.sin(time + distance) * 0.001;
                  positions[i + 1] += Math.cos(time + distance) * 0.001;
                }
              }
              obj.geometry.attributes.position.needsUpdate = true;
            }
          }
        });
        break;
        
      case "field":
        // Enhanced field dynamics with flowing energy patterns
        objectsRef.current.forEach((obj, index) => {
          if (obj instanceof THREE.Mesh && obj.geometry instanceof THREE.CylinderGeometry) {
            // Dynamic vector field simulation
            const position = obj.position.clone();
            
            // Time-varying force field with wave patterns
            const waveX = Math.sin(time * 0.5 + position.z * 0.5);
            const waveY = Math.cos(time * 0.4 + position.x * 0.5);
            const waveZ = Math.sin(time * 0.3 + position.y * 0.5) * 0.5;
            
            // Create a dynamic flow field direction
            const direction = new THREE.Vector3(
              -position.y * 0.5 + waveX * 0.3,
              position.x * 0.5 + waveY * 0.3,
              position.z * 0.2 + waveZ
            ).normalize();
            
            // Smooth rotation to the new direction
            const quaternion = new THREE.Quaternion();
            quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
            obj.quaternion.slerp(quaternion, 0.05);
            
            // Subtle pulsing effect 
            const pulseScale = 1 + Math.sin(time * 2 + index * 0.1) * 0.1;
            obj.scale.set(0.8 * pulseScale, 1 * pulseScale, 0.8 * pulseScale);
            
            // Change color intensity based on field strength
            if (obj.material instanceof THREE.MeshStandardMaterial) {
              // Vary emissive intensity
              obj.material.emissiveIntensity = 0.3 + Math.sin(time + index * 0.1) * 0.2;
            }
          } else if (obj instanceof THREE.Points) {
            // Particle system - create flow patterns
            obj.rotation.x = time * 0.1;
            obj.rotation.z = time * 0.2;
            
            // Make particles flow along field lines
            if (obj.geometry instanceof THREE.BufferGeometry) {
              const positions = obj.geometry.attributes.position.array;
              for (let i = 0; i < positions.length; i += 3) {
                // Create flowing motion
                const x = positions[i];
                const y = positions[i + 1];
                const z = positions[i + 2];
                
                // Flow along field lines
                positions[i] += (y * 0.01) * Math.sin(time);
                positions[i + 1] += (-x * 0.01) * Math.sin(time);
                
                // Reset particles that flow too far
                const distance = Math.sqrt(x*x + y*y + z*z);
                if (distance > 2.5) {
                  positions[i] *= 0.8;
                  positions[i+1] *= 0.8; 
                  positions[i+2] *= 0.8;
                }
              }
              obj.geometry.attributes.position.needsUpdate = true;
            }
          }
        });
        break;
        
      case "radial":
        // Enhanced radial animations with multiple ring interactions
        objectsRef.current.forEach((obj, index) => {
          if (obj instanceof THREE.Mesh && obj.geometry instanceof THREE.TorusGeometry) {
            // Each ring has different rotation speeds and axes
            obj.rotation.x = time * 0.1 * (index % 3 === 0 ? 1 : 0);
            obj.rotation.y = time * 0.15 * (index % 3 === 1 ? 1 : 0);
            obj.rotation.z = time * 0.2 * (index % 3 === 2 ? 1 : 0);
            
            // Breathing effect - expand and contract
            const pulseScale = 1 + Math.sin(time * (0.5 + index * 0.1)) * 0.1;
            obj.scale.set(pulseScale, pulseScale, pulseScale);
            
            // Change opacity for shimmering effect
            if (obj.material instanceof THREE.MeshStandardMaterial) {
              obj.material.opacity = 0.7 + Math.sin(time * 2 + index) * 0.2;
              
              // Emissive intensity variation
              obj.material.emissiveIntensity = 0.3 + Math.sin(time * 3 + index) * 0.2;
            }
          } else if (obj instanceof THREE.Points) {
            // Particle system effects
            obj.rotation.y = time * 0.1;
            
            // Make particles flow in a spiral
            if (obj.geometry instanceof THREE.BufferGeometry) {
              const positions = obj.geometry.attributes.position.array;
              for (let i = 0; i < positions.length; i += 3) {
                const x = positions[i];
                const y = positions[i + 1];
                
                // Calculate current angle and radius
                const angle = Math.atan2(y, x) + 0.003;
                const radius = Math.sqrt(x*x + y*y);
                
                // Update positions to create spiral flow
                positions[i] = radius * Math.cos(angle);
                positions[i+1] = radius * Math.sin(angle);
                
                // Subtle pulsating radius
                const newRadius = radius + Math.sin(time * 2 + radius * 5) * 0.01;
                positions[i] *= newRadius/radius;
                positions[i+1] *= newRadius/radius;
              }
              obj.geometry.attributes.position.needsUpdate = true;
            }
          }
        });
        break;
    }
  };
  
  const handleMouseMove = (event: MouseEvent) => {
    if (!containerRef.current || !cameraRef.current) return;
    
    // Calculate mouse position in normalized coordinates (-1 to 1)
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / containerRef.current.clientWidth) * 2 - 1;
    const y = -((event.clientY - rect.top) / containerRef.current.clientHeight) * 2 + 1;
    
    // Subtle camera movement based on mouse position
    if (cameraRef.current) {
      cameraRef.current.position.x += (x * 0.5 - cameraRef.current.position.x) * 0.05;
      cameraRef.current.position.y += (y * 0.5 - cameraRef.current.position.y) * 0.05;
      cameraRef.current.lookAt(0, 0, 0);
    }
  };
  
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      
      return () => {
        container.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, []);
  
  return (
    <div className="relative w-full h-full">
      <div 
        ref={containerRef} 
        className="w-full h-[400px] bg-black rounded-lg overflow-hidden"
      ></div>
      
      <motion.div 
        className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-4 rounded-b-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="text-lg font-medium" style={{ color }}>{title}</h3>
        <p className="text-sm opacity-80 mt-1">{description}</p>
      </motion.div>
    </div>
  );
};

export default AdvancedTensorVisualization;