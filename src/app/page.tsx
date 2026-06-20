import { Hero } from "@/components/site/Hero";
import { Philosophy } from "@/components/site/Philosophy";
import { PackageTours } from "@/components/site/PackageTours";
import { Hotels } from "@/components/site/Hotels";
import { Combos } from "@/components/site/Combos";
import { GroupTours } from "@/components/site/GroupTours";
import { About } from "@/components/site/About";
import { Partners } from "@/components/site/Partners";
import { WhyUs } from "@/components/site/WhyUs";
import { Contact } from "@/components/site/Contact";

export default function Home() {
  return (
    <>
      {/* Section order follows the client brief exactly. */}
      <Hero />
      <Philosophy />
      <PackageTours />
      <Hotels />
      <Combos />
      <GroupTours />
      <About />
      <Partners />
      <WhyUs />
      <Contact />
    </>
  );
}
