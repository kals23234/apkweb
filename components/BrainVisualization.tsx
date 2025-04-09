import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { brainRegions, BrainRegion } from "@/data/brainRegions";

interface BrainVisualizationProps {
  onRegionClick?: (region: BrainRegion) => void;
  activeRegion?: string | null;
}

const BrainVisualization = ({ onRegionClick, activeRegion }: BrainVisualizationProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const brainMeshesRef = useRef<Record<string, THREE.Mesh>>({});
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());
  
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Setup scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x151A30);
    sceneRef.current = scene;

    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      60,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 10;
    cameraRef.current = camera;

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    // Add controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    // Create brain base
    const brainGeometry = new THREE.SphereGeometry(3, 32, 32);
    const brainMaterial = new THREE.MeshPhongMaterial({
      color: 0x6E44FF,
      transparent: true,
      opacity: 0.1,
      wireframe: false,
    });
    const brainMesh = new THREE.Mesh(brainGeometry, brainMaterial);
    scene.add(brainMesh);

    // Add brain regions
    brainRegions.forEach(region => {
      const colorHex = region.color.replace('#', '0x');
      const material = new THREE.MeshPhongMaterial({
        color: parseInt(colorHex, 16),
        transparent: true,
        opacity: 0.6,
        emissive: parseInt(colorHex, 16),
        emissiveIntensity: 0.3
      });

      // Create region based on position
      const posX = region.position[0];
      const posY = region.position[1];
      const posZ = region.position[2];

      // Different geometries based on brain region type
      let geometry;
      if (region.shape === 'ellipsoid') {
        geometry = new THREE.SphereGeometry(region.size, 32, 32);
        geometry.scale(1.2, 0.8, 1);
      } else if (region.shape === 'rounded') {
        geometry = new THREE.BoxGeometry(region.size, region.size, region.size);
        geometry.scale(1.2, 0.7, 0.9);
      } else {
        geometry = new THREE.SphereGeometry(region.size, 32, 32);
      }

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(posX, posY, posZ);
      mesh.userData = { regionId: region.id };
      scene.add(mesh);
      
      // Store reference to mesh
      brainMeshesRef.current[region.id] = mesh;
    });

    // Handle mouse move for hover effects
    const handleMouseMove = (event: MouseEvent) => {
      if (!mountRef.current) return;
      
      // Calculate mouse position in normalized device coordinates
      const rect = mountRef.current.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / mountRef.current.clientWidth) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / mountRef.current.clientHeight) * 2 + 1;
    };
    
    // Handle clicks to select brain regions
    const handleMouseClick = () => {
      if (!cameraRef.current || !sceneRef.current) return;
      
      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
      const intersects = raycasterRef.current.intersectObjects(sceneRef.current.children);
      
      if (intersects.length > 0) {
        const selectedObject = intersects[0].object;
        if (selectedObject.userData && selectedObject.userData.regionId) {
          const region = brainRegions.find(r => r.id === selectedObject.userData.regionId);
          if (region && onRegionClick) {
            onRegionClick(region);
          }
        }
      }
    };
    
    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    mountRef.current.addEventListener('click', handleMouseClick);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (controlsRef.current) controlsRef.current.update();
      
      // Raycasting for hover effects
      if (cameraRef.current && sceneRef.current) {
        raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
        const intersects = raycasterRef.current.intersectObjects(sceneRef.current.children);
        
        // Reset all brain regions to normal
        Object.values(brainMeshesRef.current).forEach(mesh => {
          if (activeRegion && mesh.userData.regionId === activeRegion) {
            // Keep active region highlighted
            mesh.scale.set(1.2, 1.2, 1.2);
          } else if (hoveredRegion && mesh.userData.regionId === hoveredRegion) {
            // Keep hovered region highlighted
            mesh.scale.set(1.1, 1.1, 1.1);
          } else {
            mesh.scale.set(1, 1, 1);
          }
        });
        
        // Highlight hovered region
        if (intersects.length > 0) {
          const hoveredObject = intersects[0].object;
          if (hoveredObject.userData && hoveredObject.userData.regionId) {
            setHoveredRegion(hoveredObject.userData.regionId);
            hoveredObject.scale.set(1.1, 1.1, 1.1);
          } else {
            setHoveredRegion(null);
          }
        } else {
          setHoveredRegion(null);
        }
      }
      
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeEventListener('click', handleMouseClick);
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, [onRegionClick]);
  
  // Update active region highlighting
  useEffect(() => {
    Object.values(brainMeshesRef.current).forEach(mesh => {
      if (activeRegion && mesh.userData.regionId === activeRegion) {
        mesh.scale.set(1.2, 1.2, 1.2);
      } else if (!(hoveredRegion && mesh.userData.regionId === hoveredRegion)) {
        mesh.scale.set(1, 1, 1);
      }
    });
  }, [activeRegion, hoveredRegion]);

  return (
    <div 
      ref={mountRef} 
      className="w-full h-full rounded-xl overflow-hidden border border-primary/30"
      style={{ minHeight: "400px" }}
    />
  );
};

export default BrainVisualization;
