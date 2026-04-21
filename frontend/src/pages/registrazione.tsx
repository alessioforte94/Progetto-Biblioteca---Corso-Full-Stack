import { useState } from 'react';
import { TextField, Button, Box, Typography, Paper, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

export const Registrazione = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [form, setForm] = useState({ name: '', surname: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await register(form);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 1500);
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { error?: string } } };
            setError(axiosErr.response?.data?.error || t('register.error'));
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4, maxWidth: 450, width: '100%' }}>
                <Typography variant="h5" sx={{ textAlign: 'center', mb: 3 }}>
                    {t('register.title')}
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{t('register.success')}</Alert>}

                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField label={t('register.name')} required value={form.name} onChange={handleChange('name')} />
                    <TextField label={t('register.surname')} required value={form.surname} onChange={handleChange('surname')} />
                    <TextField label={t('register.email')} type="email" required value={form.email} onChange={handleChange('email')} />
                    <TextField
                        label={t('register.password')}
                        type="password"
                        required
                        value={form.password}
                        onChange={handleChange('password')}
                        slotProps={{ htmlInput: { minLength: 6 } }}
                        helperText={t('register.passwordHelp')}
                    />
                    <Button type="submit" variant="contained" size="large" disabled={success}>
                        {t('register.submit')}
                    </Button>
                </Box>

                <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
                    {t('register.hasAccount')}{' '}
                    <Link to="/login">{t('register.login')}</Link>
                </Typography>
            </Paper>
        </Box>
    );
};
