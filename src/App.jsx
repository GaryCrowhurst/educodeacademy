import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Box, Plane, Cylinder, Sphere, useGLTF, useAnimations, useProgress, Html } from '@react-three/drei';
import * as THREE from 'three';

// Base URL for assets
const BASE_URL = import.meta.env.BASE_URL;

// Clickable Button Component with pulsing animation
function ClickableButton({ position, text, onClick, color = "#FB923C", emissiveColor = "#F59E0B", width = 4, height = 0.45, fontSize = 0.18 }) {
  const meshRef = useRef();
  const glowRef = useRef();
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    // Pulsing glow effect
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.3 + Math.sin(time * 2) * 0.15;
    }
    if (meshRef.current) {
      meshRef.current.material.emissiveIntensity = 0.5 + Math.sin(time * 2) * 0.2;
    }
  });
  
  return (
    <group position={position}>
      {/* Button background */}
      <mesh 
        ref={meshRef}
        position={[0, 0, -0.01]}
        onClick={onClick}
        onPointerOver={(e) => { document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { document.body.style.cursor = 'default'; }}
      >
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial 
          color={color}
          emissive={emissiveColor}
          emissiveIntensity={0.5}
        />
      </mesh>
      {/* Animated glow border */}
      <mesh ref={glowRef} position={[0, 0, -0.02]}>
        <planeGeometry args={[width + 0.1, height + 0.05]} />
        <meshStandardMaterial color={emissiveColor} transparent opacity={0.3} />
      </mesh>
      <Text 
        position={[0, 0, 0]} 
        fontSize={fontSize} 
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        font={`${BASE_URL}fonts/PermanentMarker-Regular.ttf`}
        onClick={onClick}
        onPointerOver={(e) => { document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { document.body.style.cursor = 'default'; }}
      >
        {text}
      </Text>
    </group>
  );
}

// Pulsing Contact Section Component
function PulsingContactSection({ position, backgroundColor, glowColor, icon, title, mainText, clickText, onClick, isDarkMode }) {
  const glowRef = useRef();
  const meshRef = useRef();
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.3 + Math.sin(time * 2) * 0.15;
    }
  });
  
  const smallTextProps = {
    fontSize: 0.18,
    maxWidth: 5.5,
    lineHeight: 1.5,
    textAlign: 'center',
    font: `${BASE_URL}fonts/PermanentMarker-Regular.ttf`
  };
  
  const textProps = {
    fontSize: 0.35,
    color: '#000000',
    anchorX: 'center',
    anchorY: 'middle',
    font: `${BASE_URL}fonts/PermanentMarker-Regular.ttf`
  };
  
  return (
    <group position={position}>
      {/* Larger invisible clickable area */}
      <mesh 
        ref={meshRef}
        position={[0, 0, 0.01]}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => { 
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
          if (meshRef.current) {
            meshRef.current.scale.set(1.02, 1.02, 1);
          }
        }}
        onPointerOut={(e) => { 
          e.stopPropagation();
          document.body.style.cursor = 'default';
          if (meshRef.current) {
            meshRef.current.scale.set(1, 1, 1);
          }
        }}
      >
        <planeGeometry args={[5.5, 1.1]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      
      {/* Visible background */}
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[5.2, 0.95]} />
        <meshBasicMaterial color={backgroundColor} transparent opacity={isDarkMode ? 0.8 : 0.6} />
      </mesh>
      
      {/* Pulsing glow border */}
      <mesh ref={glowRef} position={[0, 0, -0.03]}>
        <planeGeometry args={[5.35, 1.05]} />
        <meshBasicMaterial color={glowColor} transparent opacity={0.3} />
      </mesh>
      
      {/* Content */}
      <Text position={[-2.0, 0, 0.02]} fontSize={0.4} color={icon.color}>{icon.emoji}</Text>
      <Text position={[-0.8, 0.22, 0.02]} {...smallTextProps} fontSize={0.15} color={isDarkMode ? '#E5E7EB' : '#1E293B'}>{title}</Text>
      <Text position={mainText.position} {...textProps} fontSize={mainText.fontSize} color={mainText.color}>{mainText.text}</Text>
      <Text position={[0, -0.32, 0.02]} {...smallTextProps} fontSize={0.11} color={isDarkMode ? '#9CA3AF' : '#64748B'}>{clickText}</Text>
    </group>
  );
}

