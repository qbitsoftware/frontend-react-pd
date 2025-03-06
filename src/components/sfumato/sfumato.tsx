import React, { useState, useEffect } from 'react';
import './sfumato.css';

const random = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const Sfumato: React.FC = () => {
  const [blobs, setBlobs] = useState<Array<{
    id: number;
    size: number;
    top: number;
    left: number;
    color1: string;
    color2: string;
  }>>([]);

  useEffect(() => {
    const newBlobs = [];
    // Create 6 blobs with vibrant colors
    for (let i = 0; i < 6; i++) {
      // Use more vibrant, noticeable colors
      const r1 = random(100, 255);
      const g1 = random(100, 255);
      const b1 = random(200, 255); // Emphasize blue
      
      const r2 = random(50, 200);
      const g2 = random(50, 200);
      const b2 = random(180, 255); // Emphasize blue
      
      newBlobs.push({
        id: i,
        size: random(150, 250),
        top: random(0, 200),
        left: random(0, 200),
        color1: `rgba(${r1}, ${g1}, ${b1}, 0.7)`,
        color2: `rgba(${r2}, ${g2}, ${b2}, 0.5)`
      });
    }
    setBlobs(newBlobs);
  }, []);

  return (
    <div className="sfumato-container">
      {blobs.map(blob => (
        <div
          key={blob.id}
          style={{
            position: 'absolute',
            width: `${blob.size}px`,
            height: `${blob.size}px`,
            top: `${blob.top}px`,
            left: `${blob.left}px`,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${blob.color1} 0%, ${blob.color2} 70%, transparent 100%)`,
            filter: 'blur(20px)',
            opacity: 0.8,
            animation: `blobFloat ${random(15, 25)}s ease-in-out infinite alternate`,
            animationDelay: `${random(-5, 0)}s`,
          }}
        />
      ))}
    </div>
  );
};

export default Sfumato;