import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import BasicAccount from './steps/BasicAccount';
import Verification from './steps/Verification';
import Form from './steps/form/Form.tsx';
import Pending from './steps/pending/Pending.tsx';
import { User } from "@global/types.ts";
import Login from "./steps/Login.tsx";
import Resubmit from "./steps/Resubmit.tsx";

interface SignUpProps {
    baseUrl: string;
    setUser: (user: User) => void;
    user: User;
}

const SignUp: React.FC<SignUpProps> = ({ baseUrl, setUser, user }) => {
    const navigate = useNavigate();

    const increaseStep = (nextStep: string) => {
        navigate(nextStep);
    };

    return (
        <Routes>
            <Route
                path="/basic-account"
                element={<BasicAccount baseUrl={baseUrl} setUser={setUser} />}
            />
            <Route
                path="/verification"
                element={<Verification baseUrl={baseUrl} user={user} setUser={setUser} />}
            />
            <Route
                path="/login"
                element={<Login baseUrl={baseUrl} />}
            />
            <Route
                path="/form/*"
                element={<Form baseUrl={baseUrl} />}
            />
            <Route
                path="/pending/*"
                element={<Pending baseUrl={baseUrl} />}
            />
            <Route
                path="/resubmit/*"
                element={<Resubmit baseUrl={baseUrl} />}
            />
        </Routes>
    );
};

export default SignUp;
