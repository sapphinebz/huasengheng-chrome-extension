export function cleanupAll(cleanups: Function[]) {
  if (cleanups) {
    while (cleanups.length) {
      const fn = cleanups.shift();
      fn && fn();
    }
  }
}
