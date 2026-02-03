import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import styles from './LoginPage.module.css';

interface LoginFormData {
  email: string;
  password: string;
}

const schema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const LoginPage: React.FC = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const from = (location.state as any)?.from?.pathname || '/consultations';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError('');
    
    try {
      await login(data.email, data.password);
      // Navigate to dashboard after successful login
      navigate('/consultations', { replace: true });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      {/* Left Side - Brand Section */}
      <div className={styles.brandSide}>
        <div className={styles.brandContent}>
          <div className={styles.logoContainer}>
            <div className={styles.logo}>
              <div className={styles.logoIcon}></div>
            </div>
            <h1 className={styles.companyName}>Vasa</h1>
          </div>
        </div>
      </div>

      {/* Right Side - Login Section */}
      <div className={styles.loginSide}>
        <div className={styles.loginContent}>
          <div className={styles.welcomeSection}>
            <h2 className={styles.welcomeTitle}>Welcome</h2>
            <p className={styles.welcomeSubtitle}>Please login to Admin Dashboard.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className={`${styles.loginForm} ${isLoading ? styles.formLoading : ''}`}>
            <div className={styles.inputGroup}>
              <input
                {...register('email')}
                type="email"
                placeholder="Username"
                className={`${styles.input} ${errors.email ? styles.error : ''}`}
              />
              {errors.email && (
                <div className={styles.errorMessage}>
                  {errors.email.message}
                </div>
              )}
            </div>

            <div className={styles.inputGroup}>
              <input
                {...register('password')}
                type="password"
                placeholder="Password"
                className={`${styles.input} ${errors.password ? styles.error : ''}`}
              />
              {errors.password && (
                <div className={styles.errorMessage}>
                  {errors.password.message}
                </div>
              )}
            </div>

            {error && (
              <div className={styles.errorAlert}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={styles.loginButton}
            >
              {isLoading ? 'Signing In...' : 'Login'}
            </button>

            <div className={styles.forgotPassword}>
              <button type="button" className={styles.forgotLink}>Forgotten Your Password?</button>
            </div>
          </form>

          {/* Demo Credentials */}
          <div className={styles.demoCredentials}>
            <span className={styles.demoTitle}>Demo Credentials:</span>
            <span className={styles.demoCredential}>
              Super Admin: getnavatech@gmail.com / superadmin123
            </span>
            {/* <span className={styles.demoCredential}>
              Admin: admin@smartvastuastro.com / admin123
            </span> */}
            {/* <span className={styles.demoCredential}>
              Content Creator: content@smartvastuastro.com / content123
            </span> */}
            <span className={styles.demoCredential}>
              Consultant: vipulchhallani2@gmail.com / vipulchhallani
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
