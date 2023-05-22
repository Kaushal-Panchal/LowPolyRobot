import { useGLTF } from '@react-three/drei';
import { applyProps } from '@react-three/fiber';
import React, { useLayoutEffect } from 'react';
import * as THREE from 'three';
import { FlakesTexture } from 'three/examples/jsm/textures/FlakesTexture';

const Robot = (props) => {
    const { scene, materials } = useGLTF('RobotExpressive.glb');
    console.log('Materails robot ', materials);

    useLayoutEffect(() => {
        scene.traverse((obj) => obj.isMesh && (obj.receiveShadow = obj.castShadow = true));
        applyProps(materials.Main, {
            color: 'orange',
            roughness: 0,
            normalMap: new THREE.CanvasTexture(
                new FlakesTexture(),
                THREE.UVMapping,
                THREE.RepeatWrapping,
                THREE.RepeatWrapping
            ),
            'normalMap-repeat': [40, 40],
            normalScale: [0.05, 0.05],
        });
    }, [scene]);
    return <primitive object={scene} {...props} />;
};

export default Robot;
