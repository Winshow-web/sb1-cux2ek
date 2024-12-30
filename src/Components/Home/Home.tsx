import Hero from './Components/Hero';
import Features from './Components/Features';
import HowItWorks from './Components/HowItWorks';
import Testimonials from './Components/Testimonials';
import CallToAction from './Components/CallToAction';

export default function Home() {
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