import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { VESSELS, type Vessel } from '../data/vessels';
import VesselMesh from './VesselMesh';
import BodyModel from './BodyModel';

interface CameraRigProps {
  target: Vessel;
}

function CameraRig({ target }: CameraRigProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();
  const focusPoint = useMemo(() => {
    const mid = target.path[Math.floor(target.path.length / 2)];
    return new THREE.Vector3(...mid);
  }, [target]);

  const desiredCamera = useMemo(() => {
    const dir = new THREE.Vector3(focusPoint.x * 0.4, 0, 1).normalize();
    return focusPoint.clone().add(dir.multiplyScalar(11)).add(new THREE.Vector3(0, 1.2, 0));
  }, [focusPoint]);

  useFrame(() => {
    if (!controlsRef.current) return;
    controlsRef.current.target.lerp(focusPoint, 0.06);
    camera.position.lerp(desiredCamera, 0.02);
    controlsRef.current.update();
  });

  return <OrbitControls ref={controlsRef} enablePan={false} minDistance={4} maxDistance={26} makeDefault />;
}

interface SceneProps {
  currentVessel: Vessel;
  onSelect: (vessel: Vessel) => void;
}

export default function Scene({ currentVessel, onSelect }: SceneProps) {
  return (
    <Canvas camera={{ position: [0, 2, 16], fov: 45 }} dpr={[1, 2]}>
      <color attach="background" args={['#0a0f18']} />
      <fog attach="fog" args={['#0a0f18', 14, 28]} />
      <ambientLight intensity={0.4} />
      {/* Key light: warm, upper-front */}
      <directionalLight position={[5, 9, 7]} intensity={1.15} color="#fff4e6" />
      {/* Fill light: cool, opposite side, softer */}
      <directionalLight position={[-6, 2, 4]} intensity={0.4} color="#cfe3ff" />
      {/* Rim/back light: accents the silhouette edge from behind */}
      <directionalLight position={[-2, 4, -9]} intensity={0.6} color="#8fd8ff" />
      <Suspense fallback={null}>
        <BodyModel />
        {VESSELS.map((v) => (
          <VesselMesh
            key={v.id}
            vessel={v}
            isActive={v.id === currentVessel.id}
            dimmed={v.id !== currentVessel.id}
            onSelect={onSelect}
          />
        ))}
        <ContactShadows position={[0, -9.95, 0]} opacity={0.45} scale={9} blur={2.4} far={3} color="#000000" frames={1} />
      </Suspense>
      <CameraRig target={currentVessel} />
    </Canvas>
  );
}
