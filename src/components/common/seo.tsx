import { site } from '@/data/site'

interface SeoProps {
  title?: string
  description?: string
  /** Path beginning with "/", used for the canonical URL. */
  path?: string
}

/**
 * Per-route document head. React 19 hoists and de-duplicates <title>,
 * so no head library is needed. Social-preview (OG/Twitter) tags live
 * statically in index.html, since social scrapers don't execute JS, so the
 * static card is the reliable one; this component owns the per-route
 * title, description and canonical for browsers and JS crawlers.
 */
export function Seo({ title, description = site.intro, path = '/' }: SeoProps) {
  const fullTitle = title ? `${title} · ${site.name}` : site.name
  const url = `${site.url}${path}`

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
    </>
  )
}
