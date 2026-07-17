import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
// The mesh is imported as raw text and parsed in-process (rather than fetched
// at runtime) so the app has no external asset dependency — this lets it be
// bundled into a single self-contained HTML file that runs from file://.
import objText from '../assets/FinalBaseMesh.obj?raw';

const SKIN_COLOR = new THREE.Color('#e8c9ae');
const RIM_COLOR = new THREE.Color('#bfe4ff');

// The source mesh (FinalBaseMesh.obj) stands roughly 20.74 units tall in its
// own local space, feet near y=0. We uniformly scale + shift it so its total
// height and floor line up with this app's existing vessel coordinate
// system (head top ~8.67, floor ~-9.91), which was tuned independently.
const MESH_HEIGHT = 20.7407;
const MESH_MIN_Y = -0.0566;
const APP_HEAD_TOP = 8.67;
const APP_FLOOR = -9.91;
const SCALE = (APP_HEAD_TOP - APP_FLOOR) / MESH_HEIGHT;
const TRANSLATE_Y = APP_FLOOR - MESH_MIN_Y * SCALE;

function buildMergedGeometry(source: THREE.Group): THREE.BufferGeometry {
  const geometries: THREE.BufferGeometry[] = [];
  source.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const geo = child.geometry.clone();
      geo.applyMatrix4(child.matrixWorld);
      geometries.push(geo);
    }
  });
  const merged = mergeGeometries(geometries, false);
  merged.scale(SCALE, SCALE, SCALE);
  merged.translate(0, TRANSLATE_Y, 0);
  merged.computeVertexNormals();
  return merged;
}

export default function BodyModel() {
  const geometry = useMemo(() => {
    const obj = new OBJLoader().parse(objText);
    obj.updateMatrixWorld(true);
    return buildMergedGeometry(obj);
  }, []);
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
