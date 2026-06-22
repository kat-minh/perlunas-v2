import { Hero } from "@/components/site/Hero";
import { Philosophy } from "@/components/site/Philosophy";
import { PackageTours } from "@/components/site/PackageTours";
import { Hotels } from "@/components/site/Hotels";
import { Combos } from "@/components/site/Combos";
import { GroupTours } from "@/components/site/GroupTours";
import { PrivateTour } from "@/components/site/PrivateTour";
import { About } from "@/components/site/About";
import { Partners } from "@/components/site/Partners";
import { WhyUs } from "@/components/site/WhyUs";
import { getPageContentMap } from "@/lib/page-content";
import {
  getTours,
  getHotels,
  getGroupTours,
  getPrivateTours,
  getCities,
} from "@/lib/api";

export const revalidate = 300;

export default async function Home() {
  // One content fetch + the entity collections, lifted to the server page and
  // passed down as props (the section components stay client for animations).
  // The homepage Combos section renders the fixed PROVINCES taxonomy, so it
  // needs no combo entities here (those live on the /combo page).
  const [map, tours, hotels, groupTours, privateTours, cities] = await Promise.all([
    getPageContentMap(),
    getTours(),
    getHotels(),
    getGroupTours(),
    getPrivateTours(),
    getCities(),
  ]);

  return (
    <>
      {/* Section order follows the client brief exactly. */}
      <Hero map={map} />
      <Philosophy map={map} />
      <PackageTours map={map} tours={tours} />
      <Hotels map={map} hotels={hotels} />
      <Combos map={map} cities={cities} />
      <GroupTours map={map} moments={groupTours} />
      <PrivateTour map={map} segments={privateTours} />
      <About map={map} />
      <Partners map={map} />
      <WhyUs map={map} />
    </>
  );
}
