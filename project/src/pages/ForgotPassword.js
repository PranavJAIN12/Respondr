import React, { useState } from 'react'
import { supabase } from './client';


export default function ForgotPassword() {

    const[email, setEmail] = useState(" ");
    const[loading, setLoading] = useState(false);

    const handleEmailChange=(e)=>{
        setEmail(e.target.value);
    }
    const handleSubmit=async(e)=>{
        e.preventDefault();
        setLoading(true);
        try {
            const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: 'https://respondr.vercel.app/reset-password', // Replace with your reset password page URL
            });
            if(error){
                console.log(`Error: ${error.message}`)
                alert( `Error: ${error.message}`)
            }
            else{
                alert("Password reset email sent! Please check your inbox.");
            }
        } catch (error) {
            console.error("Unexpected error during password reset:", error);
            alert("Unexpected error occurred. Please try again later.");
        } finally{
            setLoading(false);
        }
    }

  return (
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
  )
}
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f0f2f5',
    },
    header: {
        marginBottom: '20px',
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
    },
    submitButton: {
        padding: '10px 20px',
        fontSize: '16px',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#4CAF50',
        color: '#fff',
        cursor: 'pointer',
    },
};
