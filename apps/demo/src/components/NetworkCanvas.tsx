"use client";

import { useEffect, useRef } from "react";

type NetworkPoint = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

type PointerPoint = {
  x: number;
  y: number;
  active: boolean;
};

export function NetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let points: NetworkPoint[] = [];
    let pointer: PointerPoint = { x: 0, y: 0, active: false };
    let animationFrameId: number;

    function resize() {
      const ratio = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = Math.floor(width * ratio);
      canvas!.height = Math.floor(height * ratio);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(ratio, 0, 0, ratio, 0, 0);

      const count = Math.min(96, Math.max(42, Math.floor((width * height) / 18500)));
      points = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
      }));
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height);

      for (const point of points) {
        point.x += point.vx;
        point.y += point.vy;
        if (point.x < -30) point.x = width + 30;
        if (point.x > width + 30) point.x = -30;
        if (point.y < -30) point.y = height + 30;
        if (point.y > height + 30) point.y = -30;
      }

      const allPoints = pointer.active ? [...points, pointer] : points;
      for (let i = 0; i < allPoints.length; i += 1) {
        const a = allPoints[i];
        for (let j = i + 1; j < allPoints.length; j += 1) {
          const b = allPoints[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance > 230) continue;
          const opacity = (1 - distance / 230) * 0.22;
          ctx!.strokeStyle = `rgba(100, 140, 255, ${opacity})`;
          ctx!.lineWidth = 1;
          ctx!.beginPath();
          ctx!.moveTo(a.x, a.y);
          ctx!.lineTo(b.x, b.y);
          ctx!.stroke();
        }
      }

      for (const point of points) {
        ctx!.fillStyle = "rgba(100, 140, 255, 0.4)";
        ctx!.beginPath();
        ctx!.arc(point.x, point.y, 3, 0, Math.PI * 2);
        ctx!.fill();
      }

      animationFrameId = requestAnimationFrame(draw);
    }

    const handlePointerMove = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY, active: true };
    };

    const handlePointerLeave = () => {
      pointer.active = false;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);

    resize();
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas id="network-canvas" ref={canvasRef} aria-hidden="true"></canvas>;
}
