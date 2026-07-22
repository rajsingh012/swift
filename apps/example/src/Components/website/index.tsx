import Header from "./header";
import HeroSection from "./hero";
import CarouselSection from "./carousel";
import PoweringSection from "./powering";
import Lists from "./sections/lists";

const RouteComponent = () => {
    return (
        <div className="min-h-screen bg-surface text-content">
            <Header />
            <div className="relative">
                <HeroSection />
                <CarouselSection />
            </div>
            <PoweringSection />
            <Lists />
        </div>
    );
}

export default RouteComponent;