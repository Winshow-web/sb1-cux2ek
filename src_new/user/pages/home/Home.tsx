import Navbar from "./components/Navbar";
import Contents from "./components/Contents";
import Footer from "./components/Footer";
import AuthModal from "./components/AuthSidePanel";
import {useState} from "react";
import {User} from "../../../global/types";

interface HomeProps {
    baseUrl: string;
    setUser: (user: User) => void;
    redirect: (InUser: User) => void;
}

function Home({ baseUrl, setUser, redirect }: HomeProps) {

    const [showAuthModal, setShowAuthModal] = useState(false);

    return (
        <div>
            <Navbar onAuthClick={() => setShowAuthModal(true)}/>
            <Contents />
            <Footer />

            {showAuthModal && (
                <AuthModal
                    onClose={() => setShowAuthModal(false)}
                    baseUrl={baseUrl}
                    setUser={setUser}
                    setShowAuthModal={setShowAuthModal}
                    redirect={redirect}
                />
            )}
        </div>
    );
}

export default Home;
