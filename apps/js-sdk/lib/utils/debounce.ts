export function debounce<A extends any[]>(callback: (...args: A) => void, ms: number) {
  let timer: number | null = null;
  return (...args: A) => {
    if (timer) {
      window.clearTimeout(timer);
    }
    timer = window.setTimeout(() => {
      callback(...args);
      timer = null;
    }, ms);
  };
}
