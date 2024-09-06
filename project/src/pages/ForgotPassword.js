import React, { useState } from 'react';
import { supabase } from './client';

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: 'https://respondr.vercel.app/reset-password',
            });
            if (error) {
                console.log(`Error: ${error.message}`);
                alert(`Error: ${error.message}`);
            } else {
                alert("Password reset email sent! Please check your inbox.");
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
                <h1 style={styles.title}>Forgot Password?</h1>
                <p style={styles.tagline}>Regain access to your account.</p>
                <p style={styles.description}>
                    We value your security. Enter your email address, and we'll send you a link to reset your password. If you're having trouble, please contact support.
                </p>
            </div>

            <div style={styles.container}>
                <h2 style={styles.header}>Forgot Password</h2>
                <form style={styles.form} onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={handleEmailChange}
                        style={styles.input}
                        required
                    />
                    <button type="submit" style={styles.submitButton} disabled={loading}>
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>
            </div>
        </div>
    );
}

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
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: "45%",
    },
    header: {
        marginBottom: '20px',
        fontSize: "24px",
        color: "#ffff",
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
