import { useEffect } from 'react';

/**
 * Custom React Hook to dynamically manage SEO Meta tags, Page Titles, and Open Graph / Twitter descriptions.
 * This guarantees proper indexing by search engine crawlers and polished social card sharing embeds.
 */
export function useSEO({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  ogType = 'website',
  twitterTitle,
  twitterDescription,
  twitterImage
}) {
  useEffect(() => {
    // 1. Update Document Title
    if (title) {
      document.title = title;
    }

    // Helper utility to safely update or find-and-create metadata tags
    const updateOrCreateMeta = (query, propertyName, attributeName, content) => {
      if (!content) return;
      let element = document.querySelector(query);
      if (!element) {
        // Fallback: If tag isn't declared, let's look by name or property property attribute
        element = document.querySelector(`meta[${attributeName}="${propertyName}"]`);
      }
      if (element) {
        element.setAttribute('content', content);
      } else {
        // Create the tag dynamically in head to support crawler dynamics
        const newMeta = document.createElement('meta');
        newMeta.setAttribute(attributeName, propertyName);
        newMeta.setAttribute('content', content);
        document.head.appendChild(newMeta);
      }
    };

    // 2. Search Engine Description and Keywords
    updateOrCreateMeta('#meta-description', 'description', 'name', description);
    if (keywords) {
      updateOrCreateMeta('meta[name="keywords"]', 'keywords', 'name', keywords);
    }

    // 3. Open Graph (Facebook, Discord, LinkedIn, Slack) Attributes
    const currentUrl = ogUrl || window.location.href;
    const resolvedOgTitle = ogTitle || title;
    const resolvedOgDesc = ogDescription || description;
    const resolvedOgImage = ogImage || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1200';

    updateOrCreateMeta('#meta-og-title', 'og:title', 'property', resolvedOgTitle);
    updateOrCreateMeta('#meta-og-description', 'og:description', 'property', resolvedOgDesc);
    updateOrCreateMeta('#meta-og-url', 'og:url', 'property', currentUrl);
    updateOrCreateMeta('#meta-og-image', 'og:image', 'property', resolvedOgImage);
    updateOrCreateMeta('#meta-og-type', 'og:type', 'property', ogType);

    // 4. Twitter Card Share Attributes
    const resolvedTwitterTitle = twitterTitle || resolvedOgTitle;
    const resolvedTwitterDesc = twitterDescription || resolvedOgDesc;
    const resolvedTwitterImage = twitterImage || resolvedOgImage;

    updateOrCreateMeta('#meta-twitter-title', 'twitter:title', 'name', resolvedTwitterTitle);
    updateOrCreateMeta('#meta-twitter-description', 'twitter:description', 'name', resolvedTwitterDesc);
    updateOrCreateMeta('#meta-twitter-image', 'twitter:image', 'name', resolvedTwitterImage);
    
  }, [
    title,
    description,
    keywords,
    ogTitle,
    ogDescription,
    ogImage,
    ogUrl,
    ogType,
    twitterTitle,
    twitterDescription,
    twitterImage
  ]);
}
