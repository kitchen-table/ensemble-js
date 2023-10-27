export function throttle<A extends any[]>(callback: (...args: A) => void, ms: number) {
  let timer: number | null = null;
  return (...args: A) => {
    if (timer) {
      return;
    }
    timer = window.setTimeout(() => {
      callback(...args);
      timer = null;
    }, ms);
  };
}
