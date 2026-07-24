import Header from "./header";
import HeroSection from "./hero";
import CarouselSection from "./carousel";
import PoweringSection from "./powering";
import Lists from "./sections/lists";
import TestimonialsSection from "./sections/testimonials";
import StorySection from "./sections/story";
import EnergyFlowSection from "./sections/energy-flow";
import FeaturesSection from "./sections/features";
import FaqSection from "./sections/faq";

const RouteComponent = () => {
    return (
        <div className="min-h-screen bg-surface text-content">
            <Header />
            <div className="relative">
                <HeroSection />
                <CarouselSection />
            </div>
            <PoweringSection />
            <StorySection />
            <EnergyFlowSection />
            <FeaturesSection />
            <Lists />
            <TestimonialsSection />
            <FaqSection />
        </div>
    );
}

export default RouteComponent;