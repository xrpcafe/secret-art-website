import React, { Suspense } from "react";
import { Canvas } from "react-three-fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

export default function GLBObject() {
    function Model(props) {
        const { scene } = useGLTF("./images/28.gltf");
        return <primitive object={scene} />;
      }

    return (
      <Canvas style={{height:'400px',width:'320px', alignItems:'center', textAlign:'center'}} pixelRatio={[1, 1]} camera={{ position: [-85, 0, 0], fov: 50 }}>
        <ambientLight intensity={1} />
        <Suspense fallback={null}>
          <Model />
        </Suspense>
        <OrbitControls />
      </Canvas>
    );
  }