// WhiteboardContent Component
function WhiteboardContent({ section, isDarkMode, expandedCard, onCardExpand }) {
  const textProps = {
    fontSize: 0.35,
    color: '#000000',
    anchorX: 'center',
    anchorY: 'middle',
    font: `${BASE_URL}fonts/PermanentMarker-Regular.ttf`
  };

  const smallTextProps = {
    fontSize: 0.18,
    color: isDarkMode ? '#E5E7EB' : '#1F2937',
    maxWidth: 5.5,
    lineHeight: 1.5,
    textAlign: 'center',
    font: `${BASE_URL}fonts/PermanentMarker-Regular.ttf`
  };

  return (
    <group>
      {section === 0 && (
        <group>
          {/* Title */}
          <Text 
            position={[0, 2, 0]} 
            fontSize={0.6} 
            color="#000000" 
            anchorX="center"
            anchorY="middle"
            font={`${BASE_URL}fonts/PermanentMarker-Regular.ttf`}
          >
            Code Ed Ai
          </Text>
          
          {/* Slogan - smaller */}
          <Text position={[0, 1.45, 0]} {...smallTextProps} fontSize={0.16} color="#64748B">
            Empower Teachers to Bring Their Ideas to Reality
          </Text>
          
          {/* Main Value Proposition - large and clear */}
          <Text position={[0, 0.95, 0]} {...textProps} fontSize={0.3} color="#1E3A8A">
            Training for Teachers:
          </Text>
          <Text position={[0, 0.58, 0]} {...textProps} fontSize={0.3} color="#1E3A8A">
            Build Interactive Classroom
          </Text>
          <Text position={[0, 0.21, 0]} {...textProps} fontSize={0.3} color="#1E3A8A">
            Resources with Modern Methods
          </Text>
          
          {/* Supporting detail */}
          <Text position={[0, -0.2, 0]} {...smallTextProps} fontSize={0.16} color="#475569">
            Hands-on sessions teaching you to create engaging,
          </Text>
          <Text position={[0, -0.43, 0]} {...smallTextProps} fontSize={0.16} color="#475569">
            fun learning materials using AI tools
          </Text>
          
          {/* Clickable CTA Buttons */}
          <group position={[0, -0.9, 0]}>
            {/* Primary CTA - Sign Up Button with pulsing animation */}
            <ClickableButton 
              position={[0, 0.15, 0]}
              text="🚀 Sign Up for a Course Today"
              onClick={(e) => {
                e.stopPropagation();
                window.scrollTo({ 
                  top: (2 / 5) * (document.documentElement.scrollHeight - window.innerHeight), 
                  behavior: 'smooth' 
                });
              }}
              color={isDarkMode ? '#EA580C' : '#FB923C'}
              emissiveColor="#F59E0B"
            />
            
            {/* Secondary CTA - Contact Button with pulsing animation */}
            <ClickableButton 
              position={[0, -0.45, 0]}
              text="✉️ Get in Touch"
              onClick={(e) => {
                e.stopPropagation();
                window.scrollTo({ 
                  top: (5 / 5) * (document.documentElement.scrollHeight - window.innerHeight), 
                  behavior: 'smooth' 
                });
              }}
              color={isDarkMode ? '#374151' : '#E2E8F0'}
              emissiveColor="#0EA5E9"
            />
          </group>
        </group>
      )}

      {section === 1 && !expandedCard && (
        <group>
          {/* Title */}
          <Text position={[0, 1.6, 0]} {...textProps} fontSize={0.38} color={isDarkMode ? '#22D3EE' : '#0891B2'}>
            Why Code Ed AI?
          </Text>
          <mesh position={[0, 1.42, -0.01]}>
            <planeGeometry args={[2.5, 0.04]} />
            <meshBasicMaterial color={isDarkMode ? '#22D3EE' : '#0891B2'} />
          </mesh>
          
          {/* 2x2 Grid of Service Cards */}
          {/* Top Left: Interactive No-Code */}
          <group position={[-1.7, 0.4, 0]}>
            <mesh position={[0, 0, -0.02]}>
              <planeGeometry args={[2.8, 1.3]} />
              <meshBasicMaterial color={isDarkMode ? '#1E293B' : '#FEE2E2'} transparent opacity={0.5} />
            </mesh>
            <Text position={[0, 0.45, 0]} fontSize={0.24} color={isDarkMode ? '#EF4444' : '#DC2626'}>🎨</Text>
            <Text position={[0, 0.15, 0]} {...textProps} fontSize={0.16} color={isDarkMode ? '#F87171' : '#991B1B'}>
              Interactive No-Code
            </Text>
            <Text position={[0, -0.1, 0]} {...smallTextProps} fontSize={0.09} color={isDarkMode ? '#CBD5E1' : '#475569'}>
              Build apps without{'\n'}writing code
            </Text>
            {/* MORE INFO Button */}
            <mesh position={[0, -0.45, -0.01]} onClick={() => onCardExpand?.('interactive')}>
              <planeGeometry args={[1.8, 0.25]} />
              <meshBasicMaterial color={isDarkMode ? '#DC2626' : '#EF4444'} />
            </mesh>
            <Text position={[0, -0.45, 0]} fontSize={0.1} color="#FFFFFF" onClick={() => onCardExpand?.('interactive')}>
              MORE INFO →
            </Text>
          </group>
          
          {/* Top Right: AI-Powered */}
          <group position={[1.7, 0.4, 0]}>
            <mesh position={[0, 0, -0.02]}>
              <planeGeometry args={[2.8, 1.3]} />
              <meshBasicMaterial color={isDarkMode ? '#1E293B' : '#DBEAFE'} transparent opacity={0.5} />
            </mesh>
            <Text position={[0, 0.45, 0]} fontSize={0.24} color={isDarkMode ? '#60A5FA' : '#0EA5E9'}>🤖</Text>
            <Text position={[0, 0.15, 0]} {...textProps} fontSize={0.16} color={isDarkMode ? '#60A5FA' : '#0369A1'}>
              AI-Powered Creation
            </Text>
            <Text position={[0, -0.1, 0]} {...smallTextProps} fontSize={0.09} color={isDarkMode ? '#CBD5E1' : '#475569'}>
              Let AI assist your{'\n'}development
            </Text>
            {/* MORE INFO Button */}
            <mesh position={[0, -0.45, -0.01]} onClick={() => onCardExpand?.('ai')}>
              <planeGeometry args={[1.8, 0.25]} />
              <meshBasicMaterial color={isDarkMode ? '#1D4ED8' : '#3B82F6'} />
            </mesh>
            <Text position={[0, -0.45, 0]} fontSize={0.1} color="#FFFFFF" onClick={() => onCardExpand?.('ai')}>
              MORE INFO →
            </Text>
          </group>
          
          {/* Bottom Left: Mobile-First */}
          <group position={[-1.7, -1.1, 0]}>
            <mesh position={[0, 0, -0.02]}>
              <planeGeometry args={[2.8, 1.3]} />
              <meshBasicMaterial color={isDarkMode ? '#1E293B' : '#D1FAE5'} transparent opacity={0.5} />
            </mesh>
            <Text position={[0, 0.45, 0]} fontSize={0.24} color={isDarkMode ? '#34D399' : '#10B981'}>📱</Text>
            <Text position={[0, 0.15, 0]} {...textProps} fontSize={0.16} color={isDarkMode ? '#34D399' : '#047857'}>
              Mobile-First Design
            </Text>
            <Text position={[0, -0.1, 0]} {...smallTextProps} fontSize={0.09} color={isDarkMode ? '#CBD5E1' : '#475569'}>
              Perfect on any{'\n'}device
            </Text>
            {/* MORE INFO Button */}
            <mesh position={[0, -0.45, -0.01]} onClick={() => onCardExpand?.('mobile')}>
              <planeGeometry args={[1.8, 0.25]} />
              <meshBasicMaterial color={isDarkMode ? '#059669' : '#10B981'} />
            </mesh>
            <Text position={[0, -0.45, 0]} fontSize={0.1} color="#FFFFFF" onClick={() => onCardExpand?.('mobile')}>
              MORE INFO →
            </Text>
          </group>
          
          {/* Bottom Right: Professional */}
          <group position={[1.7, -1.1, 0]}>
            <mesh position={[0, 0, -0.02]}>
              <planeGeometry args={[2.8, 1.3]} />
              <meshBasicMaterial color={isDarkMode ? '#1E293B' : '#EDE9FE'} transparent opacity={0.5} />
            </mesh>
            <Text position={[0, 0.45, 0]} fontSize={0.24} color={isDarkMode ? '#A78BFA' : '#8B5CF6'}>⭐</Text>
            <Text position={[0, 0.15, 0]} {...textProps} fontSize={0.16} color={isDarkMode ? '#A78BFA' : '#6D28D9'}>
              Professional Quality
            </Text>
            <Text position={[0, -0.1, 0]} {...smallTextProps} fontSize={0.09} color={isDarkMode ? '#CBD5E1' : '#475569'}>
              Enterprise-ready{'\n'}results
            </Text>
            {/* MORE INFO Button */}
            <mesh position={[0, -0.45, -0.01]} onClick={() => onCardExpand?.('professional')}>
              <planeGeometry args={[1.8, 0.25]} />
              <meshBasicMaterial color={isDarkMode ? '#7C3AED' : '#8B5CF6'} />
            </mesh>
            <Text position={[0, -0.45, 0]} fontSize={0.1} color="#FFFFFF" onClick={() => onCardExpand?.('professional')}>
              MORE INFO →
            </Text>
          </group>
        </group>
      )}

      {section === 1 && expandedCard === 'interactive' && (
        <group>
          {/* Expanded Detail View */}
          <Text position={[0, 1.6, 0]} {...textProps} fontSize={0.32} color={isDarkMode ? '#F87171' : '#DC2626'}>
            🎨 Interactive No-Code
          </Text>
          <mesh position={[0, 1.44, -0.01]}>
            <planeGeometry args={[3.2, 0.03]} />
            <meshBasicMaterial color={isDarkMode ? '#F87171' : '#DC2626'} />
          </mesh>
          
          <Text position={[0, 1.05, 0]} {...textProps} fontSize={0.14} color={isDarkMode ? '#E2E8F0' : '#1E293B'}>
            Build Professional Apps
          </Text>
          <Text position={[0, 0.75, 0]} {...smallTextProps} fontSize={0.1} color={isDarkMode ? '#CBD5E1' : '#475569'} maxWidth={5.5}>
            Create stunning mobile apps and websites using our{'\n'}
            visual drag-and-drop builder. No coding required!
          </Text>
          
          {/* Highlights */}
          <Text position={[-2.5, 0.35, 0]} {...smallTextProps} fontSize={0.11} color={isDarkMode ? '#F87171' : '#DC2626'}>
            ✓ Session Highlights:
          </Text>
          <Text position={[-2.5, 0.15, 0]} {...smallTextProps} fontSize={0.09} color={isDarkMode ? '#CBD5E1' : '#475569'}>
            • Visual drag-and-drop interface
          </Text>
          <Text position={[-2.5, -0.05, 0]} {...smallTextProps} fontSize={0.09} color={isDarkMode ? '#CBD5E1' : '#475569'}>
            • Pre-built templates & components
          </Text>
          <Text position={[-2.5, -0.25, 0]} {...smallTextProps} fontSize={0.09} color={isDarkMode ? '#CBD5E1' : '#475569'}>
            • Real-time preview & testing
          </Text>
          <Text position={[-2.5, -0.45, 0]} {...smallTextProps} fontSize={0.09} color={isDarkMode ? '#CBD5E1' : '#475569'}>
            • One-click deployment
          </Text>
          
          {/* BACK Button */}
          <mesh position={[-2.2, -1.35, -0.01]} onClick={() => onCardExpand?.(null)}>
            <planeGeometry args={[1.4, 0.28]} />
            <meshBasicMaterial color={isDarkMode ? '#475569' : '#94A3B8'} />
          </mesh>
          <Text position={[-2.2, -1.35, 0]} fontSize={0.11} color="#FFFFFF" onClick={() => onCardExpand?.(null)}>
            ← BACK
          </Text>
          
          {/* NEXT Button */}
          <mesh position={[0.8, -1.35, -0.01]} onClick={() => onCardExpand?.('ai')}>
            <planeGeometry args={[1.4, 0.28]} />
            <meshBasicMaterial color={isDarkMode ? '#1D4ED8' : '#3B82F6'} />
          </mesh>
          <Text position={[0.8, -1.35, 0]} fontSize={0.11} color="#FFFFFF" onClick={() => onCardExpand?.('ai')}>
            NEXT →
          </Text>
          
          {/* BOOK THIS SESSION Button */}
          <ClickableButton 
            position={[2.5, -1.35, 0]}
            text="📅 BOOK NOW"
            onClick={(e) => {
              e?.stopPropagation?.();
              window.scrollTo({ 
                top: (5 / 5) * (document.documentElement.scrollHeight - window.innerHeight), 
                behavior: 'smooth' 
              });
            }}
            color={isDarkMode ? '#DC2626' : '#EF4444'}
            emissiveColor="#EF4444"
            width={1.6}
            height={0.35}
            fontSize={0.12}
          />
        </group>
      )}

      {section === 1 && expandedCard === 'ai' && (
        <group>
          {/* Expanded Detail View */}
          <Text position={[0, 1.6, 0]} {...textProps} fontSize={0.32} color={isDarkMode ? '#60A5FA' : '#0EA5E9'}>
            🤖 AI-Powered Creation
          </Text>
          <mesh position={[0, 1.44, -0.01]}>
            <planeGeometry args={[3.2, 0.03]} />
            <meshBasicMaterial color={isDarkMode ? '#60A5FA' : '#0EA5E9'} />
          </mesh>
          
          <Text position={[0, 1.05, 0]} {...textProps} fontSize={0.14} color={isDarkMode ? '#E2E8F0' : '#1E293B'}>
            AI Assistant for Development
          </Text>
          <Text position={[0, 0.75, 0]} {...smallTextProps} fontSize={0.1} color={isDarkMode ? '#CBD5E1' : '#475569'} maxWidth={5.5}>
            Leverage cutting-edge AI to generate code, design{'\n'}
            interfaces, and solve complex problems instantly.
          </Text>
          
          {/* Highlights */}
          <Text position={[-2.5, 0.35, 0]} {...smallTextProps} fontSize={0.11} color={isDarkMode ? '#60A5FA' : '#0EA5E9'}>
            ✓ Session Highlights:
          </Text>
          <Text position={[-2.5, 0.15, 0]} {...smallTextProps} fontSize={0.09} color={isDarkMode ? '#CBD5E1' : '#475569'}>
            • Natural language to code
          </Text>
          <Text position={[-2.5, -0.05, 0]} {...smallTextProps} fontSize={0.09} color={isDarkMode ? '#CBD5E1' : '#475569'}>
            • Automated testing & debugging
          </Text>
          <Text position={[-2.5, -0.25, 0]} {...smallTextProps} fontSize={0.09} color={isDarkMode ? '#CBD5E1' : '#475569'}>
            • Smart design suggestions
          </Text>
          <Text position={[-2.5, -0.45, 0]} {...smallTextProps} fontSize={0.09} color={isDarkMode ? '#CBD5E1' : '#475569'}>
            • Context-aware assistance
          </Text>
          
          {/* BACK Button */}
          <mesh position={[-2.2, -1.35, -0.01]} onClick={() => onCardExpand?.('interactive')}>
            <planeGeometry args={[1.4, 0.28]} />
            <meshBasicMaterial color={isDarkMode ? '#475569' : '#94A3B8'} />
          </mesh>
          <Text position={[-2.2, -1.35, 0]} fontSize={0.11} color="#FFFFFF" onClick={() => onCardExpand?.('interactive')}>
            ← BACK
          </Text>
          
          {/* NEXT Button */}
          <mesh position={[0.8, -1.35, -0.01]} onClick={() => onCardExpand?.('mobile')}>
            <planeGeometry args={[1.4, 0.28]} />
            <meshBasicMaterial color={isDarkMode ? '#059669' : '#10B981'} />
          </mesh>
          <Text position={[0.8, -1.35, 0]} fontSize={0.11} color="#FFFFFF" onClick={() => onCardExpand?.('mobile')}>
            NEXT →
          </Text>
          
          {/* BOOK THIS SESSION Button */}
          <ClickableButton 
            position={[2.5, -1.35, 0]}
            text="📅 BOOK NOW"
            onClick={(e) => {
              e?.stopPropagation?.();
              window.scrollTo({ 
                top: (5 / 5) * (document.documentElement.scrollHeight - window.innerHeight), 
                behavior: 'smooth' 
              });
            }}
            color={isDarkMode ? '#1D4ED8' : '#3B82F6'}
            emissiveColor="#3B82F6"
            width={1.6}
            height={0.35}
            fontSize={0.12}
          />
        </group>
      )}

      {section === 1 && expandedCard === 'mobile' && (
        <group>
          {/* Expanded Detail View */}
          <Text position={[0, 1.6, 0]} {...textProps} fontSize={0.32} color={isDarkMode ? '#34D399' : '#10B981'}>
            📱 Mobile-First Design
          </Text>
          <mesh position={[0, 1.44, -0.01]}>
            <planeGeometry args={[3.2, 0.03]} />
            <meshBasicMaterial color={isDarkMode ? '#34D399' : '#10B981'} />
          </mesh>
          
          <Text position={[0, 1.05, 0]} {...textProps} fontSize={0.14} color={isDarkMode ? '#E2E8F0' : '#1E293B'}>
            Perfect on Every Device
          </Text>
          <Text position={[0, 0.75, 0]} {...smallTextProps} fontSize={0.1} color={isDarkMode ? '#CBD5E1' : '#475569'} maxWidth={5.5}>
            Build responsive applications that work flawlessly{'\n'}
            on smartphones, tablets, and desktops.
          </Text>
          
          {/* Highlights */}
          <Text position={[-2.5, 0.35, 0]} {...smallTextProps} fontSize={0.11} color={isDarkMode ? '#34D399' : '#10B981'}>
            ✓ Session Highlights:
          </Text>
          <Text position={[-2.5, 0.15, 0]} {...smallTextProps} fontSize={0.09} color={isDarkMode ? '#CBD5E1' : '#475569'}>
            • Responsive design patterns
          </Text>
          <Text position={[-2.5, -0.05, 0]} {...smallTextProps} fontSize={0.09} color={isDarkMode ? '#CBD5E1' : '#475569'}>
            • Touch-optimized interfaces
          </Text>
          <Text position={[-2.5, -0.25, 0]} {...smallTextProps} fontSize={0.09} color={isDarkMode ? '#CBD5E1' : '#475569'}>
            • Cross-platform compatibility
          </Text>
          <Text position={[-2.5, -0.45, 0]} {...smallTextProps} fontSize={0.09} color={isDarkMode ? '#CBD5E1' : '#475569'}>
            • Performance optimization
          </Text>
          
          {/* BACK Button */}
          <mesh position={[-2.2, -1.35, -0.01]} onClick={() => onCardExpand?.('ai')}>
            <planeGeometry args={[1.4, 0.28]} />
            <meshBasicMaterial color={isDarkMode ? '#475569' : '#94A3B8'} />
          </mesh>
          <Text position={[-2.2, -1.35, 0]} fontSize={0.11} color="#FFFFFF" onClick={() => onCardExpand?.('ai')}>
            ← BACK
          </Text>
          
          {/* NEXT Button */}
          <mesh position={[0.8, -1.35, -0.01]} onClick={() => onCardExpand?.('professional')}>
            <planeGeometry args={[1.4, 0.28]} />
            <meshBasicMaterial color={isDarkMode ? '#7C3AED' : '#8B5CF6'} />
          </mesh>
          <Text position={[0.8, -1.35, 0]} fontSize={0.11} color="#FFFFFF" onClick={() => onCardExpand?.('professional')}>
            NEXT →
          </Text>
          
          {/* BOOK THIS SESSION Button */}
          <ClickableButton 
            position={[2.5, -1.35, 0]}
            text="📅 BOOK NOW"
            onClick={(e) => {
              e?.stopPropagation?.();
              window.scrollTo({ 
                top: (5 / 5) * (document.documentElement.scrollHeight - window.innerHeight), 
                behavior: 'smooth' 
              });
            }}
            color={isDarkMode ? '#059669' : '#10B981'}
            emissiveColor="#10B981"
            width={1.6}
            height={0.35}
            fontSize={0.12}
          />
        </group>
      )}

      {section === 1 && expandedCard === 'professional' && (
        <group>
          {/* Expanded Detail View */}
          <Text position={[0, 1.6, 0]} {...textProps} fontSize={0.32} color={isDarkMode ? '#A78BFA' : '#8B5CF6'}>
            ⭐ Professional Quality
          </Text>
          <mesh position={[0, 1.44, -0.01]}>
            <planeGeometry args={[3.2, 0.03]} />
            <meshBasicMaterial color={isDarkMode ? '#A78BFA' : '#8B5CF6'} />
          </mesh>
          
          <Text position={[0, 1.05, 0]} {...textProps} fontSize={0.14} color={isDarkMode ? '#E2E8F0' : '#1E293B'}>
            Enterprise-Ready Results
          </Text>
          <Text position={[0, 0.75, 0]} {...smallTextProps} fontSize={0.1} color={isDarkMode ? '#CBD5E1' : '#475569'} maxWidth={5.5}>
            Create production-grade applications with best{'\n'}
            practices, security, and scalability built-in.
          </Text>
          
          {/* Highlights */}
          <Text position={[-2.5, 0.35, 0]} {...smallTextProps} fontSize={0.11} color={isDarkMode ? '#A78BFA' : '#8B5CF6'}>
            ✓ Session Highlights:
          </Text>
          <Text position={[-2.5, 0.15, 0]} {...smallTextProps} fontSize={0.09} color={isDarkMode ? '#CBD5E1' : '#475569'}>
            • Industry best practices
          </Text>
          <Text position={[-2.5, -0.05, 0]} {...smallTextProps} fontSize={0.09} color={isDarkMode ? '#CBD5E1' : '#475569'}>
            • Security & compliance
          </Text>
          <Text position={[-2.5, -0.25, 0]} {...smallTextProps} fontSize={0.09} color={isDarkMode ? '#CBD5E1' : '#475569'}>
            • Scalable architecture
          </Text>
          <Text position={[-2.5, -0.45, 0]} {...smallTextProps} fontSize={0.09} color={isDarkMode ? '#CBD5E1' : '#475569'}>
            • Production deployment
          </Text>
          
          {/* BACK Button */}
          <mesh position={[-2.2, -1.35, -0.01]} onClick={() => onCardExpand?.('mobile')}>
            <planeGeometry args={[1.4, 0.28]} />
            <meshBasicMaterial color={isDarkMode ? '#475569' : '#94A3B8'} />
          </mesh>
          <Text position={[-2.2, -1.35, 0]} fontSize={0.11} color="#FFFFFF" onClick={() => onCardExpand?.('mobile')}>
            ← BACK
          </Text>
          
          {/* NEXT Button (back to grid) */}
          <mesh position={[0.8, -1.35, -0.01]} onClick={() => onCardExpand?.(null)}>
            <planeGeometry args={[1.4, 0.28]} />
            <meshBasicMaterial color={isDarkMode ? '#475569' : '#94A3B8'} />
          </mesh>
          <Text position={[0.8, -1.35, 0]} fontSize={0.11} color="#FFFFFF" onClick={() => onCardExpand?.(null)}>
            BACK TO ALL
          </Text>
          
          {/* BOOK THIS SESSION Button */}
          <ClickableButton 
            position={[2.5, -1.35, 0]}
            text="📅 BOOK NOW"
            onClick={(e) => {
              e?.stopPropagation?.();
              window.scrollTo({ 
                top: (5 / 5) * (document.documentElement.scrollHeight - window.innerHeight), 
                behavior: 'smooth' 
              });
            }}
            color={isDarkMode ? '#7C3AED' : '#8B5CF6'}
            emissiveColor="#8B5CF6"
            width={1.6}
            height={0.35}
            fontSize={0.12}
          />
        </group>
      )}

      {section === 2 && (
        <group>
          {/* Title */}
          <Text position={[0, 1.6, 0]} {...textProps} fontSize={0.38} color="#0891B2">
            Training Sessions
          </Text>
          <mesh position={[0, 1.42, -0.01]}>
            <planeGeometry args={[2.5, 0.04]} />
            <meshBasicMaterial color="#0891B2" />
          </mesh>
          
          {/* Inspiration session - highlighted */}
          <group position={[0, 0.85, 0]}>
            <mesh position={[0, 0, -0.02]}>
              <planeGeometry args={[5.5, 0.75]} />
              <meshBasicMaterial color="#D1FAE5" transparent opacity={0.4} />
            </mesh>
            <Text position={[-2, 0.15, 0]} fontSize={0.25} color="#10B981">✨</Text>
            <Text position={[-1.3, 0.15, 0]} {...textProps} fontSize={0.22} color="#10B981">30 min</Text>
            <Text position={[0.3, 0.15, 0]} {...smallTextProps} fontSize={0.14} color="#047857">Inspiration Session</Text>
            <Text position={[2, 0.15, 0]} {...smallTextProps} fontSize={0.11} color="#059669">(All Levels)</Text>
            <Text position={[0, -0.15, 0]} {...smallTextProps} fontSize={0.11} color="#064E3B">Ideas to apps - no coding!</Text>
          </group>
          
          {/* Arrow down */}
          <Text position={[0, 0.35, 0]} fontSize={0.25} color="#64748B">↓</Text>
          
          {/* Step 1 */}
          <group position={[-1.8, -0.15, 0]}>
            <mesh position={[0, 0, -0.02]}>
              <planeGeometry args={[1.7, 0.75]} />
              <meshBasicMaterial color="#DBEAFE" transparent opacity={0.4} />
            </mesh>
            <Text position={[-0.65, 0.2, 0]} fontSize={0.28} color="#0EA5E9">1.</Text>
            <Text position={[0.15, 0.2, 0]} {...smallTextProps} fontSize={0.13} color="#0369A1">GitHub Foundations</Text>
            <Text position={[0, -0.1, 0]} {...smallTextProps} fontSize={0.1} color="#475569">2 hrs • Beginner 💻</Text>
          </group>
          
          {/* Step 2 */}
          <group position={[0, -0.15, 0]}>
            <mesh position={[0, 0, -0.02]}>
              <planeGeometry args={[1.7, 0.75]} />
              <meshBasicMaterial color="#EDE9FE" transparent opacity={0.4} />
            </mesh>
            <Text position={[-0.65, 0.2, 0]} fontSize={0.28} color="#8B5CF6">2.</Text>
            <Text position={[0.15, 0.2, 0]} {...smallTextProps} fontSize={0.13} color="#6D28D9">AI-Powered Creation</Text>
            <Text position={[0, -0.1, 0]} {...smallTextProps} fontSize={0.1} color="#475569">2 hrs • Intermediate 🤖</Text>
          </group>
          
          {/* Step 3 */}
          <group position={[1.8, -0.15, 0]}>
            <mesh position={[0, 0, -0.02]}>
              <planeGeometry args={[1.7, 0.75]} />
              <meshBasicMaterial color="#FEF3C7" transparent opacity={0.4} />
            </mesh>
            <Text position={[-0.65, 0.2, 0]} fontSize={0.28} color="#F59E0B">3.</Text>
            <Text position={[0.15, 0.2, 0]} {...smallTextProps} fontSize={0.13} color="#D97706">Complete Apps</Text>
            <Text position={[0, -0.1, 0]} {...smallTextProps} fontSize={0.1} color="#475569">2 hrs • Advanced 🏗️</Text>
          </group>
          
          {/* Bottom summary */}
          <mesh position={[0, -1.15, -0.02]}>
            <planeGeometry args={[5, 0.35]} />
            <meshBasicMaterial color="#F1F5F9" transparent opacity={0.5} />
          </mesh>
          <Text position={[0, -1.15, 0]} {...smallTextProps} fontSize={0.12} color="#1E3A8A">
            Beginner to confident creator - 3 progressive sessions 🎓
          </Text>
          
          {/* Book Now CTA */}
          <ClickableButton 
            position={[0, -1.7, 0]}
            text="📅 BOOK NOW!"
            onClick={(e) => {
              e.stopPropagation();
              window.scrollTo({ 
                top: (5 / 5) * (document.documentElement.scrollHeight - window.innerHeight), 
                behavior: 'smooth' 
              });
            }}
            color={isDarkMode ? '#059669' : '#10B981'}
            emissiveColor="#10B981"
          />
        </group>
      )}

      {section === 3 && (
        <group>
          {/* Title */}
          <Text position={[0, 1.6, 0]} {...textProps} fontSize={0.38} color="#0891B2">
            Pricing
          </Text>
          <mesh position={[0, 1.42, -0.01]}>
            <planeGeometry args={[1.8, 0.04]} />
            <meshBasicMaterial color="#0891B2" />
          </mesh>
          
          {/* Single Session */}
          <group position={[-1.85, 0.5, 0]}>
            <mesh position={[0, 0, -0.02]}>
              <planeGeometry args={[1.5, 1]} />
              <meshBasicMaterial color="#DBEAFE" transparent opacity={0.4} />
            </mesh>
            <Text position={[0, 0.3, 0]} {...textProps} fontSize={0.32} color="#0369A1">£149</Text>
            <mesh position={[0, 0.08, -0.01]}>
              <planeGeometry args={[1.2, 0.03]} />
              <meshBasicMaterial color="#0891B2" />
            </mesh>
            <Text position={[0, -0.15, 0]} {...smallTextProps} fontSize={0.13} color="#1E3A8A">Single Session</Text>
            <Text position={[0, -0.35, 0]} {...smallTextProps} fontSize={0.1} color="#64748B">per educator</Text>
          </group>
          
          {/* Complete Package - HIGHLIGHTED */}
          <group position={[0, 0.5, 0]}>
            <mesh position={[0, 0, -0.02]}>
              <planeGeometry args={[1.7, 1]} />
              <meshBasicMaterial color="#D1FAE5" transparent opacity={0.5} />
            </mesh>
            <mesh position={[0, 0.48, -0.01]}>
              <planeGeometry args={[1.3, 0.18]} />
              <meshBasicMaterial color="#10B981" />
            </mesh>
            <Text position={[0, 0.48, 0]} fontSize={0.08} color="#FFFFFF">BEST VALUE</Text>
            <Text position={[0, 0.2, 0]} {...textProps} fontSize={0.32} color="#059669">£349</Text>
            <mesh position={[0, -0.02, -0.01]}>
              <planeGeometry args={[1.3, 0.03]} />
              <meshBasicMaterial color="#10B981" />
            </mesh>
            <Text position={[0, -0.25, 0]} {...smallTextProps} fontSize={0.13} color="#047857">Full Programme</Text>
            <Text position={[0, -0.42, 0]} {...smallTextProps} fontSize={0.11} color="#059669">Save £98!</Text>
          </group>
          
          {/* Department */}
          <group position={[1.85, 0.5, 0]}>
            <mesh position={[0, 0, -0.02]}>
              <planeGeometry args={[1.5, 1]} />
              <meshBasicMaterial color="#FEF3C7" transparent opacity={0.4} />
            </mesh>
            <Text position={[0, 0.3, 0]} {...textProps} fontSize={0.32} color="#D97706">£299</Text>
            <mesh position={[0, 0.08, -0.01]}>
              <planeGeometry args={[1.2, 0.03]} />
              <meshBasicMaterial color="#F59E0B" />
            </mesh>
            <Text position={[0, -0.15, 0]} {...smallTextProps} fontSize={0.13} color="#92400E">Department</Text>
            <Text position={[0, -0.35, 0]} {...smallTextProps} fontSize={0.1} color="#64748B">5+ educators</Text>
          </group>
          
          {/* Whole School */}
          <group position={[0, -0.75, 0]}>
            <mesh position={[0, 0, -0.02]}>
              <planeGeometry args={[4.5, 0.65]} />
              <meshBasicMaterial color="#EDE9FE" transparent opacity={0.5} />
            </mesh>
            <Text position={[-1.5, 0, 0]} fontSize={0.22} color="#8B5CF6">🏫</Text>
            <Text position={[-0.5, 0, 0]} {...textProps} fontSize={0.28} color="#7C3AED">£4,500+</Text>
            <Text position={[1.2, 0, 0]} {...smallTextProps} fontSize={0.14} color="#6D28D9">Whole School Training</Text>
          </group>
          
          {/* Bottom note */}
          <mesh position={[0, -1.35, -0.02]}>
            <planeGeometry args={[5.5, 0.3]} />
            <meshBasicMaterial color="#F1F5F9" transparent opacity={0.5} />
          </mesh>
          <Text position={[0, -1.35, 0]} {...smallTextProps} fontSize={0.12} color="#475569">
            Flexible options for everyone ✓
          </Text>
        </group>
      )}

      {section === 4 && (
        <group>
          {/* Title */}
          <Text position={[0, 1.6, 0]} {...textProps} fontSize={0.38} color={isDarkMode ? '#F59E0B' : '#D97706'}>
            What You Can Build
          </Text>
          <mesh position={[0, 1.42, -0.01]}>
            <planeGeometry args={[3.5, 0.04]} />
            <meshBasicMaterial color={isDarkMode ? '#F59E0B' : '#D97706'} />
          </mesh>
          
          {/* Subtitle */}
          <Text position={[0, 1.15, 0]} {...smallTextProps} fontSize={0.11} color={isDarkMode ? '#D1D5DB' : '#475569'}>
            Real projects created by students in our sessions
          </Text>
          
          {/* Top Row - 3 Projects */}
          {/* Project 1: Learning App */}
          <group position={[-2.2, 0.35, 0]}>
            <mesh position={[0, 0, -0.02]}>
              <planeGeometry args={[1.9, 1.1]} />
              <meshBasicMaterial color={isDarkMode ? '#1E293B' : '#FEF3C7'} transparent opacity={0.6} />
            </mesh>
            {/* Session Badge */}
            <mesh position={[-0.6, 0.48, -0.01]}>
              <planeGeometry args={[0.65, 0.16]} />
              <meshBasicMaterial color="#F59E0B" />
            </mesh>
            <Text position={[-0.6, 0.48, 0]} fontSize={0.07} color="#FFFFFF">Session 1</Text>
            
            <Text position={[0, 0.25, 0]} fontSize={0.18} color={isDarkMode ? '#FDE047' : '#CA8A04'}>📚</Text>
            <Text position={[0, 0.0, 0]} {...textProps} fontSize={0.13} color={isDarkMode ? '#FDE047' : '#A16207'}>
              Learning App
            </Text>
            <Text position={[0, -0.2, 0]} {...smallTextProps} fontSize={0.08} color={isDarkMode ? '#CBD5E1' : '#64748B'}>
              Interactive quiz{'\n'}platform with{'\n'}progress tracking
            </Text>
          </group>
          
          {/* Project 2: Business Site */}
          <group position={[0, 0.35, 0]}>
            <mesh position={[0, 0, -0.02]}>
              <planeGeometry args={[1.9, 1.1]} />
              <meshBasicMaterial color={isDarkMode ? '#1E293B' : '#DBEAFE'} transparent opacity={0.6} />
            </mesh>
            {/* Session Badge */}
            <mesh position={[-0.6, 0.48, -0.01]}>
              <planeGeometry args={[0.65, 0.16]} />
              <meshBasicMaterial color="#10B981" />
            </mesh>
            <Text position={[-0.6, 0.48, 0]} fontSize={0.07} color="#FFFFFF">Session 2</Text>
            
            <Text position={[0, 0.25, 0]} fontSize={0.18} color={isDarkMode ? '#60A5FA' : '#0EA5E9'}>🏢</Text>
            <Text position={[0, 0.0, 0]} {...textProps} fontSize={0.13} color={isDarkMode ? '#60A5FA' : '#0369A1'}>
              Business Site
            </Text>
            <Text position={[0, -0.2, 0]} {...smallTextProps} fontSize={0.08} color={isDarkMode ? '#CBD5E1' : '#64748B'}>
              Professional{'\n'}company website{'\n'}with contact form
            </Text>
          </group>
          
          {/* Project 3: Portfolio */}
          <group position={[2.2, 0.35, 0]}>
            <mesh position={[0, 0, -0.02]}>
              <planeGeometry args={[1.9, 1.1]} />
              <meshBasicMaterial color={isDarkMode ? '#1E293B' : '#EDE9FE'} transparent opacity={0.6} />
            </mesh>
            {/* Session Badge */}
            <mesh position={[-0.6, 0.48, -0.01]}>
              <planeGeometry args={[0.65, 0.16]} />
              <meshBasicMaterial color="#F59E0B" />
            </mesh>
            <Text position={[-0.6, 0.48, 0]} fontSize={0.07} color="#FFFFFF">Session 1</Text>
            
            <Text position={[0, 0.25, 0]} fontSize={0.18} color={isDarkMode ? '#A78BFA' : '#8B5CF6'}>🎨</Text>
            <Text position={[0, 0.0, 0]} {...textProps} fontSize={0.13} color={isDarkMode ? '#A78BFA' : '#6D28D9'}>
              Art Portfolio
            </Text>
            <Text position={[0, -0.2, 0]} {...smallTextProps} fontSize={0.08} color={isDarkMode ? '#CBD5E1' : '#64748B'}>
              Showcase gallery{'\n'}with image{'\n'}lightbox
            </Text>
          </group>
          
          {/* Bottom Row - 3 Projects */}
          {/* Project 4: Recipe Book */}
          <group position={[-2.2, -0.95, 0]}>
            <mesh position={[0, 0, -0.02]}>
              <planeGeometry args={[1.9, 1.1]} />
              <meshBasicMaterial color={isDarkMode ? '#1E293B' : '#D1FAE5'} transparent opacity={0.6} />
            </mesh>
            {/* Session Badge */}
            <mesh position={[-0.6, 0.48, -0.01]}>
              <planeGeometry args={[0.65, 0.16]} />
              <meshBasicMaterial color="#10B981" />
            </mesh>
            <Text position={[-0.6, 0.48, 0]} fontSize={0.07} color="#FFFFFF">Session 3</Text>
            
            <Text position={[0, 0.25, 0]} fontSize={0.18} color={isDarkMode ? '#34D399' : '#10B981'}>🍳</Text>
            <Text position={[0, 0.0, 0]} {...textProps} fontSize={0.13} color={isDarkMode ? '#34D399' : '#047857'}>
              Recipe Book
            </Text>
            <Text position={[0, -0.2, 0]} {...smallTextProps} fontSize={0.08} color={isDarkMode ? '#CBD5E1' : '#64748B'}>
              Search & filter{'\n'}recipes with{'\n'}ingredients
            </Text>
          </group>
          
          {/* Project 5: Event Manager */}
          <group position={[0, -0.95, 0]}>
            <mesh position={[0, 0, -0.02]}>
              <planeGeometry args={[1.9, 1.1]} />
              <meshBasicMaterial color={isDarkMode ? '#1E293B' : '#FEE2E2'} transparent opacity={0.6} />
            </mesh>
            {/* Session Badge */}
            <mesh position={[-0.6, 0.48, -0.01]}>
              <planeGeometry args={[0.65, 0.16]} />
              <meshBasicMaterial color="#F59E0B" />
            </mesh>
            <Text position={[-0.6, 0.48, 0]} fontSize={0.07} color="#FFFFFF">Session 4</Text>
            
            <Text position={[0, 0.25, 0]} fontSize={0.18} color={isDarkMode ? '#F87171' : '#EF4444'}>📅</Text>
            <Text position={[0, 0.0, 0]} {...textProps} fontSize={0.13} color={isDarkMode ? '#F87171' : '#991B1B'}>
              Event Manager
            </Text>
            <Text position={[0, -0.2, 0]} {...smallTextProps} fontSize={0.08} color={isDarkMode ? '#CBD5E1' : '#64748B'}>
              Calendar with{'\n'}booking &{'\n'}reminders
            </Text>
          </group>
          
          {/* Project 6: Social Hub */}
          <group position={[2.2, -0.95, 0]}>
            <mesh position={[0, 0, -0.02]}>
              <planeGeometry args={[1.9, 1.1]} />
              <meshBasicMaterial color={isDarkMode ? '#1E293B' : '#FCE7F3'} transparent opacity={0.6} />
            </mesh>
            {/* Session Badge */}
            <mesh position={[-0.6, 0.48, -0.01]}>
              <planeGeometry args={[0.65, 0.16]} />
              <meshBasicMaterial color="#10B981" />
            </mesh>
            <Text position={[-0.6, 0.48, 0]} fontSize={0.07} color="#FFFFFF">Session 2</Text>
            
            <Text position={[0, 0.25, 0]} fontSize={0.18} color={isDarkMode ? '#F472B6' : '#EC4899'}>💬</Text>
            <Text position={[0, 0.0, 0]} {...textProps} fontSize={0.13} color={isDarkMode ? '#F472B6' : '#BE185D'}>
              Social Hub
            </Text>
            <Text position={[0, -0.2, 0]} {...smallTextProps} fontSize={0.08} color={isDarkMode ? '#CBD5E1' : '#64748B'}>
              Posts, comments{'\n'}& user profiles
            </Text>
          </group>
        </group>
      )}

      {section === 5 && (
        <group>
          {/* Title */}
          <Text position={[0, 2.2, 0]} {...textProps} fontSize={0.5} color={isDarkMode ? '#22D3EE' : '#0891B2'}>
            Get In Touch!
          </Text>
          <mesh position={[0, 1.95, -0.01]}>
            <planeGeometry args={[3.2, 0.05]} />
            <meshBasicMaterial color={isDarkMode ? '#22D3EE' : '#0891B2'} />
          </mesh>
          
          {/* Subtitle */}
          <Text position={[0, 1.5, 0]} {...smallTextProps} fontSize={0.16} color={isDarkMode ? '#D1D5DB' : '#475569'}>
            Ready to transform your teaching?
          </Text>
          <Text position={[0, 1.25, 0]} {...smallTextProps} fontSize={0.16} color={isDarkMode ? '#D1D5DB' : '#475569'}>
            Let's discuss your needs!
          </Text>
          
          {/* Phone Section - Clickable with pulsing glow */}
          <PulsingContactSection 
            position={[0, 0.45, 0]}
            backgroundColor={isDarkMode ? '#1E3A8A' : '#DBEAFE'}
            glowColor="#0EA5E9"
            icon={{ emoji: '📞', color: isDarkMode ? '#22D3EE' : '#0EA5E9' }}
            title="Call Gary:"
            mainText={{ 
              text: '07447 665672', 
              position: [0.85, 0, 0], 
              fontSize: 0.28, 
              color: isDarkMode ? '#60A5FA' : '#0369A1' 
            }}
            clickText="👆 Click to call"
            onClick={() => {
              window.location.href = 'tel:+447447665672';
            }}
            isDarkMode={isDarkMode}
          />
          
          {/* Email Section - Clickable with pulsing glow */}
          <PulsingContactSection 
            position={[0, -0.5, 0]}
            backgroundColor={isDarkMode ? '#78350F' : '#FEF3C7'}
            glowColor="#F59E0B"
            icon={{ emoji: '📧', color: isDarkMode ? '#FCD34D' : '#F59E0B' }}
            title="Email:"
            mainText={{ 
              text: 'gary@codeedai.com', 
              position: [0.7, 0, 0], 
              fontSize: 0.26, 
              color: isDarkMode ? '#FBBF24' : '#D97706' 
            }}
            clickText="👆 Click to email & copy"
            onClick={() => {
              navigator.clipboard.writeText('gary@codeedai.com').then(() => {
                console.log('Email copied to clipboard!');
              });
              window.location.href = 'mailto:gary@codeedai.com';
            }}
            isDarkMode={isDarkMode}
          />
          
          {/* Quick Response Note */}
          <mesh position={[0, -1.35, -0.02]}>
            <planeGeometry args={[5.4, 0.5]} />
            <meshBasicMaterial color={isDarkMode ? '#064E3B' : '#D1FAE5'} transparent opacity={isDarkMode ? 0.6 : 0.4} />
          </mesh>
          <Text position={[0, -1.22, 0]} {...smallTextProps} fontSize={0.13} color={isDarkMode ? '#6EE7B7' : '#047857'}>
            ⚡ Quick Response Guaranteed
          </Text>
          <Text position={[0, -1.45, 0]} {...smallTextProps} fontSize={0.11} color={isDarkMode ? '#9CA3AF' : '#64748B'}>
            We respond within 24 hours (Mon-Fri)
          </Text>
        </group>
      )}
    </group>
  );
}

