import React, { useState } from 'react';
import { TextField, Button, Typography, Select, MenuItem, FormControl, InputLabel,Stack,  FormHelperText } from "@mui/material";
import ReCAPTCHA from "react-google-recaptcha";
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';


const SignupPage = ({ onSignInClick, onHide }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [dropdownValue, setDropdownValue] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [dropdownError, setDropdownError] = useState('');
    const [recaptchaValue, setRecaptchaValue] = useState(null); 
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();

  
    const handleRecaptchaChange = (value) => {
      setRecaptchaValue(value);
    };
  
    const validateEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };
  
    const validatePassword = (password) => {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return passwordRegex.test(password);
    };
  
    const handleEmailChange = (e) => {
      const value = e.target.value;
      setEmail(value);
      if (!validateEmail(value)) {
        setEmailError('Please enter a valid email address');
      } else {
        setEmailError('');
      }
    };
  
    const handlePasswordChange = (e) => {
      const value = e.target.value;
      setPassword(value);
      if (value.trim() === '') {
        setPasswordError('Please enter a password');
      } else if (!validatePassword(value)) {
        setPasswordError(
          '* Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character'
        );
      } else {
        setPasswordError('');
      }
    };
  
    const handleDropdownChange = (e) => {
      const value = e.target.value;
      setDropdownValue(value);
      if (value === '') {
        setDropdownError('Please select an option');
      } else {
        setDropdownError('');
      }
    };
    const redirectToSignIn = () => {
      navigate('/signin'); // Redirect to sign-in page
  };
    const handleSubmit = async (e) => {
      e.preventDefault();
      let formValid = true;
      
      if (!validateEmail(email)) {
        setEmailError('Please enter a valid email address');
        formValid = false;
      }
  
      if (password.trim() === '' || !validatePassword(password)) {
        setPasswordError('Please enter a valid password');
        formValid = false;
      }
  
      if (dropdownValue === '') {
        setDropdownError('Please select an option');
        formValid = false;
      }
  
      if (!recaptchaValue) {
        console.log('Please complete the ReCAPTCHA');
        return;
      }
  
      if (formValid) {
        try {
          const response = await axios.post('http://localhost:3000/signup', {
            email: email,
            password: password,
            role: dropdownValue
          });
          console.log(response.data);
          if (response.data && response.data.role_id) {
            sessionStorage.setItem('user_id', response.data.user_id);
            sessionStorage.setItem('role_id', response.data.role_id);
          }
          switch (dropdownValue) {
            case 'Admin':
                navigate('/');
                break;
            case 'Customer':
                navigate('/customerDashboard');
                break;
            case 'IC design service provider':
                navigate('/icDesign/icboard');
                break;
            case 'Domain Leader':
                navigate('/domainLeader/domainDashboard');
                break;
            case 'Engineer':
                navigate('/engineerDashboard');
                break;
            default:
                navigate('Invalid role:', dropdownValue);
                break;
        }
          console.log(response.data);
          setEmail('');
          setPassword('');
          setDropdownValue('');
          setSubmitted(true);
          if (typeof onHide === 'function') {
            onHide(); // Call onHide function to hide the signup page or perform other actions
          }
          sessionStorage.setItem('user_id', response.data.user_id);
          sessionStorage.setItem('role_id', response.data.role_id);
          sessionStorage.setItem('session_id', response.data.session_id)
          alert("Signup successful");
        } catch (error) {
          console.error('Error submitting form:', error);
        }
      }
    };
  
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ maxWidth: 400, textAlign: 'center' }}>
        <Typography variant="h2" gutterBottom style={{ color: '#2196f3', animation: 'rainbow 2s infinite' }}>
        Join the club of innovators! 
          </Typography>
          <Typography variant="h4" gutterBottom>
          Sign Up now and unlock endless possibilities
          </Typography>
          {!submitted && (
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email address"
              variant="outlined"
              fullWidth
              value={email}
              onChange={handleEmailChange}
              error={!!emailError}
              helperText={emailError}
              margin="normal"
            />
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              type="password"
              value={password}
              onChange={handlePasswordChange}
              error={!!passwordError}
              helperText={passwordError}
              margin="normal"
            />
            
            <FormControl variant="outlined" fullWidth error={!!dropdownError} margin="normal">
              <InputLabel id="dropdown-label">Choose an option</InputLabel>
              <Select
                labelId="dropdown-label"
                id="dropdown"
                value={dropdownValue}
                onChange={handleDropdownChange}
                label="Choose an option"
              >
                <MenuItem value="">
                  <em>Select an option</em>
                </MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Customer">Customer</MenuItem>
                <MenuItem value="Engineer">Engineer</MenuItem>
                <MenuItem value="Domain Leader">Domain Leader</MenuItem>
                <MenuItem value="IC design service provider">IC design service provider</MenuItem>
              </Select>
              <FormHelperText>{dropdownError}</FormHelperText>
            </FormControl>
            <div className="mt-1 flex justify-start">
              <ReCAPTCHA 
                sitekey="6Lcp54gpAAAAAN6exs5goYq2-lUXUPAwkSZ6eJSv"
                onChange={handleRecaptchaChange}
              />
            </div>
            <Button
              variant="contained"
              color="info"
              fullWidth
              type="submit"
              style={{ marginTop: '10px' }}
            >
              Submit
            </Button>
          </form>
          )}
          <div style={{ marginTop: '10px', color: 'white' }}>
          <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} mt={2}>
            <Button onClick={redirectToSignIn} fullWidth variant="text" color="info">
              Don't have an account  ?..   Register Here 
            </Button>
          </Stack>
</div>

        </div>
      </div>
    );
};

export default SignupPage;
