import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Vessel } from '../data/vessels';
import { colorForVessel } from '../data/vessels';

interface VesselMeshProps {
  vessel: Vessel;
  isActive: boolean;
  dimmed: boolean;
  onSelect: (vessel: Vessel) => void;
}

// Direction from the body midline outward, used to "pop" the active vessel
// away from the torso so it reads clearly against the translucent body.
function outwardOffset(mid: THREE.Vector3): THREE.Vector3 {
  const dir = new THREE.Vector3(mid.x, 0, mid.z + 0.6);
  if (dir.lengthSq() < 0.01) dir.set(0, 0, 1);
  return dir.normalize();
}

export default function VesselMesh({ vessel, isActive, dimmed, onSelect }: VesselMeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const scaleState = useRef(1);
  const pulsePhase = useRef(Math.random() * Math.PI * 2);

  // Build the tube geometry in a *local* frame centered on the vessel's own
  // centroid, and place that centroid at the matching world position via the
  // group's transform. This keeps scale/translate animations pivoting around
  // the vessel itself instead of the world origin (which would otherwise fling
  // vessels far from their anatomical position when scaled up).
  const { geometry, centroid } = useMemo(() => {
    const worldPoints = vessel.path.map((p) => new THREE.Vector3(...p));
    const centroid = worldPoints[Math.floor(worldPoints.length / 2)].clone();
    const localPoints = worldPoints.map((p) => p.clone().sub(centroid));
    const curve = new THREE.CatmullRomCurve3(localPoints, false, 'catmullrom', 0.2);
    const segments = Math.max(8, localPoints.length * 12);
    const geometry = new THREE.TubeGeometry(curve, segments, vessel.radius, 10, false);
    return { geometry, centroid };
  }, [vessel]);

  const baseColor = useMemo(() => new THREE.Color(colorForVessel(vessel)), [vessel]);
  const offset = useMemo(() => outwardOffset(centroid), [centroid]);

  useFrame((state) => {
    const targetScale = isActive ? 1.55 : 1;
    scaleState.current = THREE.MathUtils.lerp(scaleState.current, targetScale, 0.12);
    if (groupRef.current) {
      groupRef.current.scale.setScalar(scaleState.current);
      const t = isActive ? (scaleState.current - 1) / 0.55 : 0;
      const targetPosition = centroid.clone().add(offset.clone().multiplyScalar(t * 0.9));
      groupRef.current.position.lerp(targetPosition, 0.15);
    }
    if (materialRef.current) {
      const pulse = isActive ? 0.55 + Math.sin(state.clock.elapsedTime * 3 + pulsePhase.current) * 0.25 : 0;
      materialRef.current.emissiveIntensity = THREE.MathUtils.lerp(materialRef.current.emissiveIntensity, pulse, 0.15);
      const targetOpacity = dimmed ? 0.2 : 1;
      materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, targetOpacity, 0.12);
    }
  });

  return (
    <group ref={groupRef} position={centroid}>
      <mesh
        geometry={geometry}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(vessel);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        <meshStandardMaterial
          ref={materialRef}
          color={baseColor}
          emissive={baseColor}
          emissiveIntensity={0}
          roughness={0.35}
          metalness={0.1}
          transparent
          opacity={1}
        />
      </mesh>
    </group>
  );
}
