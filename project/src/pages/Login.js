import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { supabase } from './client';
import logo from '../assests/logo/new logo.png'

const Login = () => {
    const [mail, setMail] = useState("");
    const [pass, setPass] = useState("");
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const navigate = useNavigate();

    const handleMailChange = (e) => setMail(e.target.value);
    const handlePassChange = (e) => setPass(e.target.value);
    const handleRememberMeChange = (e) => setRememberMe(e.target.checked);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: mail,
                password: pass,
            }, { shouldCreateSession: true });
            
            if (error) {
                console.error("Login error:", error.message);
                alert(`Error: ${error.message}`);
            } else {
                alert("Login successful!");
                console.log('User data:', data);
                const fullName = data.user.user_metadata.full_name;
                // Store token based on "Remember Me" checkbox
                if (rememberMe) {
                    localStorage.setItem('userToken', data.session.access_token);
                    localStorage.setItem('userId', data.user.id);
                } else {
                    sessionStorage.setItem('userToken', data.session.access_token);
                    sessionStorage.setItem('userId', data.user.id);
                }
                navigate('/home', { state: { fullName: fullName } });
            }
        } catch (error) {
            console.error("Unexpected error:", error);
            alert("Unexpected error occurred. Please try again later.");
        } finally {
            setLoading(false);
        }
    };
    

    const handleGoogleLogin = async () => {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                // options: { redirectTo: 'https://localhost:3000/home' }
            });
            
            if (error) {
                alert(`Error: ${error.message}`);
            } else {
                console.log(`Google login successful`, data);
                navigate('/home');
            }
        } catch (error) {
            console.error("Unexpected error during Google login:", error);
            alert("Unexpected error occurred. Please try again later.");
        }
    };

    const handleGithubLogin = () => {
        alert("in testing process");
    };

    return (
        <div style={styles.wrapper}>
            {/* Background slogan */}
            <div style={styles.infoSection}>
            <img src={logo} alt="logo" style={{marginBottom:'0px', height:'22rem'}}/>
                <h1 style={styles.title}>Respondr: Your AI Chatbot</h1>
                <p style={styles.tagline}>Effortless AI-powered communication.</p>
                <p style={styles.description}>
                    Log in to Respondr and make the most of intelligent AI-driven conversations that can streamline your daily tasks.
                </p>
            </div>

            <div style={styles.container}>
                <div style={styles.card}>
                    <h2 style={styles.header}>Log In</h2>
                    <form style={styles.form} onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder="Email"
                            style={styles.input}
                            onChange={handleMailChange}
                            value={mail}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            style={styles.input}
                            onChange={handlePassChange}
                            value={pass}
                        />

                        <div style={styles.rememberMeContainer}>
                            <input
                                type="checkbox"
                                id="rememberMe"
                                checked={rememberMe}
                                onChange={handleRememberMeChange}
                                style={styles.checkbox}
                            />
                            <label htmlFor="rememberMe" style={styles.checkboxLabel}>
                                Remember Me
                            </label>
                        </div>
                        <p style={{ marginBottom: '1rem', textAlign: 'left' }}>
                            Forgot your password? <Link to="/forgot-password" style={{ color: 'blue' }}>Reset it here</Link>
                        </p>

                        <button type="submit" style={styles.submitButton} disabled={loading}>
                            {loading ? "Logging In..." : "Log In"}
                        </button>
                    </form>

                    <div style={styles.divider}>or</div>

                    <button onClick={handleGoogleLogin} style={styles.socialButton}>
                        <FaGoogle style={styles.icon} /> Log In with Google
                    </button>

                    <button onClick={handleGithubLogin} style={styles.socialButton}>
                        <FaGithub style={styles.icon} /> Log In with GitHub
                    </button>

                    <p style={styles.signupLink}>
                        Don't have an account? <Link to="/" style={{ color: 'blue' }}>Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

const styles = {
    wrapper: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#09090b",
        color: "#fafafa",
        padding: "0 50px",
    },
    infoSection: {
        width: "45%",
        textAlign: "left",
    },
    title: {
        fontSize: "36px",
        marginBottom: "10px",
    },
    tagline: {
        fontSize: "18px",
        marginBottom: "20px",
        color: "#ccc",
    },
    description: {
        fontSize: "16px",
        lineHeight: "1.5",
        color: "#ddd",
    },
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "45%",
    },
    card: {
        width: '400px',
        padding: '20px',
        borderRadius: '10px',
        backgroundColor: '#131317',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        border: '1px solid white',
        boxShadow: '0 0 15px rgba(255, 255, 255, 1.5)',
    },
    header: {
        marginBottom: '20px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    input: {
        marginBottom: '15px',
        padding: '10px',
        fontSize: '16px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        backgroundColor: "#09090b",
    color: "#fff",
    },
    rememberMeContainer: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '15px',
    },
    checkbox: {
        marginRight: '10px',
    },
    checkboxLabel: {
        fontSize: '14px',
    },
    submitButton: {
        padding: '10px',
        fontSize: '16px',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: "#e2e2e2",
    color: "#000",
        cursor: 'pointer',
        marginBottom: '15px',
        disabled: {
            backgroundColor: '#ccc',
            cursor: 'not-allowed',
        }
    },
    divider: {
        margin: '15px 0',
        fontSize: '14px',
        color: '#999',
    },
    socialButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px',
        fontSize: '16px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        cursor: 'pointer',
        marginBottom: '10px',
        backgroundColor: '#f9f9f9',
        color: 'black'
    },
    icon: {
        marginRight: '10px',
    },
    signupLink: {
        marginTop: '15px',
    },
};

export default Login;








////////////////////////////
// import  {useState} from 'react'
// import { Auth } from '@supabase/auth-ui-react'
// import { ThemeSupa } from '@supabase/auth-ui-shared'
// import  supabase  from './client'



// const Login = () => (
//     <Auth
//     supabaseClient={supabase}
//    appearance={{ theme: ThemeSupa }}
//     providers={['google', 'facebook', 'twitter']}
//   />
// )
// export default Login;
