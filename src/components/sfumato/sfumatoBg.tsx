import { useState, useEffect, ReactNode } from 'react';

interface BlobProps {
  id: number;
  size: number;
  top: number;
  left: number;
  color1: string;
  color2: string;
}

interface SfumatoBackgroundProps {
  children: ReactNode;
  className?: string;
}

const SfumatoBackground = ({ children, className = '' }: SfumatoBackgroundProps) => {
  const [blobs, setBlobs] = useState<BlobProps[]>([]);

  const random = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

  useEffect(() => {
    const newBlobs: BlobProps[] = [];
    // Create 6 blobs with vibrant colors
    for (let i = 0; i < 6; i++) {
      // Use more vibrant, noticeable colors
      const r1 = random(100, 255);
      const g1 = random(100, 255);
      const b1 = random(46, 87); // Emphasize green
      
      const r2 = random(50, 200);
      const g2 = random(50, 200);
      const b2 = random(180, 215); // Emphasize blue
      
      newBlobs.push({
        id: i,
        size: random(300, 800),
        top: random(0, 200),
        left: random(0, 200),
        color1: `rgba(${r1}, ${g1}, ${b1}, 0.1)`,
        color2: `rgba(${r2}, ${g2}, ${b2}, 0.1)`
      });
    }
    setBlobs(newBlobs);
  }, []);

  return (
    <div className={`relative w-full h-full overflow-hidden rounded-md shadow-eventCard ${className}`}>
      {/* Sfumato background */}
      <div className="absolute inset-0 w-full h-full bg-gray-50">
        {blobs.map(blob => (
          <div
            key={blob.id}
            className="absolute rounded-full animate-pulse"
            style={{
              width: `${blob.size}px`,
              height: `${blob.size}px`,
              top: `${blob.top}px`,
              left: `${blob.left}px`,
              background: `radial-gradient(circle, ${blob.color1} 0%, ${blob.color2} 70%, transparent 100%)`,
              filter: 'blur(25px)',
              opacity: 0.8,
              animation: `blobFloat ${random(15, 25)}s ease-in-out ${random(-5, 0)}s infinite alternate`,
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
      
    </div>
  );
};

export default SfumatoBackground;