'use client';

import { useRef, useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, useKeyboardControls, KeyboardControls } from '@react-three/drei';
import * as THREE from 'three';

interface PlayerProps {
  vehicleType: 'car' | 'bike';
  gameStarted: boolean;
}

const Player = forwardRef<THREE.Group, PlayerProps>(({ vehicleType, gameStarted }, ref) => {
  const groupRef = useRef<THREE.Group>(null!);
  const [velocity, setVelocity] = useState(new THREE.Vector3());
  const [speed, setSpeed] = useState(0);
  const [steering, setSteering] = useState(0);
  
  const { camera } = useThree();
  const keys = useRef<{ [key: string]: boolean }>({});

  useImperativeHandle(ref, () => groupRef.current);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { keys.current[e.code] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { keys.current[e.code] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((state, delta) => {
    if (!gameStarted) return;

    // Movement Logic
    const accel = (keys.current['KeyW'] || keys.current['ArrowUp']) ? 1 : (keys.current['KeyS'] || keys.current['ArrowDown']) ? -1 : 0;
    const steer = (keys.current['KeyA'] || keys.current['ArrowLeft']) ? 1 : (keys.current['KeyD'] || keys.current['ArrowRight']) ? -1 : 0;
    const brake = keys.current['Space'] ? 1 : 0;

    // Vehicle specific stats
    const maxSpeed = vehicleType === 'bike' ? 0.8 : 0.6;
    const acceleration = vehicleType === 'bike' ? 0.4 : 0.3;
    const friction = 0.02;
    const steeringSens = vehicleType === 'bike' ? 1.5 : 1.0;

    // Apply acceleration
    let newSpeed = speed + accel * acceleration * delta;
    
    // Apply friction and braking
    if (accel === 0) newSpeed *= (1 - friction);
    if (brake) newSpeed *= (1 - friction * 5);
    
    // Clamp speed
    newSpeed = THREE.MathUtils.clamp(newSpeed, -maxSpeed / 2, maxSpeed);
    setSpeed(newSpeed);

    // Apply steering
    const targetSteering = steer * steeringSens * delta * (Math.abs(newSpeed) > 0.01 ? 1 : 0);
    const newSteering = THREE.MathUtils.lerp(steering, targetSteering, 0.1);
    setSteering(newSteering);

    if (groupRef.current) {
      // Rotation based on steering
      groupRef.current.rotation.y += newSteering;
      
      // Move forward based on current rotation
      const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(groupRef.current.quaternion);
      groupRef.current.position.add(direction.multiplyScalar(newSpeed * 100 * delta));

      // Auto-return to track if off-road (simple version: pull towards X=0 if far)
      if (Math.abs(groupRef.current.position.x) > 20) {
        groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, 0, 0.01);
      }

      // Camera Follow
      const cameraOffset = vehicleType === 'bike' ? new THREE.Vector3(0, 3, 8) : new THREE.Vector3(0, 4, 10);
      const cameraTarget = new THREE.Vector3(0, 1, -2);
      
      const idealOffset = cameraOffset.clone().applyQuaternion(groupRef.current.quaternion).add(groupRef.current.position);
      const idealTarget = cameraTarget.clone().applyQuaternion(groupRef.current.quaternion).add(groupRef.current.position);
      
      camera.position.lerp(idealOffset, 0.1);
      camera.lookAt(idealTarget);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Vehicle Model Placeholder */}
      <mesh castShadow position={[0, 0.5, 0]}>
        {vehicleType === 'car' ? (
          <boxGeometry args={[2, 1, 4]} />
        ) : (
          <boxGeometry args={[0.5, 1.2, 2.5]} />
        )}
        <meshStandardMaterial color={vehicleType === 'car' ? '#bab3ff' : '#ffb3ba'} />
      </mesh>
      
      {/* Wheels/Details placeholder */}
      <group position={[0, 0, 0]}>
         <mesh position={[1, 0.25, 1.5]}><sphereGeometry args={[0.4, 16, 16]}/><meshStandardMaterial color="#111"/></mesh>
         <mesh position={[-1, 0.25, 1.5]}><sphereGeometry args={[0.4, 16, 16]}/><meshStandardMaterial color="#111"/></mesh>
         <mesh position={[1, 0.25, -1.5]}><sphereGeometry args={[0.4, 16, 16]}/><meshStandardMaterial color="#111"/></mesh>
         <mesh position={[-1, 0.25, -1.5]}><sphereGeometry args={[0.4, 16, 16]}/><meshStandardMaterial color="#111"/></mesh>
      </group>
    </group>
  );
});

Player.displayName = 'Player';
export default Player;
