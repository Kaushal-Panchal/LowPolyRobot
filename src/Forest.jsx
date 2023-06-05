import { Center, Detailed, useGLTF, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import React, { createRef, useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from './store/store';

function map_range(value, low1, high1, low2, high2) {
    return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);
}

export const Forest = ({ ...props }) => {
    const [positions, setPositions] = useState([]);
    const [rockPositions, setRockPositions] = useState([]);
    const [bigLongRocksPositions, setBigLongRocksPositions] = useState([]);
    const [wideRocksPositions, setWideRocksPosition] = useState([]);

    useEffect(() => {
        // Create 30 objects with random position and rotation data
        const positions = [...Array(10)].map(() => {
            const randomPositionAmplitude = map_range(Math.random(), 0, 1, 3, 10);

            const randomPositionDirection = Math.sign(map_range(Math.random(), 0, 1, -1, 1));

            const xPosition = randomPositionAmplitude * randomPositionDirection;
            const randomScale = Math.random() * 2;
            return {
                position: [xPosition, 0, Math.random() * 50],
                // rotation: [Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2],
                rotation: [0, Math.random() * Math.PI, 0],
                scale: [randomScale, randomScale, randomScale],
            };
        });
        const rockPositions = [...Array(20)].map(() => {
            const randomPositionAmplitude = map_range(Math.random(), 0, 1, 5, 10);

            const randomPositionDirection = Math.sign(map_range(Math.random(), 0, 1, -1, 1));

            const xPosition = randomPositionAmplitude * randomPositionDirection;
            const randomScale = Math.random() * 5;
            return {
                position: [xPosition, 0, Math.random() * 50],
                // rotation: [Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2],
                rotation: [0, Math.random() * Math.PI, 0],
                scale: [randomScale, randomScale, randomScale],
            };
        });
        const longRocks = [...Array(50)].map(() => {
            const randomPositionAmplitude = map_range(Math.random(), 0, 1, 8, 30);

            const randomPositionDirection = Math.sign(map_range(Math.random(), 0, 1, -1, 1));

            const xPosition = randomPositionAmplitude * randomPositionDirection;
            const randomScale = Math.random() * 1;
            return {
                position: [xPosition, 0, Math.random() * 50],
                // rotation: [Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2],
                rotation: [0, Math.random() * Math.PI, 0],
                scale: [randomScale, randomScale, randomScale],
            };
        });
        const wideRocks = [...Array(10)].map(() => {
            const randomPositionAmplitude = map_range(Math.random(), 0, 1, 10, 30);

            const randomPositionDirection = -1 || Math.sign(map_range(Math.random(), 0, 1, -1, 1));

            const xPosition = randomPositionAmplitude * randomPositionDirection;
            const randomScale = Math.random() * 2;
            return {
                position: [xPosition, 0, Math.random() * 50],
                // rotation: [Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2],
                rotation: [0, Math.random() * Math.PI, 0],
                scale: [randomScale, randomScale, randomScale],
            };
        });
        setRockPositions(rockPositions);
        setBigLongRocksPositions(longRocks);
        setWideRocksPosition(wideRocks);
        setPositions(positions);
    }, []);

    return (
        <group {...props}>
            <RoadSetup />
            {positions.map((props, i) => (
                <Cactus key={i} {...props} />
            ))}
            {bigLongRocksPositions.map((props, i) => (
                <LongRock key={i} {...props} />
            ))}
            {rockPositions.map((props, i) => (
                <Rock key={i} {...props} />
            ))}
            {wideRocksPositions.map((props, i) => (
                <WideRock key={i} {...props} />
            ))}
        </group>
    );
};

function RoadSetup({ ...props }) {
    const ref = useRef(null);

    // This will load 4 GLTF in parallel using React Suspense
    const { nodes, materials, animations, scene } = useGLTF('/Road.glb');
    const copiedScene = useMemo(() => scene.clone(), [scene]);
    const { acceleration, setAcceleration, currentAction, setCurrentAction } = useStore();

    // Move each tree towards starting when reaches the end line
    useFrame((state, delta) => {
        if (!isNaN(ref?.current?.position?.z)) {
            ref.current.position.z = ref.current.position.z - acceleration * delta;
            if (ref?.current.position.z <= -20) {
                ref.current.position.z = 0;
            }
        }
    });

    // By the time we're here these GLTFs exist, they're loaded
    // There are 800 instances of this component, but the GLTF data is cached and will be re-used ootb
    return (
        <group ref={ref} {...props}>
            <Road rotation={[0, Math.PI / 2, 0]} scale={[0.1, 0.1, 0.1]} position={[0, -0.8, -20]} />
            <Road rotation={[0, Math.PI / 2, 0]} scale={[0.1, 0.1, 0.1]} position={[0, -0.8, 0]} />
            <Road rotation={[0, Math.PI / 2, 0]} scale={[0.1, 0.1, 0.1]} position={[0, -0.8, 20]} />
            <Road rotation={[0, Math.PI / 2, 0]} scale={[0.1, 0.1, 0.1]} position={[0, -0.8, 40]} />
            <Road rotation={[0, Math.PI / 2, 0]} scale={[0.1, 0.1, 0.1]} position={[0, -0.8, 60]} />
        </group>
    );
}

function Plane({ ...props }) {
    const ref = useRef(null);
    const texture = useTexture('./groundTexture.jpg');
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(2, 2);

    const { acceleration, setAcceleration, currentAction, setCurrentAction } = useStore();
    useFrame((state, delta) => {
        if (!isNaN(ref?.current?.position?.z)) {
            ref.current.position.z = ref.current.position.z - acceleration * delta;
            if (ref?.current.position.z <= -20) {
                ref.current.position.z = 0;
            }
        }
    });

    // By the time we're here these GLTFs exist, they're loaded
    // There are 800 instances of this component, but the GLTF data is cached and will be re-used ootb
    return (
        <mesh ref={ref} position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[5, 5, 5]}>
            <planeGeometry args={[30, 30, 5, 5]} />

            <meshStandardMaterial map={texture} />
        </mesh>
    );
}

