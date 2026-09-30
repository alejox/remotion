/**
 * Reveal - wraps ONE overlay archetype in the enter/exit: 20f ease-out with a 32px rise +
 * fade, 10f fade out. `start` / `duration` are ABSOLUTE frames of the current
 * timeline (composition frames at the top level, scene-local frames inside a scene).
 * Children position themselves absolutely inside the full-frame layer.
 * With `staged`, the layer only fades out and each `<Rise>` child enters on its own,
 * staggered line by line.
 */
import React, { createContext, useContext } from "react";
import { AbsoluteFill } from "remotion";
import { exit, staggered, useReveal } from "./motion";

export type RevealProps = {
  start: number;
  duration: number;
  children: React.ReactNode;
  /** Skip the slide (pure fade), e.g. for full-frame cards. */
  noSlide?: boolean;
  /** Children enter one by one through `<Rise>` instead of as a group. */
  staged?: boolean;
};

/** Beat-local frame, provided to `<Rise>` by a staged Reveal. */
const LocalFrame = createContext(0);

export const Reveal: React.FC<RevealProps> = ({ start, duration, children, noSlide = false, staged = false }) => {
  const { visible, local, opacity, y } = useReveal(start, duration);
  if (!visible) {
    return null;
  }
  return (
    <AbsoluteFill
      style={{
        opacity: staged ? exit(local, duration).opacity : opacity,
        transform: noSlide || staged ? undefined : `translateY(${y}px)`,
        pointerEvents: "none"
      }}
    >
      <LocalFrame.Provider value={local}>{children}</LocalFrame.Provider>
    </AbsoluteFill>
  );
};

/** One line (or object) of a staged text block; `index` sets its 5f stagger slot. */
export const Rise: React.FC<{ index: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  index,
  children,
  style,
}) => {
  const e = staggered(useContext(LocalFrame), index);
  return <div style={{ opacity: e.opacity, transform: `translateY(${e.y}px)`, ...style }}>{children}</div>;
};
