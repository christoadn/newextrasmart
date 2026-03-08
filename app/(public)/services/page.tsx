import ServicesSection from "@/app/(public)/services/ServicesSection";
import Footer from "@/components/CTA";

export const metadata = {
  title: "services | New Extra Smart",
  description: "Pelajari lebih lanjut tentang perjalanan dan misi kami.",
};

export default function ServicesPage() {
  return (
    <>
      <ServicesSection />
      <Footer />
    </>
  );
}