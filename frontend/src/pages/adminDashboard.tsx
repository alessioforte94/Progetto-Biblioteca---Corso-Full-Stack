import { useEffect, useState } from 'react';
import { Typography, Grid, Paper, Box, CircularProgress, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BookIcon from '@mui/icons-material/Book';
import { getAllBooks } from '../api/book.Api';
import { getAllRentsAdmin } from '../api/rent.Api';
import { useTranslation } from 'react-i18next';
import type { Book, Rent } from '../types/db.type';

export const AdminDashboard = () => {
    const { t } = useTranslation();
    const [books, setBooks] = useState<Book[]>([]);
    const [rents, setRents] = useState<Rent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([getAllBooks(), getAllRentsAdmin()])
            .then(([booksData, rentsData]) => {
                setBooks(booksData);
                setRents(rentsData);
            })
            .finally(() => setLoading(false));
    }, []);

    const totalBooks = books.length;
    const totalRents = rents.length;
    const activeRents = rents.filter((r) => r.state === 'ACTIVE').length;
    const returnedBooks = rents.filter((r) => r.state === 'RETURNED').length;

    const stats = [
        { label: t('adminDashboard.totalBooks'), value: totalBooks, icon: <BookIcon sx={{ fontSize: 40 }} />, color: '#1976d2' },
        { label: t('adminDashboard.totalRents'), value: totalRents, icon: <ReceiptLongIcon sx={{ fontSize: 40 }} />, color: '#ed6c02' },
        { label: t('adminDashboard.activeRents'), value: activeRents, icon: <MenuBookIcon sx={{ fontSize: 40 }} />, color: '#2e7d32' },
        { label: t('adminDashboard.returnedBooks'), value: returnedBooks, icon: <CheckCircleIcon sx={{ fontSize: 40 }} />, color: '#9c27b0' },
    ];

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <Typography variant="h4" gutterBottom>{t('adminDashboard.title')}</Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                {stats.map((s) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={s.label}>
                        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                            <Box sx={{ color: s.color, mb: 1 }}>{s.icon}</Box>
                            <Typography variant="h4">{s.value}</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>{s.label}</Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <Typography variant="h5" gutterBottom>{t('adminDashboard.quickAccess')}</Typography>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Paper elevation={2} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>{t('adminDashboard.manageBooks')}</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                            {t('adminDashboard.manageBooksDesc')}
                        </Typography>
                        <Button variant="contained" component={Link} to="/admin/libri">
                            {t('adminDashboard.goToBooks')}
                        </Button>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Paper elevation={2} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>{t('adminDashboard.manageRents')}</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                            {t('adminDashboard.manageRentsDesc')}
                        </Typography>
                        <Button variant="contained" component={Link} to="/admin/noleggi">
                            {t('adminDashboard.goToRents')}
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
};
