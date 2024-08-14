"use client";

import { useState, useEffect, useRef } from "react";

enum ComponentState {
  UNMOUNTED = "unmounted",
  ENTERED = "entered",
  EXITING = "exiting",
}

const FadeInOut = ({
  isShown,
  duration = 300,
  children,
  classNames,
}: {
  isShown: boolean;
  duration?: number;
  children: React.ReactNode;
  classNames?: string;
}) => {
  const transitionStyles = {
    unmounted: { transform: "scale(0)" },
    entered: { transform: "scale(1)" },
    exiting: { transform: "scale(0)" },
  };
  const [componentStatus, setComponentStatus] = useState<ComponentState>(
    ComponentState.UNMOUNTED
  );
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isShown) {
      setComponentStatus(ComponentState.ENTERED);
    } else if (componentStatus === ComponentState.ENTERED) {
      setComponentStatus(ComponentState.EXITING);
    }
  }, [isShown, componentStatus]);

  useEffect(() => {
    if (componentStatus === ComponentState.EXITING) {
      timeoutRef.current = setTimeout(() => {
        setComponentStatus(ComponentState.UNMOUNTED);
      }, duration);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [componentStatus, duration]);

  if (componentStatus === ComponentState.UNMOUNTED && !isShown) {
    return null;
  }

  return (
    <div
      className={classNames}
      style={{
        transition: `transform ${duration}ms ease-in-out`,
        ...transitionStyles[componentStatus],
      }}
    >
      {children}
    </div>
  );
};

export default FadeInOut;
