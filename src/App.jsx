import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { Canvas } from '@react-three/fiber';
import {
    AccumulativeShadows,
    ScrollControls,
    Center,
    Environment,
    Grid,
    OrbitControls,
    RandomizedLight,
} from '@react-three/drei';
import Robot from './Robot';
import { RobotExpressive } from './RobotExpressive';
import { useControls } from 'leva';

function App() {
    return (
        <div id="canvas">
            <Canvas shadows camera={{ position: [8, 3.5, 8], fov: 35 }}>
                <ScrollControls damping={4} infinite={true}>
                    <Center top>
                        <RobotExpressive scale={[0.5, 0.5, 0.5]} position={[0, 0.5, 0]} />
                    </Center>
                    {/* <ambientLight intensity={0.001} /> */}
                    <directionalLight
                        position={[-5, 5, 5]}
                        castShadow
                        shadow-mapSize-width={1024}
                        shadow-mapSize-height={1024}
                        amount={8}
                        radius={4}
                        ambient={0.5}
                        intensity={0.5}
                        bias={0.001}
                        color={'goldenrod'}
                    />

                    <mesh castShadow position={[-2, 0.25, 0]}>
                        <boxGeometry args={[0.5, 0.5, 0.5]} />
                        <meshStandardMaterial />
                    </mesh>
                    {/* <AccumulativeShadows
                    temporal
                    frames={100}
                    color="goldenrod"
                    colorBlend={2}
                    toneMapped={true}
                    alphaTest={0.9}
                    opacity={2}
                    scale={12}
                >
                    <RandomizedLight
                        amount={8}
                        radius={4}
                        ambient={0.5}
                        intensity={1}
                        position={[5, 5, -10]}
                        bias={0.001}
                    />
                </AccumulativeShadows> */}

                    <mesh rotation={[-0.5 * Math.PI, 0, 0]} position={[0, 0, 0]} receiveShadow>
                        <planeBufferGeometry args={[10, 10, 1, 1]} />
                        <shadowMaterial transparent opacity={0.2} />
                    </mesh>
                    {/* <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI / 2} enableZoom={false} /> */}
                    <Environment preset="city" />
                    {/* <Grid position={[0, -0.01, 0]} args={[10, 10, 10]} /> */}
                </ScrollControls>
            </Canvas>
        </div>
    );
}

export default App;
