import { useState } from 'react';
import { Avatar, AvatarGroup } from '@swift/components/Avatar';
import { Badge } from '@swift/components/Badge';
import { Button } from '@swift/components/Button';
import { Card } from '@swift/components/Card';
import { Divider } from '@swift/components/Divider';
import { Text } from '@swift/components/Text';
import { ArrowRight } from '@swift/icons/ArrowRight';
import { PlayFilled } from '@swift/icons/PlayFilled';
import { StarFilled } from '@swift/icons/StarFilled';
import { useInView } from '../../../hooks/useInView';

const YOUTUBE_ID = 'F4-jWvyzXkM';

const reviewers = [
    'Mahendra Thakre',
    'Santosh Singh',
    'Sudhakar Shukla',
    'Samir Patil',
    'Priya Sharma',
    'Rajesh Menon',
];

function Stars({ size = 16 }: { size?: number }) {
    return (
        <div
            className="flex items-center gap-0.5 text-[#f59e0b]"
            aria-hidden="true"
        >
            {Array.from({ length: 5 }, (_, i) => (
                <StarFilled key={i} size={size} />
            ))}
        </div>
    );
}

function LiteYouTube({ id, title }: { id: string; title: string }) {
    const [playing, setPlaying] = useState(false);
    const thumbnail = `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;

    return (
        <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-stroke bg-black shadow-level4">
            {playing ? (
                <iframe
                    className="absolute inset-0 h-full w-full"
                    src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            ) : (
                <button
                    type="button"
                    onClick={() => setPlaying(true)}
                    aria-label={`Play video: ${title}`}
                    className="group absolute inset-0 h-full w-full cursor-pointer"
                >
                    <img
                        src={thumbnail}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <span className="absolute inset-0 bg-black/25 transition-colors duration-300 group-hover:bg-black/10" />
                    <span className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-surface-brand/40" />
                        <span className="relative flex h-full w-full items-center justify-center rounded-full bg-surface-brand text-content-on-brand shadow-lg transition-transform duration-300 group-hover:scale-110">
                            <PlayFilled size={30} className="ml-1" />
                        </span>
                    </span>
                </button>
            )}
        </div>
    );
}

function StorySection() {
    const [ref, inView] = useInView<HTMLDivElement>();

    return (
        <section
            id="story"
            className="section-seam relative overflow-hidden py-20 text-content"
        >
            {/* Decorative brand washes */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-surface-brand/10 blur-3xl"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-surface-brand/10 blur-3xl"
            />

            <div
                ref={ref}
                className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8"
            >
                {/* Left — story + rating */}
                <div
                    className={`flex flex-col gap-6 ${
                        inView
                            ? 'animate__animated animate__fadeInLeftShort'
                            : 'opacity-0'
                    }`}
                >
                    <Badge
                        pill
                        variant="info"
                        appearance="soft"
                        className="w-fit uppercase tracking-wider"
                    >
                        Our Story
                    </Badge>
                    <Text variant="heading-lg" fontWeight="bold">
                        See Why India Trusts SolarSquare
                    </Text>
                    <Text variant="para-md" className='text-content-muted'>
                        Watch how we take homeowners from their first rooftop
                        survey to switching on clean, money-saving solar — and hear
                        it straight from the families who made the switch.
                    </Text>

                    <Card
                        variant="elevated"
                        radius="lg"
                        className="flex flex-col gap-4 p-6"
                    >
                        <div className="flex items-center gap-4">
                            <Text
                                variant="heading-xl"
                                fontWeight="bold"
                                className="leading-none"
                            >
                                4.8
                            </Text>
                            <div className="flex flex-col gap-1">
                                <Stars size={18} />
                                <Text variant="body-sm" color="secondary">
                                    Rated by homeowners on Google
                                </Text>
                            </div>
                        </div>

                        <Divider decorative />

                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <AvatarGroup max={4}>
                                {reviewers.map((name) => (
                                    <Avatar key={name} name={name} size="sm" />
                                ))}
                            </AvatarGroup>
                            <Text variant="body-sm" color="secondary">
                                Loved by{' '}
                                <Text
                                    variant="body-sm"
                                    fontWeight="semibold"
                                    color="primary"
                                >
                                    15,000+
                                </Text>{' '}
                                happy families
                            </Text>
                        </div>
                    </Card>

                    <div>
                        <Button variant="primary" size="md" className="!rounded-full">
                            Get a Free Quote
                            <Button.RightIcon>
                                <ArrowRight size={16} />
                            </Button.RightIcon>
                        </Button>
                    </div>
                </div>

                {/* Right — video */}
                <div
                    className={
                        inView
                            ? 'animate__animated animate__fadeInRightShort'
                            : 'opacity-0'
                    }
                >
                    <LiteYouTube
                        id={YOUTUBE_ID}
                        title="See Why India Trusts SolarSquare"
                    />
                </div>
            </div>
        </section>
    );
}

export default StorySection;
