import { useEffect } from "react";

export function useResizeObserver(
  target: React.RefObject<HTMLElement>,
  cb: ResizeObserverCallback
) {
  // Possibly not very efficient to create a new observer instance each time the hook is used.
  const observer = new ResizeObserver(cb);
  if (target.current) observer.observe(target.current);

  useEffect(() => {
    return () => observer.disconnect();
  }, []);
}
