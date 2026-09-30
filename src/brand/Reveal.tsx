/**
 * Reveal - wraps ONE overlay archetype in the DNA enter/exit: 12f ease-out with a 16px
 * slide + fade, 8f fade out. `start` / `duration` are ABSOLUTE frames of the current
 * timeline (composition frames at the top level, scene-local frames inside a scene).
 * Children position themselves absolutely inside the full-frame layer.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { useReveal } from "./motion";

export type RevealProps = {
  start: number;
  duration: number;
  children: React.ReactNode;
  /** Skip the slide (pure fade), e.g. for full-frame cards. */
  noSlide?: boolean;
};

export const Reveal: React.FC<RevealProps> = ({ start, duration, children, noSlide = false }) => {
  const { visible, opacity, y } = useReveal(start, duration);
  if (!visible) {
    return null;
  }
  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: noSlide ? undefined : `translateY(${y}px)`,
        pointerEvents: "none",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
