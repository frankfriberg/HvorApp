"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import pinIcon from "../../../public/pin.svg";
import map from "../../../public/salen.png";
import { cn } from "@/lib/utils";

type Position = {
  x: number;
  y: number;
};

const offsetY = 60;

function getRelativePosition(x: number, y: number, current: HTMLDivElement) {
  const { left, top, width, height } = current.getBoundingClientRect();

  // Clamp x and y to the div boundaries
  const clampedX = Math.min(Math.max(x - left, 0), width);
  const clampedY = Math.min(Math.max(y - offsetY - top, 0), height);

  return { clampedX, clampedY };
}

export default function Map() {
  const [isMoving, setIsMoving] = useState(false);
  const [current, setCurrent] = useState<Position | undefined>();
  const [end, setEnd] = useState<Position | undefined>();

  const containerRef = useRef<HTMLDivElement>(null);

  function onEnd(x: number, y: number) {
    if (!containerRef.current) return;

    const { clampedX, clampedY } = getRelativePosition(
      x,
      y,
      containerRef.current,
    );

    setIsMoving(false);
    setEnd({ x: clampedX, y: clampedY });
  }

  function onMove(x: number, y: number) {
    if (!containerRef.current) return;

    const { clampedX, clampedY } = getRelativePosition(
      x,
      y,
      containerRef.current,
    );

    setCurrent({ x: clampedX, y: clampedY });
  }

  return (
    <div className="px-10 touch-none select-none">
      <div
        ref={containerRef}
        className="w-full relative"
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
          className="absolute w-1 select-none"
          style={{
            top: current?.y,
            left: current?.x,
          }}
        >
          <Image
            className={cn(
              "select-none pointer-events-none touch-none w-10 h-10 fixed -translate-x-[50%] -translate-y-[115%] transition-transform",
              !current && "-translate-y-[4000%]",
              isMoving && "-translate-y-[150%]",
            )}
            src={pinIcon}
            alt=""
          />
          <div
            className={cn(
              "w-1.5 h-1.5 bg-[#E45F53] rounded-full -translate-x-[50%] -translate-y-[50%]",
              !current && "hidden",
            )}
          />
        </div>
        <Image
          src={map}
          alt=""
          width={868}
          height={1593}
          className="pointer-events-none select-none touch-none"
        />
      </div>
    </div>
  );
}
