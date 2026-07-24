import { Avatar } from '@swift/components/Avatar';
import { Badge } from '@swift/components/Badge';
import { Card } from '@swift/components/Card';
import { Divider } from '@swift/components/Divider';
import { Text } from '@swift/components/Text';
import { StarFilled } from '@swift/icons/StarFilled';
import { useInView } from '../../../hooks/useInView';

type Testimonial = {
    name: string;
    location?: string;
    quote: string;
    /** Headline savings figure shown as a badge (e.g. "₹4,000 → ₹300"). */
    stat?: string;
    /** TODO: drop in a customer photo URL to replace the initials avatar. */
    avatar?: string;
};

// Verbatim customer reviews from solarsquare.in
const testimonials: Testimonial[] = [
    {
        name: 'Mahendra Thakre',
        quote: 'Electricity bills down from ₹4,000 to ₹300!',
        stat: '₹4,000 → ₹300',
    },
    {
        name: 'Santosh Singh',
        quote:
            'My solar journey with SolarSquare has been smooth and satisfying. Bills dropped from ₹18,000 to ₹0! Timely cleaning ensures 50–55 units generated daily.',
        stat: '₹18,000 → ₹0',
    },
    {
        name: 'Dr. Sudhakar Shukla',
        quote:
            'From consultation to installation, everything was smooth! My plant generates 22–24 units daily, and I’ve seen a 70% drop in electricity bills.',
        stat: '70% lower bills',
    },
    {
        name: 'Samir Patil',
        location: 'Pune',
        quote:
            'SolarSquare truly impressed me. The installation was clean, damage-free, and looked better than others. Overall, a smooth and satisfying experience.',
    },
];

function Stars({ className }: { className?: string }) {
    return (
        <div
            className={`flex items-center gap-0.5 text-[#f59e0b] ${className ?? ''}`}
            aria-hidden="true"
        >
            {Array.from({ length: 5 }, (_, i) => (
                <StarFilled key={i} size={16} />
            ))}
        </div>
    );
}

function TestimonialsSection() {
    const [gridRef, inView] = useInView<HTMLDivElement>();

    return (
        <section id="testimonials" className="bg-surface py-20 text-content">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <Badge
                        pill
                        variant="info"
                        appearance="soft"
                        className="uppercase tracking-wider"
                    >
                        Testimonials
                    </Badge>
                    <Text
                        variant="heading-lg"
                        fontWeight="bold"
                        className="mt-4"
                    >
                        Loved by Homeowners Across India
                    </Text>
                    <Text variant="para-md" color="secondary" className="mt-3">
                        Real families, real savings — hear why homeowners made the
                        switch to solar with us.
                    </Text>
                    <div className="mt-5 flex items-center justify-center gap-2">
                        <Stars />
                        <Text variant="body-sm" color="secondary">
                            4.8 stars on Google · 15,000+ ratings
                        </Text>
                    </div>
                </div>

                <div
                    ref={gridRef}
                    className="mt-14 grid gap-6 md:grid-cols-2"
                >
                    {testimonials.map((t, index) => (
                        <Card
                            key={t.name}
                            variant="outlined"
                            radius="lg"
                            className={`flex h-full flex-col gap-5 p-6 transition-shadow duration-300 hover:shadow-level3 sm:p-8 ${
                                inView
                                    ? 'animate__animated animate__fadeInUpShort'
                                    : 'opacity-0'
                            }`}
                            style={
                                inView
                                    ? { animationDelay: `${index * 150}ms` }
                                    : undefined
                            }
                        >
                            <Stars />
                            <Text variant="para-md" className="flex-1">
                                “{t.quote}”
                            </Text>
                            <Divider decorative />
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <Avatar name={t.name} src={t.avatar} size="md" />
                                    <div className="flex flex-col">
                                        <Text
                                            variant="body-md"
                                            fontWeight="semibold"
                                        >
                                            {t.name}
                                        </Text>
                                        {t.location ? (
                                            <Text variant="body-sm" color="muted">
                                                {t.location}
                                            </Text>
                                        ) : null}
                                    </div>
                                </div>
                                {t.stat ? (
                                    <Badge
                                        variant="success"
                                        appearance="soft"
                                        pill
                                        className="shrink-0 tabular-nums"
                                    >
                                        {t.stat}
                                    </Badge>
                                ) : null}
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default TestimonialsSection;
