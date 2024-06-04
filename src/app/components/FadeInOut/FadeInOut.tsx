"use client";

import { useState, useEffect, useRef } from "react";

enum ComponentState {
  UNMOUNTED = "unmounted",
  EXITED = "exited",
  ENTERING = "entering",
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
  const mounted = useRef(false);
  const transitionStyles = {
    entering: { transform: "scale(0)" },
    entered: { transform: "scale(1)" },
    exiting: { transform: "scale(0)" },
    exited: { transform: "scale(0)" },
  };

  const [componentStatus, setComponentStatus] = useState(
    ComponentState.UNMOUNTED
  );

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
    }
  }, []);

  useEffect(() => {
    if (isShown) {
      if (
        componentStatus !== ComponentState.ENTERING &&
        componentStatus !== ComponentState.ENTERED
      ) {
        setComponentStatus(ComponentState.ENTERING);
      }
    } else {
      if (
        componentStatus === ComponentState.ENTERING ||
        componentStatus === ComponentState.ENTERED
      ) {
        setComponentStatus(ComponentState.EXITING);
      }
    }
  }, [mounted.current, isShown]);

  useEffect(() => {
    if (componentStatus === ComponentState.ENTERING) {
      setTimeout(() => {
        setComponentStatus(ComponentState.ENTERED);
      }, 50);
    }
    if (componentStatus === ComponentState.EXITING) {
      setTimeout(() => {
        setComponentStatus(ComponentState.EXITED);
      }, duration);
    }

    if (!isShown && componentStatus === ComponentState.EXITED) {
      setComponentStatus(ComponentState.UNMOUNTED);
    }
  }, [componentStatus]);

  return (
    <>
      {componentStatus !== ComponentState.UNMOUNTED && (
        <div
          className={classNames}
          style={{
            transition: `transform ${duration}ms ease-in-out`,
            ...transitionStyles[componentStatus],
          }}
        >
          {children}
        </div>
      )}
    </>
  );
};

export default FadeInOut;
