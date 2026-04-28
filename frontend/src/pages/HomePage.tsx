import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';

function AppleLogo() {
  return (
    <mesh position={[0, 0, 0]}>
      <torusKnotGeometry args={[1, 0.3, 128, 16]} />
      <meshStandardMaterial color="#0071e3" metalness={0.8} roughness={0.2} />
    </mesh>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      <div className="h-screen relative">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <AppleLogo />
          <OrbitControls enableZoom={false} autoRotate />
          <Environment preset="city" />
        </Canvas>
        <div className="absolute bottom-20 left-0 right-0 text-center">
          <h1 className="text-6xl font-bold text-gray-900">Welcome to Apple Store</h1>
          <p className="text-xl text-gray-600 mt-4">Experience the future of shopping in 3D</p>
          <button className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700">
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
}