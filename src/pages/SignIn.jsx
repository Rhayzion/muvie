import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase"; // 👈 update the path based on your setup

const SignIn =() =>{

    const [userData, setUserData] = useState({
    
        password: "",
        email: ""
    });

    const [error, setError] = useState(""); 
    const [isLoading, setIsLoading] = useState(false);

       const handleInput = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setUserData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); 
        setIsLoading(true);
        // Simulate an API call

        try{
            const userCredentials = await signInWithEmailAndPassword(
                auth,
                userData.email,
                userData.password
            );

            const user = userCredentials.user;
            console.log("User signed in successfully:", user);
        }
        catch (err) {
            console.error("Error signing in:", err);
            setError("Error: Email or Password is incorrect.");
        } finally {
            setIsLoading(false);
        }
        
    };

    return(

        <>
        <div className="signin-container">
           <img src="signin.svg" alt="sign In" />
            <div className="signin">
                <h2>Sign In</h2>

                <form onSubmit={handleSubmit}>
                    
                    <input
                    type="email"
                    name="email"
                    value={userData.email}
                    autoComplete="on"
                    placeholder="Email" 
                    onChange={handleInput}
                    ></input>

                    <input
                    type="password"
                    name="password"
                    value={userData.password}
                    autoComplete="on"
                    placeholder="Password"
                    onChange={handleInput}
                  
                    ></input>

                    <button type="submit" disabled={isLoading}>SignIn</button>
                    {error && <p className="error">{error}</p>}
                    <p className="info">Don't have an account? credentials<a href="/AuthForm">Sign Up</a></p>
                </form>
            </div>
        </div>
        </>
    )

}

export default SignIn;