import { MutableRefObject } from "react";

export const initStreamListener = ({
  refEvSource,
  setData,
  dataName,
  eventName,
  apiEndPoint = "/api/updates",
}: {
  refEvSource: MutableRefObject<EventSource | null>;
  setData: (data: any) => void;
  dataName: string;
  eventName: string;
  apiEndPoint?: string;
}) => {
  const onGetData = (event: MessageEvent) => {
    const data = JSON.parse(event.data);
    setData(data[dataName]);
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
};