// Larger Whiteboard Component
function Whiteboard({ section, isDarkMode, expandedCard, onCardExpand }) {
  return (
    <group position={[0, 2.2, -2.9]}>
      {/* Larger Whiteboard Surface - increased from 7x4 to 9x5.5 */}
      <Box args={[9, 5.5, 0.1]}>
        <meshStandardMaterial 
          color={isDarkMode ? '#0F172A' : '#FFFFFF'} 
          roughness={isDarkMode ? 0.6 : 0.05} 
          metalness={0.1} 
          emissive={isDarkMode ? '#000000' : '#F8FAFC'} 
          emissiveIntensity={isDarkMode ? 0 : 0.4}
          depthWrite={true}
        />
      </Box>
      
      {/* Whiteboard Frame */}
      <Box args={[9.1, 5.6, 0.05]} position={[0, 0, -0.08]}>
        <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.5} />
      </Box>
      
      {/* Content on whiteboard */}
      <group position={[0, 0, 0.3]}>
        <WhiteboardContent 
          section={section} 
          isDarkMode={isDarkMode} 
          expandedCard={expandedCard}
          onCardExpand={onCardExpand}
        />
      </group>
      
      {/* Marker Tray */}
      <Box args={[8.8, 0.2, 0.2]} position={[0, -2.85, 0.1]}>
        <meshStandardMaterial color="#4a5568" roughness={0.6} metalness={0.3} />
      </Box>
      
      {/* Markers */}
      <Cylinder args={[0.03, 0.03, 0.4]} position={[-1.5, -2.1, 0.2]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#0EA5E9" />
      </Cylinder>
      <Cylinder args={[0.03, 0.03, 0.4]} position={[-0.5, -2.1, 0.2]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#000000" />
      </Cylinder>
      <Cylinder args={[0.03, 0.03, 0.4]} position={[0.5, -2.1, 0.2]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#EF4444" />
      </Cylinder>
      <Cylinder args={[0.03, 0.03, 0.4]} position={[1.5, -2.1, 0.2]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#10B981" />
      </Cylinder>
      
      {/* Eraser */}
      <Box args={[0.2, 0.12, 0.08]} position={[2.5, -2.1, 0.2]}>
        <meshStandardMaterial color="#6B7280" />
      </Box>
    </group>
  );
}

// Teaching Teacher with animations
function TeachingTeacher({ section, onAvatarClick }) {
  const groupRef = useRef();
  const { scene: avatarScene, animations: avatarAnims } = useGLTF(`${BASE_URL}animated_avatar.glb`);
  const { animations: wavingAnims } = useGLTF(`${BASE_URL}waving.glb`);
  const { animations: expression1Anims } = useGLTF(`${BASE_URL}expression1.glb`);
  const { animations: expression10Anims } = useGLTF(`${BASE_URL}expression10.glb`);
  const { animations: talk1Anims } = useGLTF(`${BASE_URL}talk1.glb`);
  const { animations: talk2Anims } = useGLTF(`${BASE_URL}talk2.glb`);
  const { animations: talk3Anims } = useGLTF(`${BASE_URL}talk3.glb`);
  const { animations: talk4Anims } = useGLTF(`${BASE_URL}talk4.glb`);
  const { animations: talk5Anims } = useGLTF(`${BASE_URL}talk5.glb`);
  const { animations: talk6Anims } = useGLTF(`${BASE_URL}talk6.glb`);
  const { animations: talk7Anims } = useGLTF(`${BASE_URL}talk7.glb`);
  const { animations: talk8Anims } = useGLTF(`${BASE_URL}talk8.glb`);
  const { animations: talk9Anims } = useGLTF(`${BASE_URL}talk9.glb`);
  const { animations: talk10Anims } = useGLTF(`${BASE_URL}talk10.glb`);
  const { animations: lookbackAnims } = useGLTF(`${BASE_URL}lookback.glb`);
  
  const [mixer] = useState(() => new THREE.AnimationMixer(avatarScene));
  const actionsRef = useRef({});
  const currentActionRef = useRef(null);
  const [talkIndex, setTalkIndex] = useState(0);
  const lastSectionRef = useRef(section);
  const hasPlayedExpression1 = useRef(false);
  
  // Load all animations into the mixer
  useEffect(() => {
    const loadedActions = {};
    
    const allTalkingAnims = [
      ...talk1Anims, ...talk2Anims, ...talk3Anims, ...talk4Anims, ...talk5Anims,
      ...talk6Anims, ...talk7Anims, ...talk8Anims, ...talk9Anims, ...talk10Anims
    ];
    
    wavingAnims.forEach((clip, index) => {
      loadedActions[`waving_${index}`] = mixer.clipAction(clip, avatarScene);
    });
    
    expression1Anims.forEach((clip, index) => {
      loadedActions[`expression1_${index}`] = mixer.clipAction(clip, avatarScene);
    });
    
    expression10Anims.forEach((clip, index) => {
      loadedActions[`expression10_${index}`] = mixer.clipAction(clip, avatarScene);
    });
    
    allTalkingAnims.forEach((clip, index) => {
      loadedActions[`talk_${index}`] = mixer.clipAction(clip, avatarScene);
    });
    
    lookbackAnims.forEach((clip, index) => {
      loadedActions[`lookback_${index}`] = mixer.clipAction(clip, avatarScene);
    });
    
    actionsRef.current = loadedActions;
    
    // Play initial waving animation for home
    if (loadedActions.waving_0) {
      loadedActions.waving_0.play();
      currentActionRef.current = loadedActions.waving_0;
    }
    
    return () => {
      Object.values(loadedActions).forEach(action => action.stop());
    };
  }, [mixer, wavingAnims, expression1Anims, expression10Anims, talk1Anims, talk2Anims, talk3Anims, talk4Anims, talk5Anims, talk6Anims, talk7Anims, talk8Anims, talk9Anims, talk10Anims, lookbackAnims, avatarScene]);
  
  // Switch animations based on section
  useEffect(() => {
    const actions = actionsRef.current;
    if (Object.keys(actions).length === 0) return;
    
    let newAction;
    
    if (section === 0) {
      // Home - use expression 001 only once, then switch to random talking/lookback
      if (!hasPlayedExpression1.current) {
        newAction = actions.expression1_0;
        hasPlayedExpression1.current = true;
      } else {
        const allAnimKeys = Object.keys(actions).filter(k => k.startsWith('talk_') || k === 'lookback_0');
        const randomIndex = Math.floor(Math.random() * allAnimKeys.length);
        newAction = actions[allAnimKeys[randomIndex]];
      }
    } else if (section === 1 || section === 2 || section === 3 || section === 4 || section === 5) {
      // All other sections - randomly use talking variations + lookback for natural movement
      const allAnimKeys = Object.keys(actions).filter(k => k.startsWith('talk_') || k === 'lookback_0');
      const randomIndex = Math.floor(Math.random() * allAnimKeys.length);
      newAction = actions[allAnimKeys[randomIndex]];
    }
    
    if (newAction && newAction !== currentActionRef.current) {
      if (currentActionRef.current) {
        currentActionRef.current.fadeOut(0.5);
      }
      
      // Slow down fast animations by setting timeScale
      const duration = newAction.getClip().duration;
      if (duration < 2) {
        newAction.setEffectiveTimeScale(0.49); // Slow down animations shorter than 2 seconds (was 0.7, now 30% slower)
      } else if (duration < 3) {
        newAction.setEffectiveTimeScale(0.595); // Slightly slow down animations shorter than 3 seconds (was 0.85, now 30% slower)
      } else {
        newAction.setEffectiveTimeScale(0.7); // Normal speed for longer animations (was 1.0, now 30% slower)
      }
      
      newAction.reset().fadeIn(0.5).play();
      
      currentActionRef.current = newAction;
      
      // Switch to another animation when current one finishes
      const adjustedDuration = duration / newAction.getEffectiveTimeScale();
      setTimeout(() => {
        setTalkIndex(prev => prev + 1);
      }, adjustedDuration * 1000);
    }
  }, [section, talkIndex]);
  
  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    
    // Update animation mixer
    mixer.update(delta);
    
    if (groupRef.current) {
      groupRef.current.position.x = 3.2;
      groupRef.current.position.z = -2.0;
      groupRef.current.position.y = 0;
      
      // Make avatar always face the camera
      const camera = state.camera;
      groupRef.current.lookAt(camera.position);
      
      // Add slight head turn for natural movement
      const headTurn = Math.sin(time * 0.4) * 0.05;
      groupRef.current.rotation.y += headTurn;
    }
  });
  
  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    
    // Update animation mixer
    mixer.update(delta);
    
    // Rotation - angled 20 degrees back from forward
    const headTurn = Math.sin(time * 0.4) * 0.05;
    const baseRotation = Math.PI * 0.11; // ~20 degrees (20/180 ≈ 0.11)
    const targetRotation = baseRotation + headTurn;
    
    const lerpFactor = 0.06;
    
    if (groupRef.current) {
      groupRef.current.position.x = 3.2;
      groupRef.current.position.z = -2.0;
      groupRef.current.position.y = 0;
      
      groupRef.current.rotation.y += (targetRotation - groupRef.current.rotation.y) * lerpFactor;
    }
  });
  
  return (
    <group 
      ref={groupRef} 
      position={[3.5, 0, -2]}
      onClick={(e) => {
        e.stopPropagation();
        onAvatarClick?.();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'default';
      }}
    >
      <primitive object={avatarScene} scale={[1, 1, 1]} />
    </group>
  );
}

