import { site } from "@/lib/site";

/** TravelAgency structured data for rich results. */
export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: site.name,
    description: site.description,
    url: site.url,
    telephone: site.phone,
    email: site.email,
    areaServed: { "@type": "Country", name: "Việt Nam" },
    foundingDate: String(site.foundedYear),
    slogan: site.taglineVi,
    sameAs: [site.zalo, site.messenger],
    knowsLanguage: ["vi", "en"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
