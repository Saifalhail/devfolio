import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FaGoogle, FaPhone, FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getFirebaseAuthErrorMessage } from '../../utils/errorHandling';

const AuthModal = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [isSignUp, setIsSignUp] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const modalRef = useRef();
  const recaptchaContainerRef = useRef();
  const navigate = useNavigate();
  const { signInWithEmail, signup, signInWithGoogle, signInWithPhone, verifyPhoneCode } = useAuth();

  // Reset all modal state values to defaults
  const resetModalState = useCallback(() => {
    setError('');
    setEmail('');
    setPassword('');
    setDisplayName('');
    setPhoneNumber('');
    setVerificationCode('');
    setIsVerificationSent(false);
    setIsSignUp(false);
    setShowEmailForm(false);
    setLoading(false);
    if (window.confirmationResult) {
      window.confirmationResult = null;
    }
  }, []);

  const handleClose = useCallback(() => {
    resetModalState();
    onClose();
  }, [onClose, resetModalState]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, handleClose]);

  // Ensure state resets if modal is closed externally
  useEffect(() => {
    if (!isOpen) {
      resetModalState();
    }
  }, [isOpen, resetModalState]);
  
  const toggleSignUpMode = () => {
    setIsSignUp(!isSignUp);
    setShowEmailForm(false);
    setError('');
  };
  
  const showEmailSignInForm = () => {
    setShowEmailForm(true);
    setError('');
  };
  
  const backToOptions = () => {
    setShowEmailForm(false);
    setError('');
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      return setError(t('auth.errorEmptyFields', 'Please fill in all fields'));
    }
    
    try {
      setLoading(true);
      await signInWithEmail(email, password);
      // Redirect to dashboard on successful login
      navigate('/dashboard');
      handleClose();
    } catch (err) {
      console.error('Login error:', err);
      setError(getFirebaseAuthErrorMessage(err, t));
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();

    if (!email || !password || !displayName) {
      return setError(t('auth.errorEmptyFields', 'Please fill in all fields'));
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return setError(t('auth.errorInvalidEmail', 'Invalid email address'));
    }

    if (password.length < 6) {
      return setError(t('auth.errorPasswordLength', 'Password must be at least 6 characters'));
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).+$/;
    if (!passwordRegex.test(password)) {
      return setError(t('auth.errorWeakPassword', 'Password must contain letters and numbers'));
    }
    
    try {
      setLoading(true);
      await signup(email, password, displayName);
      
      // Redirect to dashboard on successful signup
      navigate('/dashboard');
      handleClose();
    } catch (err) {
      console.error('Signup error:', err);
      setError(getFirebaseAuthErrorMessage(err, t));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(''); // Clear any previous errors

      // Show a loading message
      console.log('Initiating Google sign-in...');

      // Attempt Google sign-in
      const result = await signInWithGoogle();

      // Handle successful sign-in
      if (result && result.user) {
        console.log('Google sign-in successful, redirecting to dashboard');
        // Redirect to dashboard on successful Google login
        navigate('/dashboard');
        handleClose();
      } else {
        setError(t('auth.errorGoogle', 'Google sign-in failed. Please try again.'));
      }
    } catch (err) {
      console.error('Google sign in error:', err);
      setError(getFirebaseAuthErrorMessage(err, t));
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneAuth = async () => {
    if (!phoneNumber) {
      return setError(t('auth.errorPhoneEmpty', 'Please enter your phone number'));
    }
    
    try {
      setLoading(true);
      await signInWithPhone(phoneNumber, recaptchaContainerRef.current);
      setIsVerificationSent(true);
    } catch (err) {
      console.error('Phone auth error:', err);
      setError(getFirebaseAuthErrorMessage(err, t));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      return setError(t('auth.errorCodeEmpty', 'Please enter verification code'));
    }

    try {
      setLoading(true);
      await verifyPhoneCode(verificationCode);
      // Redirect to dashboard on successful verification
      navigate('/dashboard');
      handleClose();
    } catch (err) {
      console.error('Verification error:', err);
      setError(getFirebaseAuthErrorMessage(err, t));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay isRTL={isRTL}>
      <ModalContainer ref={modalRef} isRTL={isRTL}>
        <CloseText onClick={handleClose}>×</CloseText>
        
        <ModalHeader>
          <ModalTitle>
            {isSignUp ? t('auth.createAccount', 'Create Account') : t('auth.welcome', 'Welcome Back')}
          </ModalTitle>
        </ModalHeader>
        
        <ModalContent>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          {!isSignUp ? (
            // SIGN IN VIEW
            <>
              {!showEmailForm ? (
                // Sign in options
                <>
                  <AuthOptionsContainer>
                    <SocialButton onClick={handleGoogleSignIn} disabled={loading}>
                      <FaGoogle />
                      <span>{t('auth.continueWithGoogle', 'Continue with Google')}</span>
                    </SocialButton>
                    
                    <SocialButton onClick={showEmailSignInForm} disabled={loading}>
                      <FaEnvelope />
                      <span>{t('auth.continueWithEmail', 'Continue with Email')}</span>
                    </SocialButton>
                    
                    <SocialButton onClick={handlePhoneAuth} disabled={loading || isVerificationSent}>
                      <FaPhone />
                      <span>{t('auth.continueWithPhone', 'Continue with Phone')}</span>
                    </SocialButton>
                    
                    {isVerificationSent && (
                      <PhoneVerificationContainer>
                        <Input
                          type="text"
                          placeholder={t('auth.verificationCode', 'Verification Code')}
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          isRTL={isRTL}
                        />
                        <PhoneButton onClick={handleVerifyCode} disabled={loading}>
                          {t('auth.verify', 'Verify')}
                        </PhoneButton>
                      </PhoneVerificationContainer>
                    )}
                    
                    <div id="recaptcha-container" ref={recaptchaContainerRef}></div>
                  </AuthOptionsContainer>
                </>
              ) : (
                // Email sign in form
                <>
                  <BackButton onClick={backToOptions}>←</BackButton>
                  
                  <Form onSubmit={handleEmailSignIn}>
                    <FormGroup>
                      <InputIcon>
                        <FaEnvelope />
                      </InputIcon>
                      <Input
                        type="email"
                        placeholder={t('auth.email', 'Email')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        isRTL={isRTL}
                        required
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <InputIcon>
                        <FaLock />
                      </InputIcon>
                      <Input
                        type="password"
                        placeholder={t('auth.password', 'Password')}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        isRTL={isRTL}
                        required
                      />
                    </FormGroup>
                    
                    <Button type="submit" disabled={loading}>
                      {loading ? t('auth.loading', 'Loading...') : t('auth.signIn', 'Sign In')}
                    </Button>
                  </Form>
                </>
              )}
              
              <SignUpPrompt>
                {t('auth.noAccount', "Don't have an account?")}{' '}
                <SignUpLink onClick={toggleSignUpMode}>
                  {t('auth.signUp', 'Sign Up')}
                </SignUpLink>
              </SignUpPrompt>
            </>
          ) : (
            // SIGN UP VIEW
            <>
              {!showEmailForm ? (
                // Sign up options
                <>
                  <AuthOptionsContainer>
                    <SocialButton onClick={handleGoogleSignIn} disabled={loading}>
                      <FaGoogle />
                      <span>{t('auth.signUpWithGoogle', 'Sign up with Google')}</span>
                    </SocialButton>
                    
                    <SocialButton onClick={showEmailSignInForm} disabled={loading}>
                      <FaEnvelope />
                      <span>{t('auth.signUpWithEmail', 'Sign up with Email')}</span>
                    </SocialButton>
                    
                    <SocialButton onClick={handlePhoneAuth} disabled={loading || isVerificationSent}>
                      <FaPhone />
                      <span>{t('auth.signUpWithPhone', 'Sign up with Phone')}</span>
                    </SocialButton>
                    
                    {isVerificationSent && (
                      <PhoneVerificationContainer>
                        <Input
                          type="text"
                          placeholder={t('auth.verificationCode', 'Verification Code')}
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          isRTL={isRTL}
                        />
                        <PhoneButton onClick={handleVerifyCode} disabled={loading}>
                          {t('auth.verify', 'Verify')}
                        </PhoneButton>
                      </PhoneVerificationContainer>
                    )}
                    
                    <div id="recaptcha-container" ref={recaptchaContainerRef}></div>
                  </AuthOptionsContainer>
                </>
              ) : (
                // Email sign up form
                <>
                  <BackButton onClick={backToOptions}>←</BackButton>
                  
                  <Form onSubmit={handleEmailSignUp}>
                    <FormGroup>
                      <InputIcon>
                        <FaUser />
                      </InputIcon>
                      <Input
                        type="text"
                        placeholder={t('auth.name', 'Full Name')}
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        isRTL={isRTL}
                        required
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <InputIcon>
                        <FaEnvelope />
                      </InputIcon>
                      <Input
                        type="email"
                        placeholder={t('auth.email', 'Email')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        isRTL={isRTL}
                        required
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <InputIcon>
                        <FaLock />
                      </InputIcon>
                      <Input
                        type="password"
                        placeholder={t('auth.password', 'Password')}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        isRTL={isRTL}
                        required
                      />
                    </FormGroup>
                    
                    <Button type="submit" disabled={loading}>
                      {loading ? t('auth.loading', 'Loading...') : t('auth.createAccount', 'Create Account')}
                    </Button>
                  </Form>
                </>
              )}
              
              <SignUpPrompt>
                {t('auth.haveAccount', 'Already have an account?')}{' '}
                <SignUpLink onClick={toggleSignUpMode}>
                  {t('auth.signIn', 'Sign In')}
                </SignUpLink>
              </SignUpPrompt>
            </>
          )}
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
`;

const ModalContainer = styled.div`
  background: #1a1a2e;
  border-radius: 15px;
  width: 90%;
  max-width: 500px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 30px rgba(130, 161, 191, 0.2);
  animation: slideIn 0.3s ease-out forwards;
  max-height: 90vh;
  overflow-y: auto;
  color: #fff;
  border: 1px solid rgba(130, 161, 191, 0.3);
  position: relative;
  
  @keyframes slideIn {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const CloseText = styled.span`
  position: absolute;
  top: 10px;
  right: 20px;
  font-size: 24px;
  font-weight: 300;
  color: #fff;
  cursor: pointer;
  z-index: 1000;
  transition: color 0.2s;
  
  &:hover {
    color: #faaa93;
  }
`;

const ModalHeader = styled.div`
  margin-bottom: 1.5rem;
  margin-top: 2rem;
`;

const ModalTitle = styled.h2`
  color: #faaa93;
  font-size: 1.8rem;
  margin-bottom: 2rem;
  text-align: center;
  text-shadow: 0 0 10px rgba(250, 170, 147, 0.3);
`;

const AuthOptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;



const BackButton = styled.span`
  position: absolute;
  top: 15px;
  left: 20px;
  font-size: 24px;
  font-weight: 300;
  color: #fff;
  cursor: pointer;
  z-index: 1000;
  transition: color 0.2s;
  
  &:hover {
    color: #faaa93;
  }
`;

const PhoneVerificationContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 10px;
  background: rgba(130, 161, 191, 0.1);
  border: 1px solid rgba(130, 161, 191, 0.2);
`;

const SignUpPrompt = styled.div`
  text-align: center;
  margin-top: 2rem;
  color: #82a1bf;
  font-size: 0.9rem;
`;

const SignUpLink = styled.span`
  color: #faaa93;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  
  &:hover {
    text-decoration: underline;
    text-shadow: 0 0 5px rgba(250, 170, 147, 0.3);
  }
`;

const ModalContent = styled.div`
  margin-top: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  position: relative;
`;


const InputIcon = styled.div`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #82a1bf;
  font-size: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.5rem;
  border: 1px solid rgba(130, 161, 191, 0.3);
  border-radius: 30px;
  font-size: 1rem;
  transition: all 0.3s;
  text-align: ${props => props.isRTL ? 'right' : 'left'};
  background-color: rgba(26, 26, 46, 0.8);
  color: #fff;
  
  &:focus {
    outline: none;
    border-color: #82a1bf;
    box-shadow: 0 0 10px rgba(130, 161, 191, 0.4);
  }
  
  &::placeholder {
    color: rgba(130, 161, 191, 0.7);
  }
`;

const Button = styled.button`
  padding: 0.8rem;
  background: #513a52;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  z-index: 1;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
    transition: opacity 0.4s ease-in-out;
    opacity: 0;
    z-index: -1;
    border-radius: 8px;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    
    &:before {
      opacity: 1;
    }
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  }
  
  &:disabled {
    background: #444;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    opacity: 0.6;
  }
`;

const PhoneButton = styled(Button)`
  flex-shrink: 0;
  padding: 0.8rem 1rem;
`;


const SocialButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  padding: 0.9rem;
  border: none;
  border-radius: 12px;
  background: rgba(26, 26, 46, 0.8);
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 0 0 1px rgba(130, 161, 191, 0.3);
  backdrop-filter: blur(4px);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(120deg, transparent, rgba(130, 161, 191, 0.2), transparent);
    transform: translateX(-100%);
    transition: 0.6s;
  }
  
  &:hover {
    background: rgba(30, 30, 50, 0.9);
    transform: translateY(-3px);
    box-shadow: 0 7px 14px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(250, 170, 147, 0.5);
    
    &::before {
      transform: translateX(100%);
    }
  }
  
  &:active {
    transform: translateY(-1px);
  }
  
  &:disabled {
    background: rgba(26, 26, 46, 0.3);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    opacity: 0.6;
  }
  
  svg {
    font-size: 1.3rem;
    color: #faaa93;
    filter: drop-shadow(0 0 3px rgba(250, 170, 147, 0.5));
  }
`;

const ErrorMessage = styled.div`
  background-color: rgba(211, 47, 47, 0.2);
  color: #ff6b6b;
  padding: 0.8rem;
  border-radius: 5px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  border: 1px solid rgba(211, 47, 47, 0.3);
  box-shadow: 0 0 10px rgba(211, 47, 47, 0.2);
`;

export default AuthModal;

