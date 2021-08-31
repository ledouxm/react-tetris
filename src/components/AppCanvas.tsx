import { Canvas } from "@react-three/fiber";

export const AppCanvas = () => {
    return (
        <Canvas>
            <SimpleCube />
        </Canvas>
    );
};

export const SimpleCube = () => {
    return (
        <mesh>
            <boxGeometry />
            <meshBasicMaterial color="pink" />
        </mesh>
    );
};
