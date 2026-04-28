import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1.5} />;
}

export default function Product3DViewer({ modelUrl }: { modelUrl: string }) {
  return (
    <div className="h-64 w-full">
      <Canvas camera={{ position: [0, 0, 3] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 5, 2]} intensity={1} />
        <Model url={modelUrl} />
        <OrbitControls enablePan={false} />
        <Environment preset="warehouse" />
      </Canvas>
    </div>
  );
}