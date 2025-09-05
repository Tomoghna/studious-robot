import React, {useState} from "react";
import {useAuth} from "../contexts/AuthContext";
import {FaMobileAlt} from "react-icons/fa";

const LoginForm = ({onSuccess}) => {
    const {login, signup, loginWithGoogle, loginWithMobile} = useAuth();
    const [mode, setMode] = useState("signin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mobile, setMobile] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if(mode === "signup"){
                await login(email, password);
            }
            else {
                await signup(email, password);
            }
            if (onSuccess) onSuccess();
        }
        catch (err) {
            setError("Invalid credentials.");
        }
    };

    return (
        <div>
            <div className="flex mb-4">
                <button className={`flex-1 py-2 font-semibold rounded-t-lg ${mode === "signin" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200"}`} onClick={() => setMode("signin")}>Sign In</button>

                <button className={`flex-1 py-2 font-semibold rounded-t-lg ${mode === "signup" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200"}`} onClick={() => setMode("signup")}>Sign Up</button>
            </div>

            <div className="flex flex-col gap-2 mb-4">
                <button type="button" className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded py-2 hover:bg-sky-300" onClick={loginWithGoogle}>
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5"/>
                    <div className="text-black">Continue with Google</div>
                </button>

                <button type="button" className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded py-2 hover:bg-sky-300" onClick={loginWithMobile}>
                    <span role="img" aria-label="mobile"><FaMobileAlt color="black"/> </span>
                    <div className="text-black">Continue with Mobile</div>
                </button>
            </div>

            <div className="relative flex items-center mb-4">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="mx-2 text-gray-400 text-xs">or</span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <div className="text-red-500">{error}</div>}
                {mode === "signup" && (
                    <input type="text" placeholder="Mobile Number" className="w-full p-2 border rounded" value={mobile} onChange={(e) => setMobile(e.target.value)} />
                )}

                <input type="email" placeholder="Email" className="w-full p-2 border rounded" value={email} onChange={(e) => setEmail(e.target.value)} required />

                <input type="password" placeholder="Password" className="w-full p-2 border rounded" value={password} onChange={(e) => setPassword(e.target.value)} required />

                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700">
                    {mode === "signin" ? "Sign In" : "Sign Up"}
                </button>
            </form>
        </div>
    );
};

export default LoginForm;