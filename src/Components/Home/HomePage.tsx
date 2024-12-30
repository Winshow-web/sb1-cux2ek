import Navbar from "./Navbar.tsx";
import Home from "./Home.tsx";
import Footer from "./Footer.tsx";

interface HomePageProps {
    setShowAuthModal: (value: boolean) => void;
}

function HomePage({ setShowAuthModal }: HomePageProps) {
    return (
        <div>
            <Navbar
                onAuthClick={() => setShowAuthModal(true)}
            />
            <Home />
            <Footer />
        </div>
    );
}

export default HomePage;
