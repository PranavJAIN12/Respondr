import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { supabase } from "./client";

const SignUp = () => {
  const handleGoogleSignUp = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });

      if (error) {
        alert(`Error: ${error.message}`);
      } else {
        console.log(`Signup successful`, data);
        navigate("/login"); 
      }
    } catch (error) {
      console.error("Unexpected error during Google sign-up:", error);
      alert("Unexpected error occurred. Please try again later.");
    }
  };
  const navigate = useNavigate();

  const handleGithubSignUp = () => {
    // Add GitHub sign-up logic here
  };

  const [name, setName] = useState(" ");
  const [mail, setMail] = useState(" ");
  const [pass, setPass] = useState(" ");

  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  const handlemailChange = (e) => {
    setMail(e.target.value);
  };
  const handlePassChange = (e) => {
    setPass(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("buttonclick");
    try {
      const { data, error } = await supabase.auth.signUp({
        email: mail,
        password: pass,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        // Handle signup error
        console.error("Signup error:", error.message);
        alert(`Error: ${error.message}`);
      } else {
        // Signup successful, check email for verification
        alert("Check your email for the verification link.");
        console.log("Signup successful:", data);
        navigate("/login");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("Unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.header}>Create an Account</h2>
        <form style={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            style={styles.input}
            onChange={handleNameChange}
          />
          <input
            type="email"
            placeholder="Email"
            style={styles.input}
            onChange={handlemailChange}
          />
          <input
            type="password"
            placeholder="Password"
            style={styles.input}
            onChange={handlePassChange}
          />
          <button type="submit" style={styles.submitButton}>
            Sign Up
          </button>
        </form>

        <div style={styles.divider}>or</div>

        <button onClick={handleGoogleSignUp} style={styles.socialButton}>
          <FaGoogle style={styles.icon} /> Sign Up with Google
        </button>

        <button onClick={handleGithubSignUp} style={styles.socialButton}>
          <FaGithub style={styles.icon} /> Sign Up with GitHub
        </button>

        <p style={styles.loginLink}>
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f0f2f5",
  },
  card: {
    width: "400px",
    padding: "20px",
    borderRadius: "10px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  header: {
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    marginBottom: "15px",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  submitButton: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#4CAF50",
    color: "#fff",
    cursor: "pointer",
    marginBottom: "15px",
  },
  divider: {
    margin: "15px 0",
    fontSize: "14px",
    color: "#999",
  },
  socialButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    cursor: "pointer",
    marginBottom: "10px",
    backgroundColor: "#f9f9f9",
  },
  icon: {
    marginRight: "10px",
  },
  loginLink: {
    marginTop: "15px",
  },
};

export default SignUp;
