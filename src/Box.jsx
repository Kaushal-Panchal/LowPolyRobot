import { useControls } from 'leva';
import React from 'react';

export const Box = ({ controls, ...props }) => {
    return (
        <mesh {...props} castShadow position={[-2, 0.25, 0]}>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial />
        </mesh>
    );
};
