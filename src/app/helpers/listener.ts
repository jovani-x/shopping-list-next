import { useState, useEffect, useRef } from "react";

export const useStreamListener = ({
  dataProps,
  dataName,
  eventName,
  apiEndPoint = "/api/updates",
}: {
  dataProps: unknown[] | null;
  dataName: string;
  eventName: string;
  apiEndPoint?: string;
}) => {
  const [data, setData] = useState(dataProps);
  const refEvSource = useRef<EventSource | null>(null);

  useEffect(() => {
    const onGetData = (event: MessageEvent) => {
      const parsedData = JSON.parse(event.data);
      setData(parsedData[dataName]);
    };

    const closeEvSource = () => {
      if (
        refEvSource?.current &&
        refEvSource.current.readyState !== refEvSource.current.CLOSED
      ) {
        refEvSource.current.removeEventListener(eventName, onGetData);
        refEvSource.current.removeEventListener("error", onError);
        refEvSource.current.close();
        refEvSource.current = null;
      }
    };

    function onError(_event: Event) {
      closeEvSource();
    }

    const run = async () => {
      if (!refEvSource.current) {
        const eventSource = new EventSource(apiEndPoint);
        refEvSource.current = eventSource;

        eventSource.addEventListener(eventName, onGetData);
        eventSource.addEventListener("error", onError);
      }
    };

    run();
    return () => closeEvSource();
  }, [apiEndPoint, eventName, dataName]);

  return data;
};