// 3D Teacher Character
// Teacher's Desk
function TeacherDesk() {
  return (
    <group position={[3, 0, -0.5]}>
      <Box args={[1.5, 0.05, 0.8]} position={[0, 0.75, 0]}>
        <meshStandardMaterial color="#8B4513" roughness={0.7} metalness={0.1} />
      </Box>
      <Box args={[0.08, 0.75, 0.08]} position={[-0.7, 0.375, -0.35]}>
        <meshStandardMaterial color="#654321" />
      </Box>
      <Box args={[0.08, 0.75, 0.08]} position={[0.7, 0.375, -0.35]}>
        <meshStandardMaterial color="#654321" />
      </Box>
      <Box args={[0.08, 0.75, 0.08]} position={[-0.7, 0.375, 0.35]}>
        <meshStandardMaterial color="#654321" />
      </Box>
      <Box args={[0.08, 0.75, 0.08]} position={[0.7, 0.375, 0.35]}>
        <meshStandardMaterial color="#654321" />
      </Box>
      
      <Box args={[0.4, 0.02, 0.3]} position={[-0.3, 0.78, 0]} rotation={[0, -0.3, 0]}>
        <meshStandardMaterial color="#2d3748" />
      </Box>
      
      {/* Laptop/PC on desk - clickable */}
      <group 
        position={[-0.3, 0.78, 0]} 
        rotation={[0, -0.3, 0]}
        onClick={(e) => {
          e.stopPropagation();
          navigator.clipboard.writeText('gary@codeedai.com').then(() => {
            console.log('Email copied to clipboard!');
          });
          window.location.href = 'mailto:gary@codeedai.com';
        }}
        onPointerOver={(e) => { 
          document.body.style.cursor = 'pointer';
          e.object.scale.set(1.1, 1.1, 1.1);
        }}
        onPointerOut={(e) => { 
          document.body.style.cursor = 'default';
          e.object.scale.set(1, 1, 1);
        }}
      >
        {/* Laptop base */}
        <Box args={[0.35, 0.015, 0.25]} position={[0, 0.015, 0]}>
          <meshStandardMaterial color="#1E293B" metalness={0.6} roughness={0.3} />
        </Box>
        {/* Laptop screen */}
        <Box args={[0.35, 0.25, 0.015]} position={[0, 0.15, -0.12]} rotation={[-0.2, 0, 0]}>
          <meshStandardMaterial color="#0F172A" emissive="#0EA5E9" emissiveIntensity={0.5} />
        </Box>
      </group>
      
      {/* Telephone on desk - clickable */}
      <group 
        position={[0.4, 0.78, 0.15]} 
        onClick={(e) => {
          e.stopPropagation();
          window.location.href = 'tel:+447447665672';
        }}
        onPointerOver={(e) => { 
          document.body.style.cursor = 'pointer';
          e.object.scale.set(1.1, 1.1, 1.1);
        }}
        onPointerOut={(e) => { 
          document.body.style.cursor = 'default';
          e.object.scale.set(1, 1, 1);
        }}
      >
        {/* Phone base */}
        <Box args={[0.08, 0.03, 0.12]}>
          <meshStandardMaterial color="#1E293B" />
        </Box>
        {/* Phone handset */}
        <Cylinder args={[0.015, 0.015, 0.1]} position={[0, 0.03, 0]} rotation={[0, 0, Math.PI / 6]}>
          <meshStandardMaterial color="#334155" />
        </Cylinder>
      </group>
      
      <Box args={[0.4, 0.3, 0.02]} position={[-0.3, 0.93, -0.15]} rotation={[-0.2, -0.3, 0]}>
        <meshStandardMaterial color="#1a202c" emissive="#0EA5E9" emissiveIntensity={0.3} />
      </Box>
      
      <Cylinder args={[0.05, 0.06, 0.12]} position={[0.3, 0.84, 0.2]}>
        <meshStandardMaterial color="#EF4444" />
      </Cylinder>
      
      <Box args={[0.15, 0.2, 0.25]} position={[0.5, 0.88, -0.2]}>
        <meshStandardMaterial color="#3B82F6" />
      </Box>
      <Box args={[0.15, 0.2, 0.25]} position={[0.6, 0.88, -0.2]} rotation={[0, 0.2, 0]}>
        <meshStandardMaterial color="#10B981" />
      </Box>
    </group>
  );
}