function Road({ ...props }) {
    const ref = useRef(null);

    // This will load 4 GLTF in parallel using React Suspense
    const { nodes, materials, animations, scene } = useGLTF('/Road.glb');
    const copiedScene = useMemo(() => scene.clone(), [scene]);
    const { acceleration, setAcceleration, currentAction, setCurrentAction } = useStore();

    // By the time we're here these GLTFs exist, they're loaded
    // There are 800 instances of this component, but the GLTF data is cached and will be re-used ootb
    return (
        <Detailed ref={ref} distances={[300]} {...props}>
            {/* All we need to do is dump them into the Detailed component and define some distances
          Since we use a JSX mesh to represent each bust the geometry is being re-used w/o cloning */}

            <primitive object={copiedScene} />

            {/* <group /> */}
        </Detailed>
    );
}

function Rock({ ...props }) {
    const ref = useRef(null);

    // This will load 4 GLTF in parallel using React Suspense
    const { nodes, materials, animations, scene } = useGLTF('/Rock.glb');
    const copiedScene = useMemo(() => scene.clone(), [scene]);
    const { acceleration, setAcceleration, currentAction, setCurrentAction } = useStore();

    // Move each tree towards starting when reaches the end line
    useFrame((state, delta) => {
        //

        if (ref?.current?.position?.z) {
            // console.log('Inside useFrame ', currentAction);
            ref.current.position.z = ref.current.position.z - acceleration * delta;
            if (ref?.current.position.z <= -30) {
                // ref.current.position.z = map_range(Math.random(), 0, 1, 10, 50);
                ref.current.position.z = 50;
            }
        }
    });

    // By the time we're here these GLTFs exist, they're loaded
    // There are 800 instances of this component, but the GLTF data is cached and will be re-used ootb
    return (
        <Detailed ref={ref} distances={[300]} {...props}>
            {/* All we need to do is dump them into the Detailed component and define some distances
          Since we use a JSX mesh to represent each bust the geometry is being re-used w/o cloning */}

            <primitive object={copiedScene} />

            {/* <group /> */}
        </Detailed>
    );
}

