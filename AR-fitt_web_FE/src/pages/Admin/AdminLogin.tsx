import React, { useState } from 'react';
import { Alert, Box, Button, CircularProgress, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { ArrowForwardRounded, Inventory2Outlined, PeopleOutlineRounded, VisibilityOffOutlined, VisibilityOutlined, AndroidRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import adminAuthService from '../../services/adminAuth.service';
import { adminTheme } from './adminTheme';

const AdminLogin: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await adminAuthService.login(formData.email.trim(), formData.password);
      if (response.status === 'success') navigate('/admin/dashboard', { replace: true });
      else setError('Sign in failed. Check your admin credentials.');
    } catch (error: any) {
      if (error.response?.status === 401) setError('The email or password is incorrect. Please try again.');
      else if (error.response?.status === 403) setError('This account does not have admin access.');
      else setError(error.response?.data?.message || 'Unable to sign in. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <ThemeProvider theme={adminTheme}>
      <Box sx={{ minHeight: '100dvh', display: 'flex', bgcolor: '#f7f9fb' }}>
        <Stack sx={{ display: { xs: 'none', md: 'flex' }, width: '43%', p: { md: 5, lg: 8 }, bgcolor: '#152c2b', color: '#fff', justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={1.5} alignItems="center"><Box sx={{ width: 42, height: 42, bgcolor: '#a2ead3', borderRadius: 2, display: 'grid', placeItems: 'center', fontSize: 20, fontWeight: 800, color: '#152c2b' }}>A</Box><Typography sx={{ fontSize: 24, fontWeight: 750, letterSpacing: -1 }}>ARFitt</Typography></Stack>
          <Box sx={{ py: 8 }}>
            <Typography sx={{ fontSize: 12, letterSpacing: 2, fontWeight: 600, color: '#a2ead3', mb: 3 }}>YOUR ADMIN WORKSPACE</Typography>
            <Typography component="h2" sx={{ fontWeight: 700, fontSize: { md: 38, lg: 48 }, lineHeight: 1.15, letterSpacing: -1.5, maxWidth: 440 }}>One place to manage ARFitt.</Typography>
            <Typography sx={{ color: '#a7bebb', mt: 3, lineHeight: 1.8, maxWidth: 400 }}>Keep your catalogue up to date, manage your customers, and publish app updates.</Typography>
            <Stack spacing={2.5} sx={{ mt: 5, color: '#d7e7e3' }}>
              <Stack direction="row" spacing={2} alignItems="center"><PeopleOutlineRounded sx={{ color: '#a2ead3' }} /><Typography variant="body2">User accounts & subscriptions</Typography></Stack>
              <Stack direction="row" spacing={2} alignItems="center"><Inventory2Outlined sx={{ color: '#a2ead3' }} /><Typography variant="body2">Products, categories & try-ons</Typography></Stack>
              <Stack direction="row" spacing={2} alignItems="center"><AndroidRounded sx={{ color: '#a2ead3' }} /><Typography variant="body2">Android app releases</Typography></Stack>
            </Stack>
          </Box>
          <Typography variant="caption" sx={{ color: '#83a09c' }}>ARFitt administration</Typography>
        </Stack>
        <Box sx={{ flex: 1, display: 'grid', placeItems: 'center', p: { xs: 3, sm: 6 } }}>
          <Box sx={{ width: '100%', maxWidth: 420 }}>
            <Typography sx={{ display: { md: 'none' }, fontWeight: 800, color: 'primary.main', fontSize: 24, mb: 6 }}>ARFitt Admin</Typography>
            <Typography variant="h4" component="h1" sx={{ mb: 1 }}>Welcome back</Typography>
            <Typography color="text.secondary" variant="body2" sx={{ mb: 4 }}>Sign in to your admin account to get started.</Typography>
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            <Stack component="form" onSubmit={handleSubmit} spacing={2.5}>
              <TextField fullWidth label="Email" name="email" type="email" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} required autoComplete="username" autoFocus disabled={loading} />
              <TextField fullWidth label="Password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(event) => setFormData({ ...formData, password: event.target.value })} required autoComplete="current-password" disabled={loading} InputProps={{ endAdornment: <InputAdornment position="end"><IconButton aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)} edge="end" disabled={loading}>{showPassword ? <VisibilityOffOutlined /> : <VisibilityOutlined />}</IconButton></InputAdornment> }} />
              <Button type="submit" fullWidth variant="contained" size="large" disabled={loading} endIcon={!loading && <ArrowForwardRounded />} sx={{ py: 1.75 }}>{loading ? <CircularProgress size={22} color="inherit" aria-label="Signing in" /> : 'Sign in'}</Button>
            </Stack>
            <Button component="a" href="/" sx={{ mt: 3, color: 'text.secondary', pl: 0 }}>Back to website</Button>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};
export default AdminLogin;
