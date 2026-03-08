import Hero from "@/components/Hero"
import Services from "@/components/Services"
import Gallery from "@/components/Gallery"
import PartnerWith from "@/components/PartnerWith"
import CTA from "@/components/CTA"

async function getHeroData() {
  const res = await fetch("http://localhost:3000/api/admin/hero", {
    cache: "no-store",
  });

  return res.json();
}

export default async function Home() {
  const hero = await getHeroData();
  return (
    <main className="w-full overflow-hidden">
      <Hero />
      <Services />
      <Gallery />
      <PartnerWith />
      <CTA />
    </main>
  )
}