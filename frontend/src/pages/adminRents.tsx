import { useEffect, useState } from 'react';
import { Typography, Box, CircularProgress, Chip, Alert } from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { getAllRentsAdmin } from '../api/rent.Api';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import type { Rent } from '../types/db.type';

export const AdminRents = () => {
    const { t } = useTranslation();
    const [rents, setRents] = useState<Rent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getAllRentsAdmin()
            .then(setRents)
            .catch(() => setError(t('adminRents.loadError')))
            .finally(() => setLoading(false));
    }, []);

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        {
            field: 'bookTitle',
            headerName: t('adminRents.colBook'),
            flex: 1,
            minWidth: 150,
            valueGetter: (_value, row) => row.book?.title || `Book #${row.bookId}`,
        },
        {
            field: 'userEmail',
            headerName: t('adminRents.colUser'),
            flex: 1,
            minWidth: 180,
            valueGetter: (_value, row) => row.user?.email || `User #${row.userId}`,
        },
        {
            field: 'rentDate',
            headerName: t('adminRents.colRentDate'),
            width: 130,
            valueFormatter: (value) => dayjs(value).format('DD/MM/YYYY'),
        },
        {
            field: 'returnDate',
            headerName: t('adminRents.colReturnDate'),
            width: 130,
            valueFormatter: (value) => value ? dayjs(value).format('DD/MM/YYYY') : '-',
        },
        {
            field: 'state',
            headerName: t('adminRents.colState'),
            width: 130,
            renderCell: (params) => (
                <Chip
                    label={params.value === 'ACTIVE' ? t('adminRents.active') : t('adminRents.returned')}
                    color={params.value === 'ACTIVE' ? 'warning' : 'success'}
                    size="small"
                />
            ),
        },
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
            <Typography variant="h4" gutterBottom>{t('adminRents.title')}</Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Box sx={{ height: 500 }}>
                <DataGrid
                    rows={rents}
                    columns={columns}
                    pageSizeOptions={[5, 10, 25]}
                    initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                    disableRowSelectionOnClick
                />
            </Box>

            {rents.length === 0 && !loading && (
                <Typography sx={{ textAlign: 'center', mt: 4, color: 'text.secondary' }}>
                    {t('adminRents.noRents')}
                </Typography>
            )}
        </>
    );
};
