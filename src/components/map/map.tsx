"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import pinIcon from "../../../public/pin.svg";
import map from "../../../public/salen.png";
import { cn } from "@/lib/utils";
import { NextURL } from "next/dist/server/web/next-url";

type Position = {
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

  // Clamp x and y to the div boundaries
  const clampedX = Math.min(Math.max(x - left, 0), width);
  const clampedY = Math.min(
    Math.max(offsetY ? y - offsetY - top : y - top, 0),
    height,
  );

  return { clampedX, clampedY };
}

type Props = {
  offsetY?: number;
  setUrl?: (url: NextURL | undefined) => void;
};

export default function Map({ setUrl, offsetY = 60 }: Props) {
  const [isMoving, setIsMoving] = useState(false);
  const [current, setCurrent] = useState<Position | undefined>();

  const containerRef = useRef<HTMLDivElement>(null);

  function onEnd(x: number, y: number) {
    if (!containerRef.current) return;

    const { clampedX, clampedY } = getRelativePosition(
      x,
      y,
      containerRef.current,
      offsetY,
    );

    setIsMoving(false);

    if (setUrl) {
      setUrl(new NextURL(`localhost:3000/salen/${clampedX}${clampedY}`));
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
            "select-none pointer-events-none touch-none w-10 h-10 fixed -translate-x-[50%] -translate-y-[115%] ",
            !navigator.webdriver && "transition-transform",
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
        priority
        src={map}
        alt=""
        width={868}
        height={1593}
        className="pointer-events-none select-none touch-none"
      />
    </div>
  );
}
