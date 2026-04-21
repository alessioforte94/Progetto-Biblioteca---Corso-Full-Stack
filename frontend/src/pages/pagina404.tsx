import { Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined';
import { useTranslation } from 'react-i18next';

export const Pagina404 = () => {
    const { t } = useTranslation();

    return (
        <Box sx={{ textAlign: 'center', mt: 10 }}>
            <ErrorOutlinedIcon sx={{ fontSize: 100, color: 'error.main', mb: 2 }} />
            <Typography variant="h2" gutterBottom>
                404
            </Typography>
            <Typography variant="h5" sx={{ color: 'text.secondary', mb: 4 }}>
                {t('notFound.message', 'Pagina non trovata')}
            </Typography>
            <Button variant="contained" size="large" component={Link} to="/">
                {t('notFound.backHome', 'Torna alla Home')}
            </Button>
        </Box>
    );
};
