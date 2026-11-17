import { useEffect } from "react";

export function usePageMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title;
    let m = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!m) {
      m = document.createElement("meta");
      m.name = "description";
      document.head.appendChild(m);
    }
    m.content = description;
    const og = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
    if (og) og.content = title;
  }, [title, description]);
}
