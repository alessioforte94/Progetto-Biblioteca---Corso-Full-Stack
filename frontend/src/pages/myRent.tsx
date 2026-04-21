import { useEffect, useState } from 'react';
import {
    Typography, Box, CircularProgress, Card, CardContent, Button, Chip, Tabs, Tab,
    Snackbar, LinearProgress, Grid,
} from '@mui/material';
import { getUserRents, returnBook } from '../api/rent.Api';
import { getFidelityByUser } from '../api/fidelity.Api';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import type { Rent, Fidelity } from '../types/db.type';

type RentWithBook = Rent & { book?: { title: string; author: string } };

export const MyRent = () => {
    const { userId } = useAuth();
    const { t } = useTranslation();
    const [rents, setRents] = useState<RentWithBook[]>([]);
    const [fidelity, setFidelity] = useState<Fidelity | null>(null);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState(0);
    const [snackbar, setSnackbar] = useState('');

    const fetchData = async () => {
        try {
            const [rentsData, fidelityData] = await Promise.all([
                getUserRents(userId!),
                getFidelityByUser(userId!),
            ]);
            setRents(rentsData as RentWithBook[]);
            setFidelity(fidelityData);
        } catch {
            setSnackbar(t('myRents.loadError'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) fetchData();
    }, [userId]);

    const handleReturn = async (rentId: number) => {
        try {
            await returnBook(rentId);
            setSnackbar(t('myRents.returnSuccess'));
            fetchData();
        } catch {
            setSnackbar(t('myRents.returnError'));
        }
    };

    const activeRents = rents.filter((r) => r.state === 'ACTIVE');
    const completedRents = rents.filter((r) => r.state === 'RETURNED');

    const getFidelityColor = (fclass: string) => {
        switch (fclass) {
            case 'GOLD': return '#FFD700';
            case 'SILVER': return '#C0C0C0';
            default: return '#CD7F32';
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <Typography variant="h4" gutterBottom>{t('myRents.title')}</Typography>

            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
                <Tab label={t('myRents.tabRents')} />
                <Tab label={t('myRents.tabFidelity')} />
            </Tabs>

            {tab === 0 && (
                <>
                    <Typography variant="h6" sx={{ mb: 2 }}>{t('myRents.activeRents')}</Typography>
                    {activeRents.length === 0 ? (
                        <Typography sx={{ color: 'text.secondary', mb: 3 }}>{t('myRents.noActive')}</Typography>
                    ) : (
                        <Grid container spacing={2} sx={{ mb: 4 }}>
                            {activeRents.map((rent) => (
                                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={rent.id}>
                                    <Card elevation={2}>
                                        <CardContent>
                                            <Typography variant="h6">{rent.book?.title ?? `Book #${rent.bookId}`}</Typography>
                                            {rent.book?.author && (
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                    {rent.book.author}
                                                </Typography>
                                            )}
                                            <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                <Chip label={t('myRents.active')} color="warning" size="small" />
                                                <Chip label={`${t('myRents.rentDate')}: ${dayjs(rent.rent_date).format('DD/MM/YYYY')}`} size="small" variant="outlined" />
                                                <Chip label={`${t('myRents.expDate')}: ${dayjs(rent.exp_date).format('DD/MM/YYYY')}`} size="small" variant="outlined" />
                                            </Box>
                                            <Box sx={{ mt: 2 }}>
                                                <Button variant="contained" size="small" onClick={() => handleReturn(rent.id)}>
                                                    {t('myRents.returnBook')}
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}

                    <Typography variant="h6" sx={{ mb: 2 }}>{t('myRents.history')}</Typography>
                    {completedRents.length === 0 ? (
                        <Typography sx={{ color: 'text.secondary' }}>{t('myRents.noHistory')}</Typography>
                    ) : (
                        <Grid container spacing={2}>
                            {completedRents.map((rent) => (
                                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={rent.id}>
                                    <Card elevation={1} sx={{ opacity: 0.8 }}>
                                        <CardContent>
                                            <Typography variant="h6">{rent.book?.title ?? `Book #${rent.bookId}`}</Typography>
                                            {rent.book?.author && (
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                    {rent.book.author}
                                                </Typography>
                                            )}
                                            <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                <Chip label={t('myRents.returned')} color="success" size="small" />
                                                <Chip label={`${t('myRents.rentDate')}: ${dayjs(rent.rent_date).format('DD/MM/YYYY')}`} size="small" variant="outlined" />
                                                <Chip label={`${t('myRents.expDate')}: ${dayjs(rent.exp_date).format('DD/MM/YYYY')}`} size="small" variant="outlined" />
                                                {rent.ret_date && (
                                                    <Chip label={`${t('myRents.returnDate')}: ${dayjs(rent.ret_date).format('DD/MM/YYYY')}`} size="small" color="success" variant="outlined" />
                                                )}
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </>
            )}

            {tab === 1 && (
                <Box sx={{ maxWidth: 500 }}>
                    {fidelity ? (
                        <Card elevation={3} sx={{ borderTop: `4px solid ${getFidelityColor(fidelity.class)}` }}>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>{t('myRents.fidelityCard')}</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                    <Chip
                                        label={fidelity.class}
                                        sx={{ backgroundColor: getFidelityColor(fidelity.class), fontWeight: 'bold' }}
                                    />
                                    <Typography variant="body1">
                                        {fidelity.point} {t('myRents.points')}
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={Math.min((fidelity.point / 100) * 100, 100)}
                                    sx={{ height: 10, borderRadius: 5 }}
                                />
                                <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
                                    {t('myRents.fidelityDesc')}
                                </Typography>
                            </CardContent>
                        </Card>
                    ) : (
                        <Typography sx={{ color: 'text.secondary' }}>{t('myRents.noFidelity')}</Typography>
                    )}
                </Box>
            )}

            <Snackbar open={!!snackbar} autoHideDuration={4000} onClose={() => setSnackbar('')} message={snackbar} />
        </>
    );
};
