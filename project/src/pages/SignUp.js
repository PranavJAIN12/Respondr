import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaGithub, FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { supabase } from "./client";
// import logo from '../assests/logo/download.png'
import feat1 from '../assests/media/feature1.webp'
import feat2 from '../assests/media/feature2.webp'
import logo from '../assests/logo/new logo.png'

const SignUp = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [pass, setPass] = useState("");
  const [message, setMessage] = useState(""); // For error/success messages

  const handleGoogleSignUp = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      if (error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage("Signup successful");
        navigate("/home");
      }
    } catch (error) {
      setMessage("Unexpected error during Google sign-up. Please try again.");
    }
  };

  const handleGithubSignUp = () => {
   
  };

  const handleNameChange = (e) => setName(e.target.value);
  const handleMailChange = (e) => setMail(e.target.value);
  const handlePassChange = (e) => setPass(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signUp({
        email: mail,
        password: pass,
        options: {
          data: { full_name: name },
        },
      });
      if (error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage("Check your email for the verification link.");
        navigate("/login");
      }
    } catch (error) {
      setMessage("Unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div>

    
    <div style={styles.wrapper}>
     
      <div style={styles.infoSection}>
      <img src={logo} alt="logo" style={{marginBottom:'0px', height:'22rem'}}/>
        <h1 style={styles.title}>Respondr: Your AI Chatbot</h1>
        <p style={styles.tagline}>Unlock the power of AI-driven conversations.</p>
        <p style={styles.description}>
          Join Respondr to interact with intelligent AI, streamline your
          workflows, and make your communication smarter than ever!
        </p>
      </div>

      <div style={styles.container}>
        <div style={styles.card}>
         
          {/* <img src={logo} alt="Respondr" style={styles.logo} height='10px' width='10px' /> */}
          <h2 style={styles.header}>Welcome to Respondr</h2>
          <p style={styles.subHeader}>Join Respondr and start chatting with your AI!</p>

          
          {message && <div style={styles.message}>{message}</div>}

          <form style={styles.form} onSubmit={handleSubmit}>
            <div style={styles.inputContainer}>
              <FaUser style={styles.iconInsideInput} />
              <input
                type="text"
                placeholder="Full Name"
                style={styles.input}
                onChange={handleNameChange}
              />
            </div>
            <div style={styles.inputContainer}>
              <FaEnvelope style={styles.iconInsideInput} />
              <input
                type="email"
                placeholder="Email"
                style={styles.input}
                onChange={handleMailChange}
              />
            </div>
            <div style={styles.inputContainer}>
              <FaLock style={styles.iconInsideInput} />
              <input
                type="password"
                placeholder="Password"
                style={styles.input}
                onChange={handlePassChange}
              />
            </div>
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
            Already have an account? <Link to="/login" style={{ color: 'blue' }}>Log In</Link>
          </p>
        </div>
      </div>
    </div>


    <div style={styles.featuresSection}>
        <h2 style={styles.sectionHeader}>Key Features</h2>
        <div style={styles.featureContainer}>
          <div style={styles.feature}>
            <img src={feat1} alt="Feature 1" style={styles.featureImage} />
            <p>Real-time AI Conversations</p>
          </div>
          <div style={styles.feature}>
            <img src={feat2} alt="Feature 2" style={styles.featureImage} />
            <p>Seamless User Experience</p>
          </div>
        </div>
      </div>

      {/* Model Information Section */}
      <div style={styles.modelSection}>
        <h2 style={styles.sectionHeader}>Powered by GPT-based AI</h2>
        <img src={logo} alt="AI Model" style={styles.modelImage} />
        <p style={styles.modelText}>
          Respondr is built using OpenAI’s powerful GPT models, ensuring that your conversations are as natural as possible. The AI is trained to handle various topics and adapt to your communication needs.
        </p>
      </div>
      
      {/* Call-to-Action Section */}
      <div style={styles.ctaSection}>
        <h2 style={styles.sectionHeader}>Ready to Start?</h2>
        <p>Join Respondr today and experience the future of AI communication!</p>
        <Link to="/login" style={styles.ctaButton}>Get Started</Link>
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
    width: "400px",
    padding: "20px",
    borderRadius: "10px",
    backgroundColor: "#131317",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    border: "1px solid white",
    boxShadow: '0 0 15px rgba(255, 255, 255, 1.5)',
  },
  logo: {
    width: "100px",
    marginBottom: "20px",
  },
  header: {
    marginBottom: "10px",
    fontSize: "24px",
  },
  subHeader: {
    marginBottom: "20px",
    fontSize: "14px",
    color: "#ccc",
  },
  message: {
    backgroundColor: "#ff4d4d",
    color: "#fff",
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "15px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  inputContainer: {
    position: "relative",
    marginBottom: "15px",
  },
  input: {
    width: "100%",
    padding: "10px",
    paddingLeft: "40px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    backgroundColor: "#09090b",
    color: "#fff",
  },
  iconInsideInput: {
    position: "absolute",
    top: "50%",
    left: "10px",
    transform: "translateY(-50%)",
    color: "#ccc",
  },
  submitButton: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#e2e2e2",
    color: "#000",
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
    backgroundColor: "#e2e2e2",
    color: "#000",
  },
  icon: {
    marginRight: "10px",
  },
  loginLink: {
    marginTop: "15px",
  },
  featuresSection: {
    padding: "40px 0",
    backgroundColor: "#131317",
    color: "#fafafa",
    textAlign: "center",
  },
  sectionHeader: {
    fontSize: "32px",
    marginBottom: "20px",
  },
  featureContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "40px",
  },
  feature: {
    width: "200px",
    textAlign: "center",
  },
  featureImage: {
    width: "100%",
    borderRadius: "10px",
  },
  modelSection: {
    padding: "40px 0",
    backgroundColor: "#09090b",
    textAlign: "center",
    color: "#ddd",
  },
  modelImage: {
    width: "400px",
    marginBottom: "20px",
    margin:'auto'
  },
  modelText: {
    maxWidth: "600px",
    margin: "0 auto",
    fontSize: "18px",
    lineHeight: "1.5",
  },
  ctaSection: {
    padding: "50px 0",
    textAlign: "center",
    backgroundColor: "#183D3D",
    color: "#fff",
  },
  ctaButton: {
    padding: "15px 30px",
    backgroundColor: "#5C8374",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "5px",
    fontSize: "18px",
    marginTop:'6rem'
  },
};

export default SignUp;
