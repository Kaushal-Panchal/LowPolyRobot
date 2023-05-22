/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.1.11 RobotExpressive.glb --shadows
*/

import React, { useRef, useLayoutEffect, useEffect, useState } from 'react';
import { useGLTF, useAnimations, useScroll } from '@react-three/drei';

import { act, applyProps, useFrame } from '@react-three/fiber';
import { shallow } from 'zustand/shallow';

import * as THREE from 'three';
import { FlakesTexture } from 'three/examples/jsm/textures/FlakesTexture';
import { button, useControls } from 'leva';
import { useStore } from './store/store';

export function RobotExpressive(props) {
    const group = useRef();
    const { nodes, materials, animations, scene } = useGLTF('/RobotExpressive.glb');
    const { actions, names, mixer } = useAnimations(animations, group);

    // const acceleration = useStore((state) => state.acceleration);
    // const setAcceleration = useStore((state) => state.setAcceleration);
    // const currentAction = useStore((state) => state.currentAction);
    const { acceleration, setAcceleration, currentAction, setCurrentAction } = useStore();

    const scrollRef = useRef(0);
    const previousScrollRef = useRef(0);
    const data = useScroll();

    useFrame(() => {
        const scrollDelta = data.scroll.current - previousScrollRef.current;
        previousScrollRef.current = data.scroll.current;
        console.log('Scroll Delta', scrollDelta);
        if (scrollDelta > 0) {
            setAcceleration(acceleration + scrollDelta);
        } else if (acceleration > 0) {
            // let target = acceleration - 0.05;
            // if (acceleration < 3) {
            //     target = acceleration - (acceleration * acceleration) / 50;
            // }

            let target = acceleration - (acceleration * acceleration) / 50;

            // console.log('Target ', target);
            setAcceleration(target);
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
        // activateAllActions();
    }, [scene]);

    const playAnimation = (v) => {
        console.log(v);
        actions[v].reset().fadeIn(0.5).play();
    };

    const stopAllActions = () => {
        mixer.stopAllAction();
    };

    const handleCrossFadeClick = (get) => {
        prepareCrossFade(get('StartAction'), get('EndAction'), get('Duration'));
        //prepareCrossFade('Idle', 'Walking');
    };

    const [makeSingleStep, setMakeSingleStep] = useState(false);

    const takeSingleStep = () => {
        setMakeSingleStep(true);
    };

    const prepareCrossFade = (startActionName, endActionName, duration) => {
        // Walking & Running
        const startAction = actions[startActionName];
        const endAction = actions[endActionName];
        const idleAction = actions['Idle'];

        console.log('Start Action', startActionName);
        console.log('End Action', endActionName);
        // If the current action is 'idle', execute the crossfade immediately;
        // else wait until the current action has finished its current loop

        // if (startAction === idleAction) {
        //     executeCrossFade(startAction, endAction, duration);
        // } else {
        //     synchronizeCrossFade(startAction, endAction, duration);
        // }
        synchronizeCrossFade(startAction, endAction, duration);
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
        console.log('Execute Cross Fade');
        // startAction.stop();

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

    const [controls, set] = useControls(() => ({
        action: {
            options: names,
            onChange: (v) => {
                playAnimation(v);
            },
            value: 'Idle',
        },
        stop: button(stopAllActions),
        timeScale: {
            value: 0.6,
            min: 0.0,
            max: 1.5,
            step: 0.01,
            onChange: (v) => {
                mixer.timeScale = v;
            },
        },
        StartAction: {
            options: names,
        },
        EndAction: {
            options: names,
        },
        Duration: {
            value: 3.0,
            min: 0.0,
            max: 10.0,
            step: 0.01,
        },

        'Cross Fade': button(handleCrossFadeClick, {}),
        'Single Step Mode': {
            value: false,
        },

        'Size Of Step': {
            value: 1.0,
            min: 0.0,
            max: 10.0,
            step: 0.01,
        },
        'Single Step': button(takeSingleStep, {}),
    }));
    useFrame((state, delta) => {
        if (controls['Single Step Mode']) {
            if (makeSingleStep) {
                console.log('Here');
                mixer.update(controls['Size Of Step']);
                setMakeSingleStep(false);
            } else {
                console.log('Here in 0');
                mixer.update(0);
            }
        } else {
            mixer.update(delta);
        }
    });

    useEffect(() => {
        console.log('Controls updated', controls);
    }, [controls]);

    const handleAnimationChange = async (acceleration) => {
        // console.log('Accleration ', Math.round(acceleration));
        const roundedAccleration = Math.round(acceleration);
        if (roundedAccleration === 0) {
            // Run Idle Action
            if (currentAction !== 'Idle') {
                prepareCrossFade(currentAction, 'Idle', controls['Duration']);
                setCurrentAction('Idle');
            }
        } else if (roundedAccleration <= 2 && roundedAccleration > 0) {
            // Run Walking Action
            if (currentAction !== 'Walking') {
                prepareCrossFade(currentAction, 'Walking', controls['Duration']);
                setCurrentAction('Walking');
            }
        } else if (roundedAccleration > 4) {
            // Run Running Action
            if (currentAction !== 'Running') {
                prepareCrossFade(currentAction, 'Running', controls['Duration']);
                setCurrentAction('Running');
            }
        }
    };

    useEffect(() => {
        if (acceleration) {
            handleAnimationChange(acceleration);
        }
        // console.log('Accleration ', acceleration, ' Round = ', Math.round(acceleration));
    }, [acceleration]);

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
