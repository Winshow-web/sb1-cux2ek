import React from 'react';
import Login from "../signup/steps/Login.tsx";
import {useNavigate} from "react-router-dom";

interface HomeProps {
    baseUrl: string;
}

const Home: React.FC<HomeProps> = ({ baseUrl }) => {
    const navigate = useNavigate();

    const signup = () => {
        navigate('/signup/basic-account');
    }

    return (
        <div>
            <h1>Welcome to Home Page</h1>
            <Login baseUrl={baseUrl}/> {/* Use Login component here */}
            <button type="button" onClick={signup} style={styles.button}>SignUp</button>
        </div>
    );
};

const styles = {
    button: {
        padding: '10px 20px',
        fontSize: '14px',
        cursor: 'pointer',
        margin: '10px 0',
        backgroundColor: '#007BFF',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
    }
};

export default Home;
