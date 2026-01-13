import { ReactNode, useState, useRef, DragEvent } from 'react';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

export interface CanvasElement {
  id: string;
  type: 'svg' | '3d' | 'image' | 'text' | 'component' | 'html';
  content: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  zIndex: number;
  rotation?: number;
  opacity?: number;
  scale?: number;
  locked?: boolean;
  layer: 'background' | 'middle' | 'foreground';
}

interface CanvasProps {
  children?: ReactNode;
  elements?: CanvasElement[];
  editable?: boolean;
  onElementsChange?: (elements: CanvasElement[]) => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Canvas System - Free positioning layer system
 *
 * Allows adding SVG, 3D models, images, or any content anywhere on the page.
 * Elements can be placed in 3 layers: background, middle, foreground
 *
 * Usage:
 * <Canvas editable={isAdmin}>
 *   <div>Your page content here</div>
 * </Canvas>
 *
 * With custom elements:
 * <Canvas elements={[
 *   { id: '1', type: 'svg', content: '<svg>...</svg>', x: 100, y: 100, zIndex: 1, layer: 'background' }
 * ]} />
 */
export default function Canvas({
  children,
  elements = [],
  editable = false,
  onElementsChange,
  className = '',
  style = {},
}: CanvasProps) {
  const { auth } = usePage<PageProps>().props;
  const [localElements, setLocalElements] = useState<CanvasElement[]>(elements);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  // Check if user can edit (admin)
  const canEdit = editable && auth?.user?.role === 'admin';

  const activeElements = onElementsChange ? elements : localElements;

  const handleDragStart = (e: DragEvent, element: CanvasElement) => {
    if (!canEdit || element.locked) return;

    setDragging(element.id);
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleDragMove = (e: DragEvent) => {
    if (!dragging || !canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - canvasRect.left - dragOffset.x;
    const y = e.clientY - canvasRect.top - dragOffset.y;

    const updatedElements = activeElements.map(el =>
      el.id === dragging
        ? { ...el, x: Math.max(0, x), y: Math.max(0, y) }
        : el
    );

    if (onElementsChange) {
      onElementsChange(updatedElements);
    } else {
      setLocalElements(updatedElements);
    }
  };

  const handleDragEnd = () => {
    setDragging(null);
  };

  // Group elements by layer
  const backgroundElements = activeElements.filter(el => el.layer === 'background').sort((a, b) => a.zIndex - b.zIndex);
  const middleElements = activeElements.filter(el => el.layer === 'middle').sort((a, b) => a.zIndex - b.zIndex);
  const foregroundElements = activeElements.filter(el => el.layer === 'foreground').sort((a, b) => a.zIndex - b.zIndex);

  const renderElement = (element: CanvasElement) => {
    const isDragging = dragging === element.id;

    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: `${element.x}px`,
      top: `${element.y}px`,
      zIndex: element.zIndex,
      opacity: element.opacity ?? 1,
      transform: `rotate(${element.rotation || 0}deg) scale(${element.scale || 1})`,
      cursor: canEdit && !element.locked ? 'move' : 'default',
      pointerEvents: canEdit ? 'auto' : 'none',
      width: element.width,
      height: element.height,
      transition: isDragging ? 'none' : 'all 0.2s ease',
    };

    if (isDragging) {
      baseStyle.boxShadow = '0 0 0 2px hsl(var(--primary))';
    }

    const content = (() => {
      switch (element.type) {
        case 'svg':
          return <span dangerouslySetInnerHTML={{ __html: element.content }} />;
        case '3d':
          return <div dangerouslySetInnerHTML={{ __html: element.content }} />;
        case 'image':
          return <img src={element.content} alt="" style={{ width: '100%', height: '100%', display: 'block' }} />;
        case 'text':
          return <span style={{ whiteSpace: 'nowrap' }}>{element.content}</span>;
        case 'html':
          return <div dangerouslySetInnerHTML={{ __html: element.content }} />;
        case 'component':
          // For React components stored as strings, you'd need to eval them (be careful!)
          return null; // Implement based on your needs
        default:
          return null;
      }
    })();

    return (
      <div
        key={element.id}
        style={baseStyle}
        draggable={canEdit && !element.locked}
        onDragStart={(e) => handleDragStart(e as DragEvent, element)}
        onDragMove={handleDragMove as any}
        onDragEnd={handleDragEnd}
      >
        {content}
      </div>
    );
  };

  return (
    <div
      ref={canvasRef}
      className={`relative w-full ${className}`}
      style={{
        minHeight: '100vh',
        overflow: 'hidden',
        ...style,
      }}
      onMouseMove={handleDragMove as any}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
    >
      {/* Background Layer */}
      <div className="absolute inset-0 pointer-events-none">
        {backgroundElements.map(renderElement)}
      </div>

      {/* Middle Layer - Main Content */}
      <div className="relative z-10">
        {middleElements.map(renderElement)}
        {children}
      </div>

      {/* Foreground Layer */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {foregroundElements.map(renderElement)}
      </div>

      {/* Edit Mode Indicator */}
      {canEdit && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm shadow-lg">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
          </svg>
          Canvas Edit Mode - Drag elements to reposition
        </div>
      )}
    </div>
  );
}

/**
 * Preset Canvas Elements - Ready to use gaming decorations
 */
export const CanvasPresets = {
  // Floating particles
  particles: (count: number = 20): CanvasElement[] =>
    Array.from({ length: count }, (_, i) => ({
      id: `particle-${i}`,
      type: 'svg' as const,
      content: `<svg width="8" height="8" viewBox="0 0 24 24" fill="hsl(var(--primary))" opacity="0.3"><circle cx="12" cy="12" r="4"/></svg>`,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      zIndex: 1,
      layer: 'background' as const,
      opacity: 0.3,
    })),

  // Gaming corner decorations
  corners: (): CanvasElement[] => [
    {
      id: 'corner-tl',
      type: 'svg',
      content: `<svg width="100" height="100" viewBox="0 0 100 100" fill="none" stroke="hsl(var(--primary))" stroke-width="2"><path d="M10 90V10h80"/></svg>`,
      x: 0,
      y: 0,
      zIndex: 2,
      layer: 'background',
      opacity: 0.2,
    },
    {
      id: 'corner-tr',
      type: 'svg',
      content: `<svg width="100" height="100" viewBox="0 0 100 100" fill="none" stroke="hsl(var(--primary))" stroke-width="2"><path d="M90 10v80H10"/></svg>`,
      x: 0,
      y: 0,
      zIndex: 2,
      layer: 'background',
      opacity: 0.2,
    },
  ],

  // Grid overlay
  grid: (): CanvasElement => ({
    id: 'grid-overlay',
    type: 'svg',
    content: `<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M 50 0 L 0 0 0 50" fill="none" stroke="hsl(var(--border))" stroke-width="0.5" opacity="0.3"/></pattern></defs><rect width="100%" height="100%" fill="url(%23grid)" /></svg>`,
    x: 0,
    y: 0,
    zIndex: 0,
    layer: 'background',
    opacity: 0.5,
  }),

  // Floating 3D cube placeholder (use with Three.js/Spline)
  floating3D: (x: number, y: number): CanvasElement => ({
    id: `3d-cube-${x}-${y}`,
    type: '3d',
    content: `<div class="canvas-3d-container" data-model="cube" style="width:100px;height:100px;"></div>`,
    x,
    y,
    zIndex: 5,
    layer: 'foreground',
  }),
};

// Export Canvas Element type for use in other components
export type { CanvasElement };
