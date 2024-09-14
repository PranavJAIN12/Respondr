import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import logo from '../assests/logo/new logo.png'


const BookDemo = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    emailjs
      .send(
        'service_tqxe28x', 
        'template_7nvbgo7', 
        formData,
        'DvllqdJh4GYXvsETM' 
      )
      .then(
        (result) => {
          setSuccessMessage('Your demo request has been sent successfully!');
          setFormData({
            name: '',
            email: '',
            company: '',
            message: '',
          });
        },
        (error) => {
          console.log('Error:', error.text);
        }
      );
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.contentContainer}>
        
        <div style={styles.leftContainer}>
          <img
            src={logo}
            alt="Logo"
            style={styles.logo}
          />
          <h1 style={styles.title}>Book a Demo</h1>
          <p style={styles.subtitle}>
            Discover how RespondrAI can help you streamline your business
            operations. Please fill in the form to request a demo, and we will
            get back to you shortly.
          </p>
        </div>

      
        <div style={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            <div style={styles.inputContainer}>
              <label htmlFor="name" style={styles.label}>
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.inputContainer}>
              <label htmlFor="email" style={styles.label}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.inputContainer}>
              <label htmlFor="company" style={styles.label}>
                Company Name
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.inputContainer}>
              <label htmlFor="message" style={styles.label}>
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                style={styles.textarea}
              />
            </div>

            <button type="submit" style={styles.submitButton}>
              Submit
            </button>
          </form>

          {successMessage && <p style={styles.successMessage}>{successMessage}</p>}
        </div>
      </div>
    </div>
  );
};

// Styles Object
const styles = {
  wrapper: {
    backgroundColor: '#040D12',
    color: '#fafafa',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 50px',
  },
  contentContainer: {
    display: 'flex',
    width: '100%',
    margin: 'auto',
    textAlign: 'left',
  },
  leftContainer: {
    flex: 1,
    paddingRight: '30px',
  },
  logo: {
    height: '350px',
    marginBottom: '20px',
  },
  title: {
    fontSize: '36px',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '18px',
    color: '#cccccc',
    lineHeight: '1.6',
  },
  formContainer: {
    flex: 0.6,
    backgroundColor: '#131317',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 0 15px rgba(255, 255, 255, 1.5)',
    border: '1px solid white',
  },
  inputContainer: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    color: '#cccccc',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #cccccc',
    backgroundColor: '#040D12',
    color: '#fff',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #cccccc',
    backgroundColor: '#040D12',
    color: '#fff',
    minHeight: '100px',
  },
  submitButton: {
    width: '100%',
    padding: '15px',
    backgroundColor: '#e2e2e2',
    color: '#000',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  successMessage: {
    textAlign: 'center',
  },
};

export default BookDemo;
