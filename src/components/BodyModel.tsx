import { useMemo } from 'react';
import * as THREE from 'three';

const SKIN_COLOR = '#f2d9c4';

function Segment({ from, to, radius }: { from: [number, number, number]; to: [number, number, number]; radius: number }) {
  const { position, quaternion, length } = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const dir = new THREE.Vector3().subVectors(b, a);
    const len = dir.length();
    const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
    const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    return { position: mid, quaternion: quat, length: len };
  }, [from, to]);

  return (
    <mesh position={position} quaternion={quaternion}>
      <capsuleGeometry args={[radius, Math.max(length - radius, 0.05), 6, 12]} />
      <meshStandardMaterial color={SKIN_COLOR} transparent opacity={0.16} roughness={0.6} depthWrite={false} />
    </mesh>
  );
}

export default function BodyModel() {
  return (
    <group renderOrder={-1}>
      {/* Head & neck */}
      <mesh position={[0, 7.85, 0]}>
        <sphereGeometry args={[0.85, 24, 24]} />
        <meshStandardMaterial color={SKIN_COLOR} transparent opacity={0.16} roughness={0.6} depthWrite={false} />
      </mesh>
      <Segment from={[0, 7.1, 0]} to={[0, 5.7, 0]} radius={0.42} />

      {/* Torso & pelvis */}
      <Segment from={[0, 5.5, 0]} to={[0, 0.8, 0]} radius={1.55} />
      <Segment from={[0, 0.6, 0]} to={[0, -3.3, 0]} radius={1.35} />

      {/* Arms: shoulder -> elbow -> wrist -> hand */}
      <Segment from={[0.9, 5.55, 0]} to={[2.6, 5.35, -0.05]} radius={0.45} />
      <Segment from={[-0.9, 5.55, 0]} to={[-2.6, 5.35, -0.05]} radius={0.45} />
      <Segment from={[2.6, 5.35, -0.05]} to={[3.35, 2.6, 0.3]} radius={0.38} />
      <Segment from={[-2.6, 5.35, -0.05]} to={[-3.35, 2.6, 0.3]} radius={0.38} />
      <Segment from={[3.35, 2.6, 0.3]} to={[3.65, -0.4, 0.55]} radius={0.28} />
      <Segment from={[-3.35, 2.6, 0.3]} to={[-3.65, -0.4, 0.55]} radius={0.28} />
      <mesh position={[3.78, -1.3, 0.65]}>
        <sphereGeometry args={[0.32, 16, 16]} />
        <meshStandardMaterial color={SKIN_COLOR} transparent opacity={0.16} roughness={0.6} depthWrite={false} />
      </mesh>
      <mesh position={[-3.78, -1.3, 0.65]}>
        <sphereGeometry args={[0.32, 16, 16]} />
        <meshStandardMaterial color={SKIN_COLOR} transparent opacity={0.16} roughness={0.6} depthWrite={false} />
      </mesh>

      {/* Legs: hip -> knee -> ankle -> foot */}
      <Segment from={[0.7, -3.4, 0]} to={[1.2, -7.0, 0.1]} radius={0.58} />
      <Segment from={[-0.7, -3.4, 0]} to={[-1.2, -7.0, 0.1]} radius={0.58} />
      <Segment from={[1.2, -7.0, 0.1]} to={[1.15, -9.6, -0.1]} radius={0.42} />
      <Segment from={[-1.2, -7.0, 0.1]} to={[-1.15, -9.6, -0.1]} radius={0.42} />
      <mesh position={[1.15, -9.85, 0.4]}>
        <boxGeometry args={[0.5, 0.3, 1.0]} />
        <meshStandardMaterial color={SKIN_COLOR} transparent opacity={0.16} roughness={0.6} depthWrite={false} />
      </mesh>
      <mesh position={[-1.15, -9.85, 0.4]}>
        <boxGeometry args={[0.5, 0.3, 1.0]} />
        <meshStandardMaterial color={SKIN_COLOR} transparent opacity={0.16} roughness={0.6} depthWrite={false} />
      </mesh>
    </group>
  );
}
