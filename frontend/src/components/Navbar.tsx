import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LanguageIcon from '@mui/icons-material/Language';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useContext, useState } from 'react';
import { ThemeContext } from '../context/themeContext';

export const Navbar = () => {
    const { email, role, logout } = useAuth();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        setAnchorEl(null);
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <MenuBookIcon sx={{ mr: 1 }} />
                <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
                    {t('app.title')}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Button color="inherit" component={Link} to="/catalogo">
                        {t('navbar.catalog')}
                    </Button>

                    {email ? (
                        <>
                            {role === 'USER' && (
                                <Button color="inherit" component={Link} to="/i-miei-noleggi">
                                    {t('navbar.myRents')}
                                </Button>
                            )}
                            {role === 'ADMIN' && (
                                <>
                                    <Button color="inherit" component={Link} to="/admin">
                                        {t('navbar.dashboard')}
                                    </Button>
                                    <Button color="inherit" component={Link} to="/admin/libri">
                                        {t('navbar.manageBooks')}
                                    </Button>
                                    <Button color="inherit" component={Link} to="/admin/noleggi">
                                        {t('navbar.manageRents')}
                                    </Button>
                                </>
                            )}
                            <Button color="inherit" variant="outlined" onClick={handleLogout}>
                                {t('navbar.logout')}
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button color="inherit" component={Link} to="/login">
                                {t('navbar.login')}
                            </Button>
                            <Button color="inherit" variant="outlined" component={Link} to="/registrazione">
                                {t('navbar.register')}
                            </Button>
                        </>
                    )}

                    <IconButton color="inherit" onClick={toggleTheme}>
                        {theme === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
                    </IconButton>

                    <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
                        <LanguageIcon />
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                        <MenuItem onClick={() => changeLanguage('it')} selected={i18n.language === 'it'}>
                            {t('language.it')}
                        </MenuItem>
                        <MenuItem onClick={() => changeLanguage('en')} selected={i18n.language === 'en'}>
                            {t('language.en')}
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};
