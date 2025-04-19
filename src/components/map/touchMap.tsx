"use client";

import { gridSize } from "@/lib/constants";
import { cn } from "@/lib/utils";
import pinIcon from "@public/pin.svg";
import { NextURL } from "next/dist/server/web/next-url";
import Image from "next/image";
import { useRef, useState } from "react";

export type Position = {
  x: number;
  y: number;
};

function getRelativePosition(
  x: number,
  y: number,
  current: HTMLDivElement,
  offsetY?: number,
) {
  const { left, top, width, height } = current.getBoundingClientRect();

  // Calculate relative x and y
  const relativeX = x - left;
  const relativeY = offsetY ? y - offsetY - top : y - top;

  // Clamp x and y to the div boundaries
  const clampedX = Math.min(Math.max(relativeX, 0), width);
  const clampedY = Math.min(Math.max(relativeY, 0), height);

  // Calculate grid indicies
  const snappedX = Math.floor(clampedX / gridSize);
  const snappedY = Math.floor(clampedY / gridSize);

  return { clampedX, clampedY, snappedX, snappedY };
}

type Props = {
  map: string;
  arena?: string;
  generate?: boolean;
  setUrl?: (url: NextURL | undefined) => void;
  points?: Position;
};

export default function TouchMap({
  arena,
  map,
  setUrl,
  generate,
  points,
}: Props) {
  const [isMoving, setIsMoving] = useState(false);
  const [current, setCurrent] = useState<Position | undefined>(points);

  const containerRef = useRef<HTMLDivElement>(null);
  const offsetY = generate ? 0 : 60;

  function onEnd(x: number, y: number) {
    if (!containerRef.current) return;

    const { snappedX, snappedY } = getRelativePosition(
      x,
      y,
      containerRef.current,
      offsetY,
    );

    setIsMoving(false);

    if (setUrl) {
      setUrl(
        new NextURL(`${window.location.href}${arena}/Y${snappedY}X${snappedX}`),
      );
    }
  }

  function onMove(x: number, y: number) {
    if (!containerRef.current) return;

    const { clampedX, clampedY } = getRelativePosition(
      x,
      y,
      containerRef.current,
      offsetY,
    );

    setCurrent({ x: clampedX, y: clampedY });

    if (setUrl) {
      setUrl(undefined);
    }
  }

  return (
    <div
      id="touchzone"
      ref={containerRef}
      className="relative w-full"
      onTouchStart={(e) => {
        setIsMoving(true);
        onMove(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
      }}
      onTouchEnd={(e) =>
        onEnd(e.changedTouches[0].pageX, e.changedTouches[0].pageY)
      }
      onTouchMove={(e) =>
        onMove(e.changedTouches[0].pageX, e.changedTouches[0].pageY)
      }
    >
      <div
        className="absolute w-[10vw] select-none"
        style={{
          top: current?.y,
          left: current?.x,
        }}
      >
        <Image
          priority
          className={cn(
            "pointer-events-none absolute -translate-x-[50%] -translate-y-[115%] touch-none select-none",
            !current && "-translate-y-[4000%]",
            !generate && "transition-transform",
            !generate && isMoving && "-translate-y-[150%]",
          )}
          src={pinIcon}
          alt=""
        />
        <div
          className={cn(
            "h-[1.5vw] w-[1.5vw] -translate-x-[50%] -translate-y-[50%] rounded-full bg-[#E45F53]",
            !current && "hidden",
          )}
        />
      </div>
      <Image
        priority
        src={map}
        alt=""
        width={868}
        height={1593}
        className="pointer-events-none touch-none select-none"
      />
    </div>
  );
}