// Student Desks
function StudentDesk({ position }) {
  return (
    <group position={position}>
      <Box args={[0.8, 0.03, 0.6]} position={[0, 0.65, 0]}>
        <meshStandardMaterial color="#D4A574" roughness={0.7} metalness={0.1} />
      </Box>
      <Cylinder args={[0.02, 0.02, 0.65]} position={[-0.35, 0.325, -0.25]}>
        <meshStandardMaterial color="#718096" metalness={0.8} roughness={0.2} />
      </Cylinder>
      <Cylinder args={[0.02, 0.02, 0.65]} position={[0.35, 0.325, -0.25]}>
        <meshStandardMaterial color="#718096" metalness={0.8} roughness={0.2} />
      </Cylinder>
      <Cylinder args={[0.02, 0.02, 0.65]} position={[-0.35, 0.325, 0.25]}>
        <meshStandardMaterial color="#718096" metalness={0.8} roughness={0.2} />
      </Cylinder>
      <Cylinder args={[0.02, 0.02, 0.65]} position={[0.35, 0.325, 0.25]}>
        <meshStandardMaterial color="#718096" metalness={0.8} roughness={0.2} />
      </Cylinder>
    </group>
  );
}

// Classroom Environment
function Classroom({ section, onPhoneClick, onEnvelopeClick, isDarkMode, expandedCard, onCardExpand, onAvatarClick }) {
  return (
    <group>
      <Plane args={[15, 10]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <meshStandardMaterial color="#E2E8F0" roughness={0.9} />
      </Plane>
      
      <Plane args={[15, 6]} position={[0, 3, -3]} rotation={[0, 0, 0]}>
        <meshStandardMaterial color="#F1F5F9" roughness={0.9} />
      </Plane>
      
      {/* Left wall */}
      <Plane args={[10, 6]} position={[-7.5, 3, 2]} rotation={[0, Math.PI / 2, 0]}>
        <meshStandardMaterial color="#F8FAFC" roughness={0.9} />
      </Plane>
      
      <Plane args={[15, 10]} rotation={[Math.PI / 2, 0, 0]} position={[0, 6, 0]}>
        <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
      </Plane>
      
      <Whiteboard 
        section={section} 
        isDarkMode={isDarkMode}
        expandedCard={expandedCard}
        onCardExpand={onCardExpand}
      />
      
      <Suspense fallback={null}>
        <TeachingTeacher section={section} onAvatarClick={onAvatarClick} />
      </Suspense>
      <TeacherDesk />
      
      <StudentDesk position={[-2.5, 0, 1.5]} />
      <StudentDesk position={[-1, 0, 1.5]} />
      <StudentDesk position={[0.5, 0, 1.5]} />
      
      <StudentDesk position={[-2.5, 0, 3]} />
      <StudentDesk position={[-1, 0, 3]} />
      <StudentDesk position={[0.5, 0, 3]} />
      
      <group position={[-7.4, 3, -1]}>
        <Box args={[0.1, 2.5, 1.8]}>
          <meshStandardMaterial color="#94A3B8" metalness={0.3} roughness={0.4} />
        </Box>
        <Plane args={[1.8, 2.3]} position={[0.1, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <meshStandardMaterial color="#87CEEB" transparent opacity={0.4} />
        </Plane>
      </group>
      
      <group position={[-7.4, 3, 1.5]}>
        <Box args={[0.1, 2.5, 1.8]}>
          <meshStandardMaterial color="#94A3B8" metalness={0.3} roughness={0.4} />
        </Box>
        <Plane args={[1.8, 2.3]} position={[0.1, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <meshStandardMaterial color="#87CEEB" transparent opacity={0.4} />
        </Plane>
      </group>
      
      <Box args={[1, 1.2, 0.02]} position={[-2.5, 3, -2.95]}>
        <meshStandardMaterial color="#3B82F6" />
      </Box>
      <Box args={[1, 1.2, 0.02]} position={[2.5, 3, -2.95]}>
        <meshStandardMaterial color="#10B981" />
      </Box>
    </group>
  );
}

// Dynamic Camera Controller with varied angles
function CameraController({ section, isMobile, showAvatar }) {
  const { camera } = useThree();
  
  useFrame(() => {
    // Adjust camera positions for mobile + avatar visibility
    const mobileAdjust = isMobile ? 0.5 : 0; // Extra distance on mobile for full board view
    const mobileAvatarAdjust = (isMobile && showAvatar) ? 1.5 : 0; // Additional pull back if avatar shown
    
    const cameraPositions = [
      { pos: [0, 2.2, 6 + mobileAdjust + mobileAvatarAdjust], lookAt: [0, 2.2, -2.9] },     // 0: Home - head-on, board fills screen width
      { pos: [1.5, 1.7, 4.5 + mobileAdjust + mobileAvatarAdjust], lookAt: [0, 1.5, 0] },    // 1: Services - slight angle, full view
      { pos: [0.8, 1.8, 4.8 + mobileAdjust + mobileAvatarAdjust], lookAt: [0, 1.5, 0] },    // 2: Training - centered, full view
      { pos: [-0.8, 1.8, 4.8 + mobileAdjust + mobileAvatarAdjust], lookAt: [0, 1.5, 0] },   // 3: Pricing - opposite angle, full view
      { pos: [-1.5, 1.7, 4.5 + mobileAdjust + mobileAvatarAdjust], lookAt: [0, 1.5, 0] },   // 4: What You Can Build - left angle, full view
      { pos: [0, 1.9, 5 + mobileAdjust + mobileAvatarAdjust], lookAt: [0, 1.5, 0] }         // 5: Contact - centered elevated, full view
    ];
    
    const target = cameraPositions[section] || cameraPositions[0];
    
    // Smoother transition - slower lerp for home/services transition
    const lerpFactor = (section === 0 || section === 1) ? 0.02 : 0.04;
    
    camera.position.x += (target.pos[0] - camera.position.x) * lerpFactor;
    camera.position.y += (target.pos[1] - camera.position.y) * lerpFactor;
    camera.position.z += (target.pos[2] - camera.position.z) * lerpFactor;
    
    // Keep camera locked on board center - no drift
    const lookAtTarget = new THREE.Vector3(...target.lookAt);
    camera.lookAt(lookAtTarget);
  });
  
  return null;
}

// Contact Popup Modal
function ContactPopup({ type, onClose }) {
  const isMobile = window.innerWidth < 768;
  
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        animation: 'fadeIn 0.3s ease',
        padding: isMobile ? '1rem' : '2rem'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: 'white',
          borderRadius: isMobile ? '15px' : '20px',
          padding: isMobile ? '1.5rem' : '3rem',
          maxWidth: '500px',
          width: '100%',
          maxHeight: isMobile ? '90vh' : 'auto',
          overflowY: 'auto',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          animation: 'slideUp 0.3s ease',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: isMobile ? '0.5rem' : '1rem',
            right: isMobile ? '0.5rem' : '1rem',
            background: 'none',
            border: 'none',
            fontSize: isMobile ? '1.5rem' : '2rem',
            cursor: 'pointer',
            color: '#64748B',
            lineHeight: 1,
            padding: '0.5rem',
            zIndex: 1
          }}
        >
          ×
        </button>
        
        <div style={{ textAlign: 'center', marginBottom: isMobile ? '1.5rem' : '2rem' }}>
          <div style={{ fontSize: isMobile ? '3rem' : '4rem', marginBottom: isMobile ? '0.5rem' : '1rem' }}>
            {type === 'phone' ? '📞' : '📧'}
          </div>
          <h2 style={{
            fontSize: isMobile ? '1.5rem' : '2rem',
            color: '#0EA5E9',
            marginBottom: '0.5rem',
            fontWeight: 700
          }}>
            {type === 'phone' ? 'Call Us' : 'Email Us'}
          </h2>
          <p style={{
            color: '#64748B',
            fontSize: isMobile ? '0.95rem' : '1.1rem'
          }}>
            Get in touch with CodeEdAI
          </p>
        </div>
        
        {type === 'phone' ? (
          <div style={{
            background: 'linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)',
            padding: isMobile ? '1.25rem' : '2rem',
            borderRadius: isMobile ? '12px' : '15px',
            textAlign: 'center'
          }}>
            <div style={{
              color: 'white',
              fontSize: isMobile ? '0.75rem' : '0.9rem',
              marginBottom: '0.5rem',
              opacity: 0.9,
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              Phone Number
            </div>
            <a 
              href="tel:+447447665672"
              style={{
                color: 'white',
                fontSize: isMobile ? '1.5rem' : '2rem',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'block',
                marginBottom: isMobile ? '0.75rem' : '1rem'
              }}
            >
              07447 665672
            </a>
            <a
              href="tel:+447447665672"
              style={{
                display: 'inline-block',
                background: 'white',
                color: '#0EA5E9',
                padding: isMobile ? '0.75rem 1.5rem' : '1rem 2rem',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: 600,
                marginTop: isMobile ? '0.5rem' : '1rem',
                fontSize: isMobile ? '0.95rem' : '1rem'
              }}
            >
              📞 Call Now
            </a>
          </div>
        ) : (
          <div style={{
            background: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
            padding: isMobile ? '1.25rem' : '2rem',
            borderRadius: isMobile ? '12px' : '15px',
            textAlign: 'center'
          }}>
            <div style={{
              color: 'white',
              fontSize: isMobile ? '0.75rem' : '0.9rem',
              marginBottom: '0.5rem',
              opacity: 0.9,
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              Email Address
            </div>
            <a 
              href="mailto:gary@codeedai.com"
              style={{
                color: 'white',
                fontSize: isMobile ? '1.2rem' : '1.8rem',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'block',
                marginBottom: isMobile ? '0.75rem' : '1rem',
                wordBreak: 'break-word'
              }}
            >
              gary@codeedai.com
            </a>
            <a
              href="mailto:gary@codeedai.com"
              style={{
                display: 'inline-block',
                background: 'white',
                color: '#F59E0B',
                padding: isMobile ? '0.75rem 1.5rem' : '1rem 2rem',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: 600,
                marginTop: isMobile ? '0.5rem' : '1rem',
                fontSize: isMobile ? '0.95rem' : '1rem'
              }}
            >
              📧 Send Email
            </a>
          </div>
        )}
        
        <div style={{
          marginTop: isMobile ? '1.25rem' : '2rem',
          padding: isMobile ? '1rem' : '1.5rem',
          background: '#F8FAFC',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <p style={{
            color: '#475569',
            fontSize: isMobile ? '0.85rem' : '0.95rem',
            lineHeight: 1.6,
            margin: 0
          }}>
            <strong style={{ color: '#0EA5E9' }}>⚡ Quick Response:</strong><br/>
            We respond to all enquiries within 24 hours (Monday-Friday)
          </p>
        </div>
      </div>
    </div>
  );
}

// Loading Screen Component (inside Canvas)
function Loader() {
  const { progress } = useProgress();
  const isMobile = window.innerWidth < 768;
  
  return (
    <Html center>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: isMobile ? '15px' : '20px',
        padding: isMobile ? '24px 20px' : '40px',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: isMobile ? '12px' : '16px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
        backdropFilter: 'blur(10px)',
        minWidth: isMobile ? '280px' : '300px',
        maxWidth: isMobile ? '90vw' : '400px',
        margin: '0 auto'
      }}>
        <div style={{ fontSize: isMobile ? '2.5rem' : '3rem' }}>🎓</div>
        
        <h1 style={{
          fontSize: isMobile ? '1.5rem' : '2rem',
          background: 'linear-gradient(135deg, #0EA5E9, #10B981)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: 0,
          fontWeight: 700,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          textAlign: 'center'
        }}>
          Code Ed Ai
        </h1>
        
        <div style={{ width: '100%', textAlign: 'center' }}>
          <div style={{
            width: '100%',
            height: isMobile ? '6px' : '8px',
            background: '#E5E7EB',
            borderRadius: '4px',
            overflow: 'hidden',
            marginBottom: '10px'
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #0EA5E9, #10B981)',
              borderRadius: '4px',
              transition: 'width 0.3s ease'
            }} />
          </div>
          
          <p style={{
            color: '#64748B',
            fontSize: isMobile ? '0.9rem' : '1rem',
            margin: 0,
            fontWeight: 500,
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            Loading... {Math.round(progress)}%
          </p>
        </div>
      </div>
    </Html>
  );
}

// Main App Component
export default function ClassroomShowcase() {
  const [section, setSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showContactPopup, setShowContactPopup] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const [isMuted, setIsMuted] = useState(true); // Default to muted
  const [showSettings, setShowSettings] = useState(false);
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  
  // Audio refs for each section
  const audioRefs = useRef([]);
  
  // Initialize audio elements
  useEffect(() => {
    audioRefs.current = [
      new Audio(`${BASE_URL}Section0.m4a`),
      new Audio(`${BASE_URL}Section1.m4a`),
      new Audio(`${BASE_URL}Section2.m4a`),
      new Audio(`${BASE_URL}Section3.m4a`),
      new Audio(`${BASE_URL}Section4.m4a`),
      new Audio(`${BASE_URL}Section5.m4a`)
    ];
    
    // Cleanup on unmount
    return () => {
      audioRefs.current.forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, []);
  
  // Play audio when section changes
  useEffect(() => {
    if (!audioRefs.current.length) return;
    
    // Stop all audio immediately if muted
    if (isMuted) {
      audioRefs.current.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
      return;
    }
    
    // Stop all audio
    audioRefs.current.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
    
    // Play current section audio
    const currentAudio = audioRefs.current[section];
    if (currentAudio) {
      currentAudio.play().catch(err => {
        console.log('Audio playback failed:', err);
      });
    }
  }, [section, isMuted]);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Remove artificial loading delay - assets will load naturally
    const bubbleTimer = setTimeout(() => setShowSpeechBubble(true), 5000);
    const hideBubbleTimer = setTimeout(() => setShowSpeechBubble(false), 15000);
    
    return () => {
      clearTimeout(bubbleTimer);
      clearTimeout(hideBubbleTimer);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = window.scrollY / scrollHeight;
      setScrollProgress(progress);
      
      const newSection = Math.floor(progress * 6);
      setSection(Math.min(newSection, 5));
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div style={{
      width: '100vw',
      height: '600vh',
      position: 'relative',
      background: '#F8FAFC',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      WebkitOverflowScrolling: 'touch',
      overflowY: 'auto'
    }}>
      {/* Fixed Canvas */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        zIndex: 1
      }}>
        <Canvas
          camera={{ position: [0, 2, 3.5], fov: isMobile ? 75 : 50 }}
          dpr={[1, 2]}
          performance={{ min: 0.5 }}
          style={{ pointerEvents: 'auto' }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[-5, 5, 5]} intensity={0.8} />
          <pointLight position={[0, 4, 0]} intensity={0.3} color="#FEF3C7" />
          <pointLight position={[-7, 3, 0]} intensity={0.5} color="#E0F2FE" />
          <pointLight position={[3, 2, 0]} intensity={0.6} color="#FBBF24" />
          
          <Classroom 
            section={section}
            onPhoneClick={() => setShowContactPopup('phone')}
            onEnvelopeClick={() => setShowContactPopup('email')}
            isDarkMode={isDarkMode}
            expandedCard={expandedCard}
            onCardExpand={setExpandedCard}
            onAvatarClick={() => {
              setIsMuted(false);
              // Show brief notification
              const notification = document.getElementById('avatar-unmute-notification');
              if (notification) {
                notification.style.display = 'block';
                setTimeout(() => {
                  notification.style.display = 'none';
                }, 2000);
              }
            }}
          />
          
          <CameraController section={section} isMobile={isMobile} showAvatar={true} />
        </Canvas>
      </div>
      
      {/* UI Overlay */}
      {/* Progress Bar - All screen sizes */}
      <>
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: '#E2E8F0',
            zIndex: 2
          }}>
            <div style={{
              width: `${scrollProgress * 100}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #0EA5E9 0%, #10B981 100%)',
              transition: 'width 0.3s ease'
            }} />
          </div>
          
          {/* Settings Button */}
          <button
            onClick={() => {
              setShowSettings(!showSettings);
              setShowSpeechBubble(false);
            }}
            style={{
              position: 'fixed',
              top: '1rem',
              right: '1rem',
              zIndex: 4,
              background: showSettings ? '#3B82F6' : '#ffffff',
              border: '2px solid ' + (showSettings ? '#2563EB' : '#E2E8F0'),
              borderRadius: '50%',
              width: '3rem',
              height: '3rem',
              cursor: 'pointer',
              fontSize: '1.25rem',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              WebkitTapHighlightColor: 'transparent',
              transition: 'all 0.3s ease',
              animation: showSpeechBubble ? 'pulse 2s infinite' : 'none'
            }}
          >
            {showSettings ? '✕' : '⚙️'}
          </button>

          {/* Speech Bubble Hint */}
          {showSpeechBubble && !showSettings && (
            <div style={{
              position: 'fixed',
              top: '4.5rem',
              right: '1rem',
              zIndex: 3,
              background: '#3B82F6',
              color: 'white',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              fontSize: '0.85rem',
              fontWeight: 500,
              boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)',
              maxWidth: '200px',
              animation: 'slideDown 0.3s ease',
              cursor: 'pointer'
            }}
            onClick={() => {
              setShowSettings(true);
              setShowSpeechBubble(false);
            }}
            >
              💡 Switch to basic website or turn audio on here!
              <div style={{
                position: 'absolute',
                top: '-8px',
                right: '20px',
                width: 0,
                height: 0,
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderBottom: '8px solid #3B82F6'
              }} />
            </div>
          )}

          {/* Settings Panel */}
          {showSettings && (
            <div style={{
              position: 'fixed',
              top: '4.5rem',
              right: '1rem',
              zIndex: 3,
              background: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
              minWidth: '280px',
              animation: 'slideDown 0.3s ease'
            }}>
              <h3 style={{
                margin: '0 0 1rem 0',
                fontSize: '1.1rem',
                color: '#1E293B',
                fontWeight: 600
              }}>Code Ed Ai Experience</h3>
              
              {/* Audio Control */}
              <div style={{
                padding: '0.75rem',
                marginBottom: '0.75rem',
                background: '#F8FAFC',
                borderRadius: '8px',
                cursor: 'pointer',
                border: '2px solid ' + (isMuted ? '#E2E8F0' : '#10B981'),
                transition: 'all 0.3s ease'
              }}
              onClick={() => setIsMuted(!isMuted)}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#1E293B', marginBottom: '0.25rem' }}>
                      {isMuted ? '🔇' : '🔊'} Voice Narration
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                      {isMuted ? 'Click to enable audio' : 'Audio playing'}
                    </div>
                  </div>
                  <div style={{
                    width: '40px',
                    height: '24px',
                    background: isMuted ? '#CBD5E1' : '#10B981',
                    borderRadius: '12px',
                    position: 'relative',
                    transition: 'background 0.3s ease'
                  }}>
                    <div style={{
                      width: '18px',
                      height: '18px',
                      background: 'white',
                      borderRadius: '50%',
                      position: 'absolute',
                      top: '3px',
                      left: isMuted ? '3px' : '19px',
                      transition: 'left 0.3s ease',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }} />
                  </div>
                </div>
              </div>

              {/* Dark Mode Toggle */}
              <div style={{
                padding: '0.75rem',
                marginBottom: '0.75rem',
                background: '#F8FAFC',
                borderRadius: '8px',
                cursor: 'pointer',
                border: '2px solid #E2E8F0',
                transition: 'all 0.3s ease'
              }}
              onClick={() => setIsDarkMode(!isDarkMode)}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#1E293B', marginBottom: '0.25rem' }}>
                      {isDarkMode ? '⬜' : '⬛'} Board Color
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                      {isDarkMode ? 'White board' : 'Black board'}
                    </div>
                  </div>
                  <div style={{
                    width: '40px',
                    height: '24px',
                    background: isDarkMode ? '#1F2937' : '#E2E8F0',
                    borderRadius: '12px',
                    position: 'relative',
                    transition: 'background 0.3s ease'
                  }}>
                    <div style={{
                      width: '18px',
                      height: '18px',
                      background: 'white',
                      borderRadius: '50%',
                      position: 'absolute',
                      top: '3px',
                      left: isDarkMode ? '19px' : '3px',
                      transition: 'left 0.3s ease',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }} />
                  </div>
                </div>
              </div>

              {/* Basic Website Link */}
              <a
                href={`${BASE_URL}basic.html`}
                style={{
                  display: 'block',
                  padding: '0.75rem',
                  background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                  color: 'white',
                  borderRadius: '8px',
                  textAlign: 'center',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 8px rgba(245, 158, 11, 0.3)';
                }}
              >
                📄 Switch to Basic Website
              </a>
            </div>
          )}
          
          {/* Avatar Click Notification */}
          <div 
            id="avatar-unmute-notification"
            style={{
              position: 'fixed',
              bottom: '6rem',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 3,
              background: 'rgba(16, 185, 129, 0.95)',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: 600,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              display: 'none',
              animation: 'slideUp 0.3s ease'
            }}
          >
            🔊 Voice narration enabled! Click the avatar again to hear him speak.
          </div>
          
          {/* Bottom Navigation - Fixed on all screen sizes */}
          <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderTop: '1px solid #E2E8F0',
            padding: '0.75rem 1rem',
            zIndex: 2,
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            boxShadow: '0 -4px 24px rgba(0, 0, 0, 0.1)',
            WebkitTapHighlightColor: 'transparent'
          }}>
            {['Home', 'Services', 'Training', 'Pricing', 'Examples', 'Contact'].map((name, i) => (
              <div
                key={i}
                onClick={() => {
                  const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
                  const targetScroll = (i / 5) * totalHeight;
                  window.scrollTo({ top: targetScroll, behavior: 'smooth' });
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontSize: '0.75rem',
                  color: section === i ? '#000000' : '#1F2937',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: '0.4rem 0.2rem',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease',
                  userSelect: 'none',
                  WebkitTapHighlightColor: 'transparent',
                  flex: 1,
                  textAlign: 'center',
                  background: section === i ? 'rgba(14, 165, 233, 0.15)' : 'transparent'
                }}
              >
                <div style={{
                  width: section === i ? '8px' : '5px',
                  height: section === i ? '8px' : '5px',
                  borderRadius: '50%',
                  background: section === i ? '#0EA5E9' : '#CBD5E1',
                  transition: 'all 0.2s ease'
                }} />
                <span style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%'
                }}>
                  {name}
                </span>
              </div>
            ))}
          </div>
      </>
      
      {/* Scroll Instruction - Desktop only */}
      {section === 0 && !isMobile && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          background: 'rgba(15, 23, 42, 0.9)',
          backdropFilter: 'blur(10px)',
          color: 'white',
          padding: '0.75rem 1.5rem',
          borderRadius: '50px',
          fontSize: '0.9rem',
          fontWeight: 500,
          animation: 'bounce 2s infinite'
        }}>
          👇 Scroll down to explore
        </div>
      )}
      
      {/* Contact Popup */}
      {showContactPopup && (
        <ContactPopup 
          type={showContactPopup} 
          onClose={() => setShowContactPopup(null)}
        />
      )}
      
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          overflow-x: hidden;
        }
        
        @keyframes bounce {
          0%, 100% { transform: translate(-50%, 0); }
          50% { transform: translate(-50%, -10px); }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
          }
        }
        
        ::-webkit-scrollbar {
          width: 10px;
        }
        
        ::-webkit-scrollbar-track {
          background: #F1F5F9;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #0EA5E9 0%, #10B981 100%);
          border-radius: 5px;
        }
        
        @media (max-width: 768px) {
          canvas {
            touch-action: none;
          }
          
          body {
            -webkit-overflow-scrolling: touch;
            overscroll-behavior-y: none;
          }
          
          * {
            -webkit-tap-highlight-color: transparent;
            -webkit-touch-callout: none;
          }
        }
      `}</style>
    </div>
  );
}