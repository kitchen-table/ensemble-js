import invariant from 'ts-invariant';

export function getMyPath(): string {
  return window.location.href;
}

export function parseUserPath(path: string) {
  try {
    const url = new URL(path);

    return url;
  } catch (e) {
    console.warn(path);
    throw e;
  }
}

export function getUrlWithoutHost(url: URL): string {
  return url.pathname + url.search + url.hash;
}

export function isSamePath(path1: URL, path2: URL): boolean {
  return path1.pathname === path2.pathname && path1.hostname === path2.hostname;
}
