import { useContext, useEffect, useMemo, useState } from "react";
import { ServiceWorkerMessagesContext } from "../contexts/service-worker-messages.context";

export function useVisibilityState() {
  const context = useContext(ServiceWorkerMessagesContext);
  const [nodeClassName, setNodeClassName] = useState<string>("");

  useEffect(() => {
    const subscription = context.visibilityChanged.subscribe((visible) =>
      setNodeClassName(visible ? "" : "chrome-hide")
    );
    () => subscription.unsubscribe();
  }, [context]);

  const visibilityState = useMemo(() => ({ nodeClassName }), [nodeClassName]);

  return visibilityState;
}
