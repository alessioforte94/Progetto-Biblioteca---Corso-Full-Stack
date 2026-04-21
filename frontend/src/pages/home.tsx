import { Typography, Box, Button, Paper, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

export const Home = () => {
    const { email, role } = useAuth();
    const { t } = useTranslation();

    return (
        <Box sx={{ textAlign: 'center', mt: 6 }}>
            <MenuBookIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
            <Typography variant="h3" gutterBottom>
                {t('home.welcome')}
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4 }}>
                {t('home.subtitle')}
            </Typography>

            {!email ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button variant="contained" size="large" component={Link} to="/login">
                        {t('home.login')}
                    </Button>
                    <Button variant="outlined" size="large" component={Link} to="/registrazione">
                        {t('home.register')}
                    </Button>
                </Box>
            ) : (
                <Grid container spacing={3} sx={{ justifyContent: 'center', mt: 2 }}>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>{t('home.catalog')}</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                                {t('home.catalogDesc')}
                            </Typography>
                            <Button variant="contained" component={Link} to="/catalogo">{t('home.goToCatalog')}</Button>
                        </Paper>
                    </Grid>

                    {role === 'USER' && (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Paper elevation={3} sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom>{t('home.myRents')}</Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                                    {t('home.myRentsDesc')}
                                </Typography>
                                <Button variant="contained" component={Link} to="/i-miei-noleggi">{t('home.goToRents')}</Button>
                            </Paper>
                        </Grid>
                    )}

                    {role === 'ADMIN' && (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Paper elevation={3} sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom>{t('home.adminPanel')}</Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                                    {t('home.adminPanelDesc')}
                                </Typography>
                                <Button variant="contained" component={Link} to="/admin">{t('home.goToDashboard')}</Button>
                            </Paper>
                        </Grid>
                    )}
                </Grid>
            )}
        </Box>
    );
};
