import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const SKIN_COLOR = new THREE.Color('#e8c9ae');
const RIM_COLOR = new THREE.Color('#bfe4ff');

type V3 = [number, number, number];

function alignedTransform(from: V3, to: V3) {
  const a = new THREE.Vector3(...from);
  const b = new THREE.Vector3(...to);
  const dir = new THREE.Vector3().subVectors(b, a);
  const length = dir.length();
  const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
  const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
  return { mid, quat, length };
}

// A tapered limb segment (wider proximal end, narrower distal end) with
// flat caps — the caps get hidden by a joint sphere at each end, which also
// smooths the visual seam between consecutive segments.
function frustum(from: V3, to: V3, radiusFrom: number, radiusTo: number, radialSegments = 14): THREE.BufferGeometry {
  const { mid, quat, length } = alignedTransform(from, to);
  const geo = new THREE.CylinderGeometry(radiusTo, radiusFrom, Math.max(length, 0.05), radialSegments, 1, false);
  geo.applyQuaternion(quat);
  geo.translate(mid.x, mid.y, mid.z);
  return geo;
}

// A uniform-radius capsule segment (rounded caps) — used for torso pieces,
// the neck, hands and feet where a constant cross-section reads better.
function capsuleSeg(from: V3, to: V3, radius: number, radialSegments = 16): THREE.BufferGeometry {
  const { mid, quat, length } = alignedTransform(from, to);
  const geo = new THREE.CapsuleGeometry(radius, Math.max(length - radius * 0.6, 0.05), 8, radialSegments);
  geo.applyQuaternion(quat);
  geo.translate(mid.x, mid.y, mid.z);
  return geo;
}

function ball(center: V3, radius: number, segments = 16): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(radius, segments, segments);
  geo.translate(center[0], center[1], center[2]);
  return geo;
}

function mirror(p: V3): V3 {
  return [-p[0], p[1], p[2]];
}

function buildBodyGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];

  // Head & neck
  parts.push(ball([0, 7.85, 0], 0.82, 28));
  parts.push(capsuleSeg([0, 7.15, 0], [0, 6.85, 0.05], 0.34)); // upper neck (narrower, throat taper)
  parts.push(capsuleSeg([0, 6.9, 0.05], [0, 5.6, 0], 0.42)); // lower neck into trapezius

  // Torso: chest (wide) -> waist (narrow) -> pelvis (wide) for an hourglass
  // silhouette instead of one uniform cylinder.
  parts.push(ball([0.95, 5.55, 0], 0.44, 18)); // right shoulder deltoid
  parts.push(ball([-0.95, 5.55, 0], 0.44, 18)); // left shoulder deltoid
  parts.push(capsuleSeg([0, 5.45, 0.05], [0, 3.1, 0.15], 1.5)); // chest
  parts.push(capsuleSeg([0, 3.3, 0.15], [0, 1.2, 0.05], 1.08)); // waist
  parts.push(capsuleSeg([0, 1.35, 0.05], [0, -3.15, -0.05], 1.32)); // abdomen/pelvis

  // Arms: shoulder -> elbow -> wrist -> hand, tapered with joint spheres
  const shoulderR: V3 = [1.5, 5.5, -0.05];
  const elbowR: V3 = [2.85, 3.15, 0.15];
  const wristR: V3 = [3.55, 0.55, 0.5];
  const handEndR: V3 = [3.78, -1.15, 0.62];
  for (const side of [1, -1] as const) {
    const s = side === 1 ? shoulderR : mirror(shoulderR);
    const e = side === 1 ? elbowR : mirror(elbowR);
    const w = side === 1 ? wristR : mirror(wristR);
    const h = side === 1 ? handEndR : mirror(handEndR);
    parts.push(frustum(s, e, 0.42, 0.3));
    parts.push(ball(e, 0.28, 14));
    parts.push(frustum(e, w, 0.28, 0.19));
    parts.push(ball(w, 0.19, 14));
    parts.push(capsuleSeg(w, h, 0.18));
  }

  // Legs: hip -> knee -> ankle -> foot, tapered with joint spheres
  const hipR: V3 = [0.68, -3.25, 0];
  const kneeR: V3 = [1.15, -6.95, 0.15];
  const ankleR: V3 = [1.12, -9.55, -0.05];
  for (const side of [1, -1] as const) {
    const hp = side === 1 ? hipR : mirror(hipR);
    const kn = side === 1 ? kneeR : mirror(kneeR);
    const an = side === 1 ? ankleR : mirror(ankleR);
    parts.push(ball(hp, 0.6, 18));
    parts.push(frustum(hp, kn, 0.62, 0.42));
    parts.push(ball(kn, 0.4, 16));
    parts.push(frustum(kn, an, 0.4, 0.27));
    parts.push(ball(an, 0.26, 14));
    const heel: V3 = [an[0], an[1] - 0.12, an[2] - 0.35];
    const toe: V3 = [an[0], an[1] - 0.12, an[2] + 0.65];
    parts.push(capsuleSeg(heel, toe, 0.24));
  }

  const merged = mergeGeometries(parts, false);
  merged.computeVertexNormals();
  return merged;
}

export default function BodyModel() {
  const geometry = useMemo(() => buildBodyGeometry(), []);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  const material = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: SKIN_COLOR,
      transparent: true,
      opacity: 0.15,
      roughness: 0.55,
      metalness: 0.05,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.rimColor = { value: RIM_COLOR };
      shader.uniforms.rimPower = { value: 2.4 };
      shader.uniforms.rimIntensity = { value: 0.4 };
      shader.uniforms.rimAlphaBoost = { value: 0.55 };
      shader.fragmentShader =
        `uniform vec3 rimColor;\nuniform float rimPower;\nuniform float rimIntensity;\nuniform float rimAlphaBoost;\n` +
        shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <dithering_fragment>',
        `
        float rimFresnel = pow(1.0 - clamp(abs(dot(normalize(vNormal), normalize(vViewPosition))), 0.0, 1.0), rimPower);
        gl_FragColor.rgb += rimColor * rimFresnel * rimIntensity;
        gl_FragColor.a = clamp(gl_FragColor.a + rimFresnel * rimAlphaBoost, 0.0, 1.0);
        #include <dithering_fragment>
        `,
      );
    };
    return mat;
  }, []);

  useFrame((state) => {
    if (!materialRef.current) return;
    // A very slow breathing-like opacity drift keeps the "hologram" body from
    // reading as a static prop without being distracting.
    const breathe = 0.15 + Math.sin(state.clock.elapsedTime * 0.4) * 0.015;
    materialRef.current.opacity = breathe;
  });

  return (
    <mesh geometry={geometry} renderOrder={-1}>
      <primitive object={material} ref={materialRef} attach="material" />
    </mesh>
  );
}
