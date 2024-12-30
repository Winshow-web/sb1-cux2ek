import Hero from './contents_components/Hero';
import Features from './contents_components/Features';
import HowItWorks from './contents_components/HowItWorks';
import Testimonials from './contents_components/Testimonials';
import CallToAction from './contents_components/CallToAction';

export default function Contents() {
    return (
        <div className="min-h-screen">
            <Hero />
            <Features />
            <HowItWorks />
            <Testimonials />
            <CallToAction />
        </div>
    );
}