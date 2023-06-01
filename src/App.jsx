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
import { Box } from './Box';
import { Forest } from './Forest';

function App() {
    const [controls, set] = useControls(() => ({
        'Time Scale': {
            value: 1,
            min: 0.0,
            max: 5,
            step: 0.1,
        },
        Duration: {
            value: 3.0,
            min: 0.0,
            max: 10.0,
            step: 0.01,
        },
        'Scroll Amplitude': {
            min: 1.0,
            value: 1.0,
            max: 10.0,
        },
        'Walking Threshold': {
            value: 2,
            min: 2,
            max: 10,
        },
        'Damping Scroll': {
            value: 10,
        },
    }));
    return (
        <div id="canvas">
            <Canvas shadows camera={{ position: [20, 20, 16], fov: 35, zoom: 1.3 }}>
                <ScrollControls damping={controls['Damping Scroll']} infinite={true}>
                    <Center top>
                        <RobotExpressive scale={[0.5, 0.5, 0.5]} position={[0, 0.5, 0]} controls={controls} />
                    </Center>
                    <Forest position={[0, 0, -10]} />
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
                    {/* <Box controls={controls} /> */}

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
                    <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI / 2} enableZoom={false} />
                    <Environment preset="city" />
                    {/* <Grid position={[0, -0.01, 0]} args={[10, 10, 10]} /> */}
                </ScrollControls>
            </Canvas>
        </div>
    );
}

export default App;
