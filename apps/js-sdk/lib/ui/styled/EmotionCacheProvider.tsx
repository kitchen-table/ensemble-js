import createCache from '@emotion/cache';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { ComponentChildren } from 'preact';
import { useEffect, useState } from 'preact/compat';

export default function EmotionCacheProvider({
  children,
  rootId,
}: {
  rootId: string;
  children: ComponentChildren;
}) {
  const [emotionCache, setEmotionCache] = useState<EmotionCache | null>(null);

  useEffect(() => {
    function setEmotionStyles(shadowRoot: ShadowRoot) {
      setEmotionCache(
        createCache({
          key: rootId,
          container: shadowRoot,
        }),
      );
    }

    const root = document.getElementById(rootId);
    if (root && root.shadowRoot) {
      setEmotionStyles(root.shadowRoot);
    }
  }, []);

  return emotionCache ? <CacheProvider value={emotionCache}>{children}</CacheProvider> : null;
}
