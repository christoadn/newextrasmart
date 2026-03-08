import AboutSection from "@/app/(public)/about/AboutSection";
import Footer from "@/components/CTA";

export const metadata = {
  title: "About Us | New Extra Smart",
  description: "Pelajari lebih lanjut tentang perjalanan dan misi kami.",
};

export default function AboutPage() {
  return (
    <>
      <AboutSection />  {/* versi dinamis, sudah fetch dari DB */}
      <Footer />
    </>
  );
}