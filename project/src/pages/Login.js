import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { supabase } from './client';

const Login = () => {
    const [mail, setMail] = useState("");
    const [pass, setPass] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleMailChange = (e) => {
        setMail(e.target.value);
    };

    const handlePassChange = (e) => {
        setPass(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: mail,
                password: pass,
            });
            if (error) {
                // Handle login error
                console.error("Login error:", error.message);
                alert(`Error: ${error.message}`);
            } else {
                // Login successful
                alert("Login successful!");
                console.log("Login successful:", data);
                navigate('/home')
            }
        } catch (error) {
            console.error("Unexpected error:", error);
            alert("Unexpected error occurred. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        // Add Google login logic here
    };

    const handleGithubLogin = () => {
        // Add GitHub login logic here
    };

    return (
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
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f2f5',
    },
    card: {
        width: '400px',
        padding: '20px',
        borderRadius: '10px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
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
    },
    submitButton: {
        padding: '10px',
        fontSize: '16px',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#4CAF50',
        color: '#fff',
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
    },
    icon: {
        marginRight: '10px',
    },
    signupLink: {
        marginTop: '15px',
    },
};

export default Login;
