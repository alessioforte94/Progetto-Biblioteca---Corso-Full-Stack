import { useEffect, useState } from 'react';
import {
    Typography, Box, CircularProgress, Alert, Button,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { getAllBooks, insertBook, updateTotalCopies, updateAvailableCopies, deleteBook } from '../api/book.Api';
import { useTranslation } from 'react-i18next';
import type { Book } from '../types/db.type';

export const AdminBooks = () => {
    const { t } = useTranslation();
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [openAdd, setOpenAdd] = useState(false);
    const [newBook, setNewBook] = useState({ title: '', author: '', cathegory: '', description: '', tot_copies: 0, av_copies: 0 });

    const [openEdit, setOpenEdit] = useState(false);
    const [editBook, setEditBook] = useState<Partial<Book>>({});

    const [deleteTarget, setDeleteTarget] = useState<Book | null>(null);

    const fetchBooks = async () => {
        try {
            setBooks(await getAllBooks());
        } catch {
            setError(t('adminBooks.loadError'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBooks(); }, []);

    const handleAdd = async () => {
        setError('');
        try {
            await insertBook({
                title: newBook.title,
                author: newBook.author,
                cathegory: newBook.cathegory || null,
                description: newBook.description || null,
                tot_copies: Number(newBook.tot_copies),
                av_copies: Number(newBook.av_copies),
            });
            setSuccess(t('adminBooks.addSuccess'));
            setOpenAdd(false);
            setNewBook({ title: '', author: '', cathegory: '', description: '', tot_copies: 0, av_copies: 0 });
            fetchBooks();
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { error?: string } } };
            setError(axiosErr.response?.data?.error || t('adminBooks.addError'));
        }
    };

    const handleEditSave = async () => {
        setError('');
        try {
            await updateTotalCopies({ id: editBook.id, tot_copies: editBook.tot_copies });
            await updateAvailableCopies({ id: editBook.id, av_copies: editBook.av_copies });
            setSuccess(t('adminBooks.updateSuccess'));
            setOpenEdit(false);
            fetchBooks();
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { error?: string } } };
            setError(axiosErr.response?.data?.error || t('adminBooks.updateError'));
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            await deleteBook({ id: deleteTarget.id });
            setSuccess(t('adminBooks.deleteSuccess'));
            setDeleteTarget(null);
            fetchBooks();
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { error?: string } } };
            setError(axiosErr.response?.data?.error || t('adminBooks.deleteError'));
            setDeleteTarget(null);
        }
    };

    const handleEditTotCopies = (value: number) => {
        setEditBook((prev) => {
            const currentAv = prev.av_copies ?? 0;
            return { ...prev, tot_copies: value, av_copies: currentAv > value ? value : currentAv };
        });
    };

    const handleEditAvCopies = (value: number) => {
        setEditBook((prev) => ({
            ...prev,
            av_copies: Math.min(value, prev.tot_copies ?? 0),
        }));
    };

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
    }

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4">{t('adminBooks.title')}</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenAdd(true)}>
                    {t('adminBooks.addBook')}
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>{t('adminBooks.colTitle')}</TableCell>
                            <TableCell>{t('adminBooks.colAuthor')}</TableCell>
                            <TableCell>{t('adminBooks.colCategory')}</TableCell>
                            <TableCell align="center">{t('adminBooks.colTotalCopies')}</TableCell>
                            <TableCell align="center">{t('adminBooks.colAvailCopies')}</TableCell>
                            <TableCell align="center">{t('adminBooks.colActions')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {books.map((book) => (
                            <TableRow key={book.id}>
                                <TableCell>{book.id}</TableCell>
                                <TableCell>{book.title}</TableCell>
                                <TableCell>{book.author}</TableCell>
                                <TableCell>{book.cathegory ?? '—'}</TableCell>
                                <TableCell align="center">{book.tot_copies}</TableCell>
                                <TableCell align="center">{book.av_copies}</TableCell>
                                <TableCell align="center">
                                    <IconButton color="primary" onClick={() => { setEditBook(book); setOpenEdit(true); }}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => setDeleteTarget(book)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog Aggiungi */}
            <Dialog open={openAdd} onClose={() => setOpenAdd(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{t('adminBooks.addBook')}</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    <TextField label={t('adminBooks.colTitle')} required value={newBook.title} onChange={(e) => setNewBook({ ...newBook, title: e.target.value })} />
                    <TextField label={t('adminBooks.colAuthor')} required value={newBook.author} onChange={(e) => setNewBook({ ...newBook, author: e.target.value })} />
                    <TextField label={t('adminBooks.colCategory')} value={newBook.cathegory} onChange={(e) => setNewBook({ ...newBook, cathegory: e.target.value })} />
                    <TextField label={t('adminBooks.description')} multiline rows={3} value={newBook.description} onChange={(e) => setNewBook({ ...newBook, description: e.target.value })} />
                    <TextField label={t('adminBooks.colTotalCopies')} type="number" required value={newBook.tot_copies} onChange={(e) => {
                        const tot = Number(e.target.value);
                        setNewBook((prev) => ({ ...prev, tot_copies: tot, av_copies: prev.av_copies > tot ? tot : prev.av_copies }));
                    }} />
                    <TextField label={t('adminBooks.colAvailCopies')} type="number" required value={newBook.av_copies} onChange={(e) => {
                        const av = Math.min(Number(e.target.value), newBook.tot_copies);
                        setNewBook((prev) => ({ ...prev, av_copies: av }));
                    }} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAdd(false)}>{t('adminBooks.cancel')}</Button>
                    <Button variant="contained" onClick={handleAdd}>{t('adminBooks.addBtn')}</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog Modifica Copie */}
            <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="xs" fullWidth>
                <DialogTitle>{t('adminBooks.editTotalTitle')} — {editBook.title}</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    <TextField label={t('adminBooks.colTotalCopies')} type="number" value={editBook.tot_copies ?? 0} onChange={(e) => handleEditTotCopies(Number(e.target.value))} />
                    <TextField label={t('adminBooks.colAvailCopies')} type="number" value={editBook.av_copies ?? 0} onChange={(e) => handleEditAvCopies(Number(e.target.value))} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEdit(false)}>{t('adminBooks.cancel')}</Button>
                    <Button variant="contained" onClick={handleEditSave}>{t('adminBooks.save')}</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog Conferma Eliminazione */}
            <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
                <DialogTitle>{t('adminBooks.confirmDeleteTitle')}</DialogTitle>
                <DialogContent>
                    <Typography>{t('adminBooks.confirmDeleteText', { title: deleteTarget?.title })}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteTarget(null)}>{t('adminBooks.cancel')}</Button>
                    <Button onClick={handleDelete} color="error" variant="contained">{t('adminBooks.confirmDelete')}</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