function WideRock({ ...props }) {
    const ref = useRef(null);

    // This will load 4 GLTF in parallel using React Suspense
    const { nodes, materials, animations, scene } = useGLTF('/Rock2.glb');
    const copiedScene = useMemo(() => scene.clone(), [scene]);
    const { acceleration, setAcceleration, currentAction, setCurrentAction } = useStore();

    // Move each tree towards starting when reaches the end line
    useFrame((state, delta) => {
        //

        if (ref?.current?.position?.z) {
            // console.log('Inside useFrame ', currentAction);
            ref.current.position.z = ref.current.position.z - acceleration * delta;
            if (ref?.current.position.z <= -30) {
                // ref.current.position.z = map_range(Math.random(), 0, 1, 10, 50);
                ref.current.position.z = 30;
            }
        }
    });

    // By the time we're here these GLTFs exist, they're loaded
    // There are 800 instances of this component, but the GLTF data is cached and will be re-used ootb
    return (
        <Detailed ref={ref} distances={[300]} {...props}>
            {/* All we need to do is dump them into the Detailed component and define some distances
          Since we use a JSX mesh to represent each bust the geometry is being re-used w/o cloning */}

            <primitive object={copiedScene} />

            {/* <group /> */}
        </Detailed>
    );
}

function LongRock({ ...props }) {
    const ref = useRef(null);

    // This will load 4 GLTF in parallel using React Suspense
    const { nodes, materials, animations, scene } = useGLTF('/Rock1.glb');
    const copiedScene = useMemo(() => scene.clone(), [scene]);
    const { acceleration, setAcceleration, currentAction, setCurrentAction } = useStore();

    // Move each tree towards starting when reaches the end line
    useFrame((state, delta) => {
        //

        if (ref?.current?.position?.z) {
            // console.log('Inside useFrame ', currentAction);
            ref.current.position.z = ref.current.position.z - acceleration * delta;
            if (ref?.current.position.z <= -30) {
                // ref.current.position.z = map_range(Math.random(), 0, 1, 10, 50);
                ref.current.position.z = 30;
            }
        }
    });

    // By the time we're here these GLTFs exist, they're loaded
    // There are 800 instances of this component, but the GLTF data is cached and will be re-used ootb
    return (
        <Detailed ref={ref} distances={[300]} {...props}>
            {/* All we need to do is dump them into the Detailed component and define some distances
          Since we use a JSX mesh to represent each bust the geometry is being re-used w/o cloning */}

            <primitive object={copiedScene} />

            {/* <group /> */}
        </Detailed>
    );
}
function Cactus({ ...props }) {
    const ref = useRef(null);

    // This will load 4 GLTF in parallel using React Suspense
    const { nodes, materials, animations, scene } = useGLTF('/Cactus.glb');
    const copiedScene = useMemo(() => scene.clone(), [scene]);
    const { acceleration, setAcceleration, currentAction, setCurrentAction } = useStore();

    // Move each tree towards starting when reaches the end line
    useFrame((state, delta) => {
        //

        if (ref?.current?.position?.z) {
            // console.log('Inside useFrame ', currentAction);
            ref.current.position.z = ref.current.position.z - acceleration * delta;
            if (ref?.current.position.z <= -30) {
                // ref.current.position.z = map_range(Math.random(), 0, 1, 10, 50);
                ref.current.position.z = 25;
            }
        }
    });

    // By the time we're here these GLTFs exist, they're loaded
    // There are 800 instances of this component, but the GLTF data is cached and will be re-used ootb
    return (
        <Detailed ref={ref} distances={[300]} {...props}>
            {/* All we need to do is dump them into the Detailed component and define some distances
          Since we use a JSX mesh to represent each bust the geometry is being re-used w/o cloning */}

            <primitive object={copiedScene} />

            {/* <group /> */}
        </Detailed>
    );
}
