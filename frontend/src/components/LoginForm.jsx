import React, {useState} from "react";
import {useAuth} from "../contexts/AuthContext";

const LoginForm = ({onSuccess}) => {
    const {login} = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            if(onSuccess) onSuccess();
        }
        catch (err) {
            setError("Invalid credentials.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-red-500">{error}</div>}
            <input type="email" placeholder="Email" className="w-full p-2 border rounded" value={email} onChange={(e) => setEmail(e.target.value)} required />

            <input type="password" placeholder="Password" className="w-full p-2 border rounded" value={password} onChange={(e) => setPassword(e.target.value)} required />

            <button type="submit" className="w-ful bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Login</button>
        </form>
    );
};

export default LoginForm;