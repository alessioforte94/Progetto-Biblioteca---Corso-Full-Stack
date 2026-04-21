import { useState } from 'react';
import { TextField, Button, Box, Typography, Paper, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

export const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await login({ email, password });
            navigate('/');
        } catch {
            setError(t('login.error'));
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
                <Typography variant="h5" sx={{ textAlign: 'center', mb: 3 }}>
                    {t('login.title')}
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField label={t('login.email')} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    <TextField
                        label={t('login.password')}
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        slotProps={{ htmlInput: { minLength: 6 } }}
                    />
                    <Button type="submit" variant="contained" size="large">
                        {t('login.submit')}
                    </Button>
                </Box>

                <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
                    {t('login.noAccount')}{' '}
                    <Link to="/registrazione">{t('login.register')}</Link>
                </Typography>
            </Paper>
        </Box>
    );
};
