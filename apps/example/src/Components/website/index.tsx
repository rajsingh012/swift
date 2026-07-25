import type { CSSProperties } from "react";
import Header from "./header";
import HeroSection from "./hero";
import CarouselSection from "./carousel";
import PoweringSection from "./powering";
import Lists from "./sections/lists";
import TestimonialsSection from "./sections/testimonials";
import StorySection from "./sections/story";
import EnergyFlowSection from "./sections/energy-flow";
import UseCasesSection from "./sections/use-cases";
import AppShowcaseSection from "./sections/app-showcase";
import FeaturesSection from "./sections/features";
import FaqSection from "./sections/faq";
import Footer from "./sections/footer";

const RouteComponent = () => {
    return (
        <div
            className="min-h-screen bg-surface text-content"
            style={
                {
                    '--color-surface': '#0a0e14',
                    '--color-surface-muted': '#151d2e',
                    '--color-surface-subtle': '#1a2232',
                    '--color-surface-elevated': '#141c2b',
                } as CSSProperties
            }
        >
            <Header />
            <div className="relative">
                <HeroSection />
                <CarouselSection />
            </div>
            <PoweringSection />
            <AppShowcaseSection />
            <EnergyFlowSection />
            <UseCasesSection />
            <StorySection />
            <FeaturesSection />
            <Lists />
            <TestimonialsSection />
            <FaqSection />
            <Footer />
        </div>
    );
}

export default RouteComponent;