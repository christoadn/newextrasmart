import ContactSection from "@/app/(public)/contact/ContactSection";
import Footer from "@/components/CTA";

export const metadata = {
  title: "Contact Us | New Extra Smart",
  description: "Pelajari lebih lanjut tentang perjalanan dan misi kami.",
};

export default function ContactPage() {
  return (
    <>
      <ContactSection />
      <Footer />
    </>
  );
}