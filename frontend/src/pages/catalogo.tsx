import { useEffect, useState } from 'react';
import {
    Typography, Grid, Card, CardContent, CardActions, Button, Chip, Box, CircularProgress, Alert, TextField, MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getAllBooks } from '../api/book.Api';
import { rentBook } from '../api/rent.Api';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import type { Book } from '../types/db.type';

export const Catalogo = () => {
    const { email, userId } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [search, setSearch] = useState('');
    const [filterField, setFilterField] = useState<'title' | 'author' | 'cathegory'>('title');

    const fetchBooks = async () => {
        try {
            const data = await getAllBooks();
            setBooks(data);
        } catch {
            setError(t('catalog.loadError'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleRent = async (bookId: number) => {
        if (!email) {
            navigate('/login');
            return;
        }
        setError('');
        setSuccess('');
        try {
            await rentBook(userId!, bookId);
            setSuccess(t('catalog.rentSuccess'));
            fetchBooks();
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { error?: string } } };
            setError(axiosErr.response?.data?.error || t('catalog.rentError'));
        }
    };

    const filtered = books.filter((b) => {
        const value = b[filterField];
        if (!value) return true;
        return value.toString().toLowerCase().includes(search.toLowerCase());
    });

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <Typography variant="h4" gutterBottom>{t('catalog.title')}</Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                    select
                    label={t('catalog.searchBy')}
                    value={filterField}
                    onChange={(e) => setFilterField(e.target.value as 'title' | 'author' | 'cathegory')}
                    sx={{ minWidth: 150 }}
                >
                    <MenuItem value="title">{t('catalog.titleField')}</MenuItem>
                    <MenuItem value="author">{t('catalog.authorField')}</MenuItem>
                    <MenuItem value="cathegory">{t('catalog.categoryField')}</MenuItem>
                </TextField>
                <TextField
                    label={t('catalog.searchPlaceholder')}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    fullWidth
                />
            </Box>

            <Grid container spacing={3}>
                {filtered.map((book) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={book.id}>
                        <Card elevation={2}>
                            <CardContent>
                                <Typography variant="h6">{book.title}</Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }} gutterBottom>
                                    {book.author}
                                </Typography>
                                {book.cathegory && (
                                    <Chip label={book.cathegory} size="small" sx={{ mb: 1 }} />
                                )}
                                {book.description && (
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        {book.description}
                                    </Typography>
                                )}
                                <Box sx={{ mt: 1 }}>
                                    <Chip
                                        label={`${t('catalog.available')}: ${book.av_copies} / ${book.tot_copies}`}
                                        color={book.av_copies > 0 ? 'success' : 'error'}
                                        size="small"
                                    />
                                </Box>
                            </CardContent>
                            <CardActions>
                                <Button
                                    size="small"
                                    variant="contained"
                                    disabled={book.av_copies <= 0}
                                    onClick={() => handleRent(book.id)}
                                >
                                    {!email
                                        ? t('catalog.loginToRent')
                                        : book.av_copies > 0
                                            ? t('catalog.rent')
                                            : t('catalog.unavailable')}
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {filtered.length === 0 && (
                <Typography sx={{ textAlign: 'center', mt: 4, color: 'text.secondary' }}>
                    {t('catalog.noBooks')}
                </Typography>
            )}
        </>
    );
};
