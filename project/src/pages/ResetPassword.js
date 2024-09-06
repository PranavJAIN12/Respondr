import React, { useState } from 'react';
import { supabase } from './client';
import { useNavigate } from 'react-router-dom';
import logo from '../assests/logo/new logo.png'

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.updateUser({
                password: password,
            });

            if (error) {
                alert(`Error: ${error.message}`);
            } else {
                alert("Password has been reset successfully!");
                navigate('/login');
            }
        } catch (error) {
            console.error("Unexpected error during password reset:", error);
            alert("Unexpected error occurred. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.wrapper}>
          
            <div style={styles.infoSection}>
            <img src={logo} alt="logo" style={{marginBottom:'0px', height:'22rem'}}/>
                <h1 style={styles.title}>Reset Your Password</h1>
                <p style={styles.tagline}>Regain control of your account.</p>
                <p style={styles.description}>
                    Enter a new password below to reset your account credentials. Make sure your password is strong and secure.
                </p>
            </div>

            <div style={styles.container}>
                <h2 style={styles.header}>Reset Password</h2>
                <form style={styles.form} onSubmit={handleSubmit}>
                    <input
                        type="password"
                        placeholder="Enter your new password"
                        value={password}
                        onChange={handlePasswordChange}
                        style={styles.input}
                        required
                    />
                    <button type="submit" style={styles.submitButton} disabled={loading}>
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    wrapper: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#09090b',
        color: '#fafafa',
        padding: '0 50px',
    },
    infoSection: {
        width: '45%',
        textAlign: 'left',
    },
    title: {
        fontSize: '36px',
        marginBottom: '10px',
    },
    tagline: {
        fontSize: '18px',
        marginBottom: '20px',
        color: '#ccc',
    },
    description: {
        fontSize: '16px',
        lineHeight: '1.5',
        color: '#ddd',
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '45%',
    },
    header: {
        marginBottom: '20px',
        fontSize: '24px',
        color: '#fff',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    input: {
        marginBottom: '15px',
        padding: '10px',
        fontSize: '16px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        width: '300px',
        backgroundColor: "#09090b",
    color: "#fff",
    },
    submitButton: {
        padding: '10px 20px',
        fontSize: '16px',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: "#e2e2e2",
    color: "#000",
        cursor: 'pointer',
    },
};

export default ResetPassword;
