import GallerySection from "@/app/(public)/gallery/GallerySection";
import Footer from "@/components/CTA";

export const metadata = {
  title: "gallery | New Extra Smart",
  description: "Pelajari lebih lanjut tentang perjalanan dan misi kami.",
};

export default function GalleryPage() {
  return (
    <>
      <GallerySection />
      <Footer />
    </>
  );
}