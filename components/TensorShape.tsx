import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Tensor } from "@/data/tensors";

interface TensorShapeProps {
  tensor: Tensor;
}

export default function TensorShape({ tensor }: TensorShapeProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<any | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const objectRef = useRef<THREE.Object3D | null>(null);

  const createTensorShape = (type: string) => {
    let geometry;
    let material;
    let object;

    const primaryColor = new THREE.Color("#6E44FF");
    const secondaryColor = new THREE.Color("#00D1FF");
    
    switch (type) {
      case "identity":
        // 3D vector (looped arrow) - Represented as a torus knot
        geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
        material = new THREE.MeshPhongMaterial({ 
          color: primaryColor, 
          transparent: true,
          opacity: 0.7,
          wireframe: false,
          emissive: primaryColor,
          emissiveIntensity: 0.3
        });
        object = new THREE.Mesh(geometry, material);
        break;
        
      case "emotional_curvature":
        // Spiral
        const curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(0.5, 0.5, 0.5),
          new THREE.Vector3(1, 1, 1),
          new THREE.Vector3(1.5, 0.5, 1.5),
          new THREE.Vector3(2, 0, 2),
          new THREE.Vector3(1.5, -0.5, 1.5),
          new THREE.Vector3(1, -1, 1),
          new THREE.Vector3(0.5, -0.5, 0.5),
          new THREE.Vector3(0, 0, 0),
        ]);
        
        geometry = new THREE.TubeGeometry(curve, 64, 0.15, 8, false);
        material = new THREE.MeshPhongMaterial({ 
          color: secondaryColor, 
          transparent: true,
          opacity: 0.7,
          emissive: secondaryColor,
          emissiveIntensity: 0.3
        });
        object = new THREE.Mesh(geometry, material);
        break;
        
      case "loop_field":
        // Ring (feedback circle)
        geometry = new THREE.TorusGeometry(1.2, 0.3, 16, 50);
        material = new THREE.MeshPhongMaterial({ 
          color: 0xFF3D71, 
          transparent: true,
          opacity: 0.7,
          emissive: 0xFF3D71,
          emissiveIntensity: 0.3
        });
        object = new THREE.Mesh(geometry, material);
        break;
        
      case "mirror_reflection":
        // Dual-face mirror
        const mirrorGroup = new THREE.Group();
        
        // Create two flat surfaces facing each other
        const planeGeom = new THREE.PlaneGeometry(2, 2);
        const planeMat1 = new THREE.MeshPhongMaterial({ 
          color: primaryColor,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.5,
          emissive: primaryColor,
          emissiveIntensity: 0.2
        });
        const planeMat2 = new THREE.MeshPhongMaterial({ 
          color: secondaryColor,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.5,
          emissive: secondaryColor,
          emissiveIntensity: 0.2
        });
        
        const plane1 = new THREE.Mesh(planeGeom, planeMat1);
        const plane2 = new THREE.Mesh(planeGeom, planeMat2);
        
        plane1.position.z = -0.5;
        plane2.position.z = 0.5;
        plane2.rotation.y = Math.PI;
        
        mirrorGroup.add(plane1);
        mirrorGroup.add(plane2);
        object = mirrorGroup;
        break;
        
      case "collapse":
        // Imploding cube
        geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
        material = new THREE.MeshPhongMaterial({ 
          color: primaryColor,
          transparent: true,
          opacity: 0.6,
          wireframe: true,
          emissive: primaryColor,
          emissiveIntensity: 0.4
        });
        object = new THREE.Mesh(geometry, material);
        break;
        
      case "observer":
        // Transparent triangle (tetrahedron)
        geometry = new THREE.TetrahedronGeometry(1.2);
        material = new THREE.MeshPhongMaterial({ 
          color: secondaryColor,
          transparent: true,
          opacity: 0.4,
          wireframe: true,
          emissive: secondaryColor,
          emissiveIntensity: 0.4
        });
        object = new THREE.Mesh(geometry, material);
        break;
        
      case "reconstruction":
        // Flower of life fractal (represented by spheres arranged in pattern)
        const flowerGroup = new THREE.Group();
        const sphereGeom = new THREE.SphereGeometry(0.3, 16, 16);
        const sphereMat = new THREE.MeshPhongMaterial({ 
          color: 0x00E096,
          transparent: true,
          opacity: 0.6,
          emissive: 0x00E096,
          emissiveIntensity: 0.3
        });
        
        // Center sphere
        const centerSphere = new THREE.Mesh(sphereGeom, sphereMat);
        flowerGroup.add(centerSphere);
        
        // First ring of 6 spheres
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2;
          const sphere = new THREE.Mesh(sphereGeom, sphereMat);
          sphere.position.x = Math.cos(angle) * 0.6;
          sphere.position.z = Math.sin(angle) * 0.6;
          flowerGroup.add(sphere);
        }
        
        object = flowerGroup;
        break;
        
      default:
        // Default simple sphere
        geometry = new THREE.SphereGeometry(1, 32, 32);
        material = new THREE.MeshPhongMaterial({ 
          color: primaryColor,
          transparent: true,
          opacity: 0.7
        });
        object = new THREE.Mesh(geometry, material);
    }
    
    return object;
  };

  useEffect(() => {
    if (!mountRef.current) return;

    // Create Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#151A30');
    sceneRef.current = scene;

    // Create Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 4;
    cameraRef.current = camera;

    // Create Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Instead of OrbitControls, we'll implement a simpler auto-rotation
    controlsRef.current = {
      update: () => {
        // This empty update function will be called in the animation loop
      }
    };

    // Create tensor shape
    const tensorObject = createTensorShape(tensor.type);
    scene.add(tensorObject);
    objectRef.current = tensorObject;

    // Animation loop with enhanced movement
    const animate = () => {
      requestAnimationFrame(animate);
      
      const time = Date.now() * 0.001; // Current time in seconds
      
      if (objectRef.current) {
        // More dynamic rotation
        objectRef.current.rotation.x += 0.005;
        objectRef.current.rotation.y += 0.007;
        
        // Add gentle wave-like motion
        objectRef.current.position.y = Math.sin(time) * 0.1;
        
        // Optional: Add pulsing effect based on tensor type
        if (tensor.type === "identity" || tensor.type === "emotional_curvature") {
          const scale = 1 + Math.sin(time * 2) * 0.05;
          objectRef.current.scale.set(scale, scale, scale);
        }
        
        // Camera movement in a slow orbit
        camera.position.x = Math.sin(time * 0.3) * 4;
        camera.position.z = Math.cos(time * 0.3) * 4;
        camera.lookAt(0, 0, 0);
      }
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current || !camera || !renderer) return;
      
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      scene.remove(tensorObject);
      
      renderer.dispose();
      // Skip material and geometry disposal as they are local to createTensorShape
    };
  }, [tensor.type]);

  return (
    <div 
      ref={mountRef} 
      className="tensor-visualization w-full h-32 flex items-center justify-center"
    />
  );
}
