"use client";

import { gridSize } from "@/lib/constants";
import { cn } from "@/lib/utils";
import pinIcon from "@public/pin.svg";
import { NextURL } from "next/dist/server/web/next-url";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

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

  const relativeX = x - left;
  const relativeY = offsetY ? y - offsetY - top : y - top;

  const clampedX = Math.min(Math.max(relativeX, 0), width);
  const clampedY = Math.min(Math.max(relativeY, 0), height);

  const snappedX = Math.round(clampedX / gridSize);
  const snappedY = Math.round(clampedY / gridSize);

  const clampedXPercentage = clampedX / width;
  const clampedYPercentage = clampedY / height;

  return {
    clampedX: clampedXPercentage,
    clampedY: clampedYPercentage,
    snappedX,
    snappedY,
  };
}

function getAbsolutePosition(
  snappedX: number,
  snappedY: number,
  containerWidth: number,
  containerHeight: number,
) {
  const absoluteX = snappedX * gridSize;
  const absoluteY = snappedY * gridSize;

  return { x: absoluteX / containerWidth, y: absoluteY / containerHeight };
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
  const [current, setCurrent] = useState<Position | undefined>();

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (points && containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setCurrent(getAbsolutePosition(points.x, points.y, width, height));
    }
  }, [points]);
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
        new NextURL(
          `${window.location.origin}/${arena}/Y${snappedY}X${snappedX}`,
        ),
      );
    }
  }

  const onMove = useCallback(
    (x: number, y: number) => {
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
    },
    [setUrl, offsetY],
  );

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
          top: `${(current?.y ?? 0) * 100}%`,
          left: `${(current?.x ?? 0) * 100}%`,
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
