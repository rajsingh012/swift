import {
    type ComponentType,
    type FormEvent,
    type ReactNode,
    useState,
} from 'react';
import { Text } from '@swift/components/Text';
import { ArrowRight } from '@swift/icons/ArrowRight';
import { CallFilled } from '@swift/icons/CallFilled';
import { FacebookFilled } from '@swift/icons/FacebookFilled';
import { InstagramFilled } from '@swift/icons/InstagramFilled';
import { LinkedinFilled } from '@swift/icons/LinkedinFilled';
import { LocationOnFilled } from '@swift/icons/LocationOnFilled';
import { MailFilled } from '@swift/icons/MailFilled';
import { ScheduleFilled } from '@swift/icons/ScheduleFilled';
import { SendMessageFilled } from '@swift/icons/SendMessageFilled';
import { TwitterFilled } from '@swift/icons/TwitterFilled';

const quickLinks = [
    { label: 'About Us', href: '#story' },
    { label: 'Blog', href: '#blog' },
    { label: 'Solar Calculator', href: '#calculator' },
    { label: 'Careers', href: '#careers' },
    { label: 'FAQs', href: '#faq' },
    { label: 'Contact Us', href: '#quote' },
];

type IconProps = { size?: number };

const contactInfo: { key: string; Icon: ComponentType<IconProps>; text: string }[] = [
    { key: 'phone', Icon: CallFilled, text: '98 3000 3000' },
    { key: 'email', Icon: MailFilled, text: 'welisten@solarsquare.in' },
    {
        key: 'address',
        Icon: LocationOnFilled,
        text: '1101-B, 11th Floor, Suvidha Square, Andheri West, Mumbai 400058',
    },
    { key: 'hours', Icon: ScheduleFilled, text: 'Mon - Sat : 9.00 AM - 7.00 PM' },
];

const socials: { key: string; label: string; href: string; Icon: ComponentType<IconProps> }[] = [
    { key: 'facebook', label: 'Facebook', href: '#', Icon: FacebookFilled },
    { key: 'twitter', label: 'X (Twitter)', href: '#', Icon: TwitterFilled },
    { key: 'linkedin', label: 'LinkedIn', href: '#', Icon: LinkedinFilled },
    { key: 'instagram', label: 'Instagram', href: '#', Icon: InstagramFilled },
];

function FooterHeading({ children }: { children: ReactNode }) {
    return (
        <p className="mb-6 text-lg font-bold text-white">{children}</p>
    );
}

function Footer() {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!email.trim()) return;
        setSubscribed(true);
        setEmail('');
    };

    return (
        <footer className="bg-surface-muted text-content">
            {/* Dark shell with rounded top; the CTA card straddles its top edge */}
            <div className="mt-24 bg-[#161311] px-4 pb-10 pt-px text-white sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    {/* Get in Touch CTA — in normal flow, pulled up to overlap the edge */}
                    <div className="-mt-24 grid overflow-hidden rounded-3xl bg-surface-brand shadow-level3 lg:grid-cols-[1.15fr_1fr]">
                        <div className="flex flex-col gap-6 p-8 sm:p-10 lg:p-12">
                            <Text
                                variant="heading-lg"
                                fontWeight="bold"
                                className="text-content-on-brand"
                            >
                                Get in Touch with Us
                            </Text>
                            <p className="max-w-md leading-relaxed text-content-on-brand/85">
                                Trusted by 25,000+ homeowners across India. Book a
                                free consultation and get a personalised 3D rooftop
                                solar design for your home.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <a
                                    href="#quote"
                                    className="group inline-flex items-center gap-2 rounded-full bg-[#f5d64e] px-6 py-3.5 text-sm font-semibold text-[#161311] shadow-lg transition hover:brightness-105"
                                >
                                    Book An Appointment
                                    <ArrowRight
                                        size={18}
                                        className="transition-transform duration-300 group-hover:translate-x-1"
                                    />
                                </a>
                                <a
                                    href="tel:9830003000"
                                    className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-content-brand shadow-lg transition hover:bg-white/90"
                                >
                                    <CallFilled size={18} />
                                    98 3000 3000
                                </a>
                            </div>
                        </div>
                        <div className="relative hidden min-h-56 lg:block">
                            <img
                                src="https://cdn.solarsquare.in/blog/wp-content/uploads/2026/07/20201751/hero-home-desk.webp"
                                alt="Home with rooftop solar panels"
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="mt-16 grid gap-10 lg:grid-cols-[1.4fr_1fr_1.3fr_1.3fr] lg:gap-12">
                        {/* Brand */}
                        <div className="flex flex-col gap-6">
                            <img
                                src="https://cdn.solarsquare.in/blog/wp-content/uploads/2025/11/05101757/logo.webp"
                                alt="SolarSquare"
                                className="w-[200px]"
                            />
                            <p className="max-w-xs leading-relaxed text-white/60">
                                We are the best-in-class service providers, taking
                                solar to homes all across the country. Trusted by
                                25,000+ homeowners, 200+ housing societies, and many
                                Fortune 500 companies.
                            </p>
                            <div className="flex gap-3">
                                {socials.map(({ key, label, href, Icon }) => (
                                    <a
                                        key={key}
                                        href={href}
                                        aria-label={label}
                                        className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-surface-brand text-white transition hover:-translate-y-0.5 hover:brightness-110"
                                    >
                                        <Icon size={18} />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <FooterHeading>Quick Links</FooterHeading>
                            <ul className="flex flex-col gap-4">
                                {quickLinks.map((link) => (
                                    <li key={link.href}>
                                        <a
                                            href={link.href}
                                            className="text-white/70 transition hover:text-white"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <FooterHeading>Contact Info</FooterHeading>
                            <ul className="flex flex-col gap-4">
                                {contactInfo.map(({ key, Icon, text }) => (
                                    <li
                                        key={key}
                                        className="flex items-center gap-3 text-white/70"
                                    >
                                        <Icon size={18} />
                                        <span>{text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div>
                            <FooterHeading>Newsletter</FooterHeading>
                            <p className="mb-6 leading-relaxed text-white/60">
                                Get solar tips, savings guides and the latest
                                updates straight to your inbox.
                            </p>
                            <form onSubmit={handleSubscribe} className="relative">
                                <label htmlFor="footer-email" className="sr-only">
                                    Email address
                                </label>
                                <input
                                    id="footer-email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    placeholder="Email address"
                                    className="h-14 w-full rounded-2xl bg-white pl-5 pr-16 text-sm text-[#161311] outline-none placeholder:text-black/40 focus:ring-2 focus:ring-surface-brand"
                                />
                                <button
                                    type="submit"
                                    aria-label="Subscribe"
                                    className="absolute right-2 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl bg-surface-brand text-white transition hover:brightness-110"
                                >
                                    <SendMessageFilled size={18} />
                                </button>
                            </form>
                            {subscribed ? (
                                <p className="mt-3 text-sm text-[#f5d64e]">
                                    Thanks for subscribing!
                                </p>
                            ) : null}
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/60 sm:flex-row">
                        <p>Copyright ©2026 SolarSquare. All Rights Reserved.</p>
                        <div className="flex items-center gap-4">
                            <a href="#terms" className="transition hover:text-white">
                                Terms of Service
                            </a>
                            <span className="text-white/25">|</span>
                            <a href="#privacy" className="transition hover:text-white">
                                Privacy Policy
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
