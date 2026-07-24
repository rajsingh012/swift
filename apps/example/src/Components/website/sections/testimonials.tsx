import { useEffect, useState } from 'react';
import { Avatar } from '@swift/components/Avatar';
import { Badge } from '@swift/components/Badge';
import { Card } from '@swift/components/Card';
import { Carousel } from '@swift/components/Carousel';
import { Divider } from '@swift/components/Divider';
import { Text } from '@swift/components/Text';
import { StarFilled } from '@swift/icons/StarFilled';
import { useInView } from '../../../hooks/useInView';
import manPhoto from '../man.png';

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

function TestimonialCard({ item }: { item: Testimonial }) {
    return (
        <Card
            variant="outlined"
            radius="lg"
            className="flex h-full flex-col gap-5 p-6 sm:p-8"
        >
            <Stars />
            <Text variant="para-md" className="flex-1">
                “{item.quote}”
            </Text>
            <Divider decorative />
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Avatar name={item.name} src={manPhoto} size="md" />
                    <div className="flex flex-col">
                        <Text variant="body-md" fontWeight="semibold">
                            {item.name}
                        </Text>
                        {item.location ? (
                            <Text variant="body-sm" color="muted">
                                {item.location}
                            </Text>
                        ) : null}
                    </div>
                </div>
                {item.stat ? (
                    <Badge
                        variant="success"
                        appearance="soft"
                        pill
                        className="shrink-0 tabular-nums"
                    >
                        {item.stat}
                    </Badge>
                ) : null}
            </div>
        </Card>
    );
}

function TestimonialsSection() {
    const [headRef, inView] = useInView<HTMLDivElement>();

    // Show 3 cards at once on desktop, scaling down to 2 on tablet and 1
    // on mobile so each card keeps a comfortable width.
    const [slidesPerView, setSlidesPerView] = useState(3);
    useEffect(() => {
        const update = () => {
            const w = window.innerWidth;
            if (w < 640) setSlidesPerView(1);
            else if (w < 1024) setSlidesPerView(2);
            else setSlidesPerView(3);
        };
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    return (
        <section id="testimonials" className="bg-surface py-20 text-content">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div
                    ref={headRef}
                    className={`mx-auto max-w-2xl text-center ${
                        inView
                            ? 'animate__animated animate__fadeInUpShort'
                            : 'opacity-0'
                    }`}
                >
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
            </div>

            {/* 3-up carousel — three cards visible at once with a 16px gap. */}
            <div
                className={`mt-14 ${
                    inView
                        ? 'animate__animated animate__fadeInUpShort animate__delay-100'
                        : 'opacity-0'
                }`}
            >
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <Carousel
                        align="start"
                        slidesPerView={slidesPerView}
                        gap={16}
                        loop
                        autoplay
                        autoplayDelay={5000}
                        aria-label="Customer testimonials"
                    >
                        <Carousel.Viewport>
                            <Carousel.Track>
                                {testimonials.map((t) => (
                                    <Carousel.Item key={t.name}>
                                        <TestimonialCard item={t} />
                                    </Carousel.Item>
                                ))}
                            </Carousel.Track>
                        </Carousel.Viewport>
                        <Carousel.Previous />
                        <Carousel.Next />
                        <Carousel.Indicators />
                    </Carousel>
                </div>
            </div>
        </section>
    );
}

export default TestimonialsSection;
