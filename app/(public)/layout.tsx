import Navbar from "@/components/Navbar"; 
import FloatingSocial from "@/components/FloatingSocial";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar /> 
      <main>{children}</main>
      <FloatingSocial />
    </>
  );
}