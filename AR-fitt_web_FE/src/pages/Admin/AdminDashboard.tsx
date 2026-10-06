import React, { useEffect, useState } from 'react';
import { Avatar, Box, Button, Divider, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Stack, Tooltip, Typography, useMediaQuery } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { AndroidRounded, CategoryRounded, Inventory2Rounded, LogoutRounded, MenuRounded, OpenInNewRounded, PeopleOutlineRounded, ChevronRightRounded } from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AdminProvider } from '../../context/adminContext';
import adminAuthService from '../../services/adminAuth.service';
import UserManagement from './UserManagement';
import ProductManagement from './ProductManagement';
import CategoryManagement from './CategoryManagement';
import AppReleaseManagement from './AppReleaseManagement';
import { adminTheme } from './adminTheme';

const navigation = [
  { key: 'users', label: 'Users', description: 'Accounts & access', icon: <PeopleOutlineRounded />, component: UserManagement },
  { key: 'products', label: 'Products', description: 'Your product catalogue', icon: <Inventory2Rounded />, component: ProductManagement },
  { key: 'categories', label: 'Categories', description: 'Organize your catalogue', icon: <CategoryRounded />, component: CategoryManagement },
  { key: 'android', label: 'Android App', description: 'Uploads & downloads', icon: <AndroidRounded />, component: AppReleaseManagement },
];
const sidebarWidth = 236;

const AdminDashboard: React.FC = () => {
  const [params, setParams] = useSearchParams();
  const section = navigation.some((item) => item.key === params.get('section')) ? params.get('section')! : 'users';
  const [visited, setVisited] = useState<string[]>([section]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const desktop = useMediaQuery(adminTheme.breakpoints.up('md'));
  const [adminUser, setAdminUser] = useState<any>(null);
  const navigate = useNavigate();
  const active = navigation.find((item) => item.key === section)!;

  useEffect(() => {
    if (!adminAuthService.isAdminAuthenticated()) { navigate('/admin/login'); return; }
    setAdminUser(adminAuthService.getAdminUser());
  }, [navigate]);
  useEffect(() => { setVisited((current) => current.includes(section) ? current : [...current, section]); }, [section]);

  const selectSection = (key: string) => {
    setParams({ section: key });
    setMobileOpen(false);
    window.scrollTo({ top: 0 });
  };
  const logout = async () => { await adminAuthService.logout(); navigate('/admin/login'); };
  const sidebar = (
    <Stack sx={{ height: '100%', bgcolor: '#152c2b', color: '#fff', px: 2, py: 3 }}>
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ px: 1, mb: 4 }}>
        <Box sx={{ width: 38, height: 38, bgcolor: '#a2ead3', borderRadius: 2, display: 'grid', placeItems: 'center', color: '#152c2b', fontWeight: 800, fontSize: 18 }}>A</Box>
        <Box><Typography sx={{ fontWeight: 750, fontSize: 20, letterSpacing: -.7 }}>ARFitt</Typography><Typography sx={{ fontSize: 11, color: '#9eb8b4', letterSpacing: .8 }}>ADMIN WORKSPACE</Typography></Box>
      </Stack>
      <Typography sx={{ px: 1.5, mb: 1.5, color: '#83a09c', fontSize: 10, letterSpacing: 1.5, fontWeight: 600 }}>MANAGEMENT</Typography>
      <List role="tablist" aria-label="Admin navigation" aria-orientation="vertical" disablePadding>
        {navigation.map((item) => <ListItemButton role="tab" aria-label={item.label} aria-selected={section === item.key} aria-controls={`admin-panel-${item.key}`} id={`admin-tab-${item.key}`} key={item.key} selected={section === item.key} onClick={() => selectSection(item.key)} sx={{ borderRadius: 2, mb: .75, py: 1.1, color: '#b4c9c5', '&:hover': { bgcolor: '#203e3a' }, '&.Mui-selected, &.Mui-selected:hover': { bgcolor: '#a2ead3', color: '#152c2b' } }}>
          <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>{item.icon}</ListItemIcon>
          <ListItemText primary={item.label} secondary={item.description} primaryTypographyProps={{ fontSize: 13, fontWeight: 600 }} secondaryTypographyProps={{ fontSize: 10.5, color: 'inherit', sx: { opacity: .65, mt: .25 } }} />
        </ListItemButton>)}
      </List>
      <Box sx={{ flexGrow: 1, minHeight: 32 }} />
      <Divider sx={{ borderColor: '#2b4541', mb: 2 }} />
      <Button component="a" href="/" target="_blank" rel="noopener noreferrer" endIcon={<OpenInNewRounded sx={{ fontSize: 15 }} />} sx={{ color: '#b4c9c5', justifyContent: 'space-between' }}>View website</Button>
      <Typography sx={{ px: 2, mt: 2, color: '#83a09c', fontSize: 10 }}>ARFitt administration</Typography>
    </Stack>
  );

  return (
    <ThemeProvider theme={adminTheme}>
      <AdminProvider>
        <Box sx={{ bgcolor: 'background.default', minHeight: '100dvh', fontFamily: adminTheme.typography.fontFamily }}>
          <Box component="nav" aria-label="Workspace navigation" sx={{ width: { md: sidebarWidth }, flexShrink: 0 }}>
            {desktop ? <Drawer variant="permanent" sx={{ '& .MuiDrawer-paper': { width: sidebarWidth, border: 0 } }}>{sidebar}</Drawer>
              : <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)} ModalProps={{ keepMounted: true }} sx={{ '& .MuiDrawer-paper': { width: sidebarWidth, border: 0 } }}>{sidebar}</Drawer>}
          </Box>
          <Box sx={{ ml: { md: `${sidebarWidth}px` }, minWidth: 0 }}>
            <Stack component="header" direction="row" alignItems="center" justifyContent="space-between" sx={{ position: 'sticky', top: 0, zIndex: 1100, height: 72, px: { xs: 2, md: 4 }, bgcolor: '#ffffffee', backdropFilter: 'blur(12px)', borderBottom: '1px solid', borderColor: 'divider' }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <IconButton aria-label="Open navigation" onClick={() => setMobileOpen(true)} sx={{ display: { md: 'none' } }}><MenuRounded /></IconButton>
                <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>Workspace</Typography><ChevronRightRounded sx={{ color: '#bcc5ce', fontSize: 16, display: { xs: 'none', sm: 'block' } }} /><Typography variant="body2" fontWeight={600}>{active.label}</Typography>
              </Stack>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light', color: 'primary.main', fontSize: 13, fontWeight: 700 }}>{(adminUser?.firstName || adminUser?.email || 'A').slice(0,1).toUpperCase()}</Avatar>
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}><Typography variant="caption" fontWeight={600} display="block">{adminUser?.firstName || 'Administrator'}</Typography><Typography variant="caption" color="text.secondary">{adminUser?.email}</Typography></Box>
                <Tooltip title="Sign out"><IconButton aria-label="Sign out" onClick={logout}><LogoutRounded fontSize="small" /></IconButton></Tooltip>
              </Stack>
            </Stack>
            <Box component="main" sx={{ p: { xs: 2, sm: 3, lg: 4 }, maxWidth: 1600, mx: 'auto' }}>
              {navigation.map(({ key, component: Component }) => visited.includes(key) && <Box role="tabpanel" id={`admin-panel-${key}`} aria-labelledby={`admin-tab-${key}`} hidden={section !== key} key={key}><Component /></Box>)}
            </Box>
          </Box>
        </Box>
      </AdminProvider>
    </ThemeProvider>
  );
};

export default AdminDashboard;
