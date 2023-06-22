/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.1.11 RobotExpressive.glb --shadows
*/

import React, { useRef, useLayoutEffect, useEffect, useState } from 'react';
import { useGLTF, useAnimations, useScroll, useTexture } from '@react-three/drei';

import { act, applyProps, useFrame, useThree } from '@react-three/fiber';
import { shallow } from 'zustand/shallow';

import * as THREE from 'three';
import { FlakesTexture } from 'three/examples/jsm/textures/FlakesTexture';
import { button, useControls } from 'leva';
import { useStore } from './store/store';

export function RobotExpressive({ controls, ...props }) {
    const group = useRef();
    const { nodes, materials, animations, scene } = useGLTF('/RobotExpressive.glb');
    const { actions, names, mixer } = useAnimations(animations, group);
    const { acceleration, setAcceleration, currentAction, setCurrentAction } = useStore();
    const { camera, controls: orbitControls, clock } = useThree();

    const data = useScroll();

    const previousScrollRef = useRef(0);
    const frameCount = useRef(0);
    const totalScrolls = useRef(0);
    const sumDelta = useRef(0);
    const targetAccleration = useRef(0);
    let scrollDelta = 0;
    useFrame((state, delta) => {
        if (frameCount.current === 20) {
            scrollDelta = data.scroll.current - previousScrollRef.current;
            previousScrollRef.current = data.scroll.current;
            frameCount.current = 0;
        } else {
            frameCount.current++;
        }
        sumDelta.current = sumDelta.current + delta;

        if (scrollDelta > 0.02) {
            totalScrolls.current++;
        }
        // Play animation based on totalScroll every 2 second and reset totalScroll to 0

        if (sumDelta.current > 2) {
            // Play Animation
            handleAnimationChangeScrollCount(totalScrolls.current);
            totalScrolls.current = 0;
            sumDelta.current = 0;
        }

        if (targetAccleration.current !== acceleration) {
            const lerpValue = THREE.MathUtils.lerp(acceleration, targetAccleration.current, 0.01);
            setAcceleration(lerpValue);
        }
    });

    useLayoutEffect(() => {
        Object.keys(nodes).map((key) => nodes[key].isMesh && (nodes[key].receiveShadow = nodes[key].castShadow = true));
        applyProps(materials.Main, {
            color: 'orange',
            roughness: 0,
            metalness: 0.5,
            normalMap: new THREE.CanvasTexture(
                new FlakesTexture(),
                THREE.UVMapping,
                THREE.RepeatWrapping,
                THREE.RepeatWrapping
            ),
            'normalMap-repeat': [40, 40],
            normalScale: [0.05, 0.05],
        });
        actions['Idle'].play();
    }, [scene]);

    const prepareCrossFade = (startActionName, endActionName, duration) => {
        // Walking & Running
        const startAction = actions[startActionName];
        const endAction = actions[endActionName];
        const idleAction = actions['Idle'];

        console.log('Start Action', startActionName);
        console.log('End Action', endActionName);
        // If the current action is 'idle', execute the crossfade immediately;
        // else wait until the current action has finished its current loop

        if (startAction === idleAction) {
            executeCrossFade(startAction, endAction, duration);
        } else {
            synchronizeCrossFade(startAction, endAction, duration);
        }
        // synchronizeCrossFade(startAction, endAction, duration);
    };

    const synchronizeCrossFade = (startAction, endAction, duration) => {
        console.log('Synchronize Cross Fade');
        mixer.addEventListener('loop', onLoopFinished);

        function onLoopFinished(event) {
            // console.log('Inside loop', event.action, startAction);
            if (event.action === startAction) {
                mixer.removeEventListener('loop', onLoopFinished);

                executeCrossFade(startAction, endAction, duration);
            }
        }
    };

    const executeCrossFade = (startAction, endAction, duration) => {
        endAction.play();
        setWeight(endAction, 1);
        endAction.time = 0;
        startAction.crossFadeTo(endAction, duration);
    };
    const setWeight = (action, weight) => {
        // action.play();
        action.enabled = true;
        action.setEffectiveTimeScale(1);
        action.setEffectiveWeight(weight);
    };

    const handleAnimationChangeScrollCount = async (scrollCount) => {
        if (scrollCount === 0) {
            // Run Idle Action
            if (currentAction !== 'Idle') {
                prepareCrossFade(currentAction, 'Idle', controls['Duration']);
                setCurrentAction('Idle');
                targetAccleration.current = 0;
            }
        } else if (scrollCount <= controls['Walking Threshold'] && scrollCount > 0) {
            // Run Walking Action
            if (currentAction !== 'Walking') {
                prepareCrossFade(currentAction, 'Walking', controls['Duration']);
                setCurrentAction('Walking');
                targetAccleration.current = 3;
            }
        } else if (scrollCount > controls['Walking Threshold']) {
            // Run Running Action
            if (currentAction !== 'Running') {
                prepareCrossFade(currentAction, 'Running', controls['Duration']);
                setCurrentAction('Running');
                targetAccleration.current = 5;
            }
        }
    };

    useEffect(() => {
        mixer.timeScale = controls['Time Scale'];
    }, [controls['Time Scale']]);

    return (
        <group ref={group} {...props} dispose={null}>
            <group name="Root_Scene">
                <group name="RootNode">
                    <group name="RobotArmature" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
                        <primitive object={nodes.Bone} />
                    </group>
                    <group name="HandR" position={[0, 2.37, -0.02]} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
                        <skinnedMesh
                            name="HandR_1"
                            geometry={nodes.HandR_1.geometry}
                            material={materials.Main}
                            skeleton={nodes.HandR_1.skeleton}
                        />
                        <skinnedMesh
                            name="HandR_2"
                            geometry={nodes.HandR_2.geometry}
                            material={materials.Grey}
                            skeleton={nodes.HandR_2.skeleton}
                        />
                    </group>
                    <group name="HandL" position={[0, 2.37, -0.02]} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
                        <skinnedMesh
                            name="HandL_1"
                            geometry={nodes.HandL_1.geometry}
                            material={materials.Main}
                            skeleton={nodes.HandL_1.skeleton}
                        />
                        <skinnedMesh
                            name="HandL_2"
                            geometry={nodes.HandL_2.geometry}
                            material={materials.Grey}
                            skeleton={nodes.HandL_2.skeleton}
                        />
                    </group>
                </group>
            </group>
        </group>
    );
}

useGLTF.preload('/RobotExpressive.glb');
