import { Reveal } from "./Reveal";
import { LeadButton } from "./LeadButton";
import { SceneImage } from "./SceneImage";

/**
 * Tour riêng tư. Modelled on the client's reference (ảnh4): a centred title then
 * a single row of tall image cards, one per guest segment, and a CTA below that
 * opens the shared enquiry form (service preset to "Tour riêng"). Unlike the
 * reference there is no tab nav — just the images. Photos are placeholder.
 */
const segments = [
  { seed: "perlunas-private-family", label: "Gia đình" },
  { seed: "perlunas-private-couples", label: "Cặp đôi" },
  { seed: "perlunas-private-friends", label: "Nhóm bạn" },
  { seed: "perlunas-private-honeymoon", label: "Trăng mật" },
  { seed: "perlunas-private-solo", label: "Một mình" },
];

export function PrivateTour() {
  return (
    <section id="tour-rieng" className="relative border-t border-[var(--line-soft)] px-6 py-14 sm:px-10 sm:py-20">
      <div className="mx-auto max-w-[100rem]">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-mute">Tour riêng tư</p>
          <h2 className="display mt-5 text-4xl text-ink sm:text-5xl">
            Hành trình may đo cho riêng bạn.
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {segments.map((s, i) => (
            <Reveal key={s.seed} delay={i * 80}>
              <figure className="group relative aspect-[2/3] overflow-hidden">
                <SceneImage
                  seed={s.seed}
                  alt={`Tour riêng — ${s.label}`}
                  w={600}
                  h={900}
                  className="transition-transform duration-[1.5s] ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-5 text-center text-sm uppercase tracking-[0.2em] text-paper">
                  {s.label}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="mt-12 flex justify-center">
            <LeadButton service="Tour riêng">Đề xuất chi tiết</LeadButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
