import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  Avatar, Grid, InputAdornment, Stack, TablePagination, Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  SearchRounded, RefreshRounded, PeopleOutlineRounded, VerifiedUserOutlined, CreditCardRounded,
} from '@mui/icons-material';
import { useAdmin } from '../../context/adminContext';
import { adminService, AdminUser, UpdateUserData } from '../../services/admin.service';
import { AdminEmptyState, AdminFilters, AdminPageHeader, AdminSelect, AdminStats } from './AdminUI';
import { defaultUserFilters, filterLabel, filterUsers, normalizeFilter, UserFilters } from '../../utils/adminFilters';

const UserManagement: React.FC = () => {
  const { state, dispatch } = useAdmin();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [formData, setFormData] = useState<UpdateUserData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    role: '',
  });
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<UserFilters>({ ...defaultUserFilters });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const filteredUsers = useMemo(() => filterUsers(state.users, filters), [state.users, filters]);
  const safePage = Math.min(page, Math.max(0, Math.ceil(filteredUsers.length / rowsPerPage) - 1));
  const visibleUsers = filteredUsers.slice(safePage * rowsPerPage, (safePage + 1) * rowsPerPage);
  const filterCount = Object.entries(filters).filter(([key, value]) => key !== 'sort' && value !== '').length;
  const updateFilter = (key: keyof UserFilters, value: string) => setFilters((current) => ({ ...current, [key]: value }));
  const clearFilters = () => setFilters({ ...defaultUserFilters });
  const roles = Array.from(new Set(state.users.map((user) => normalizeFilter(user.role)).filter(Boolean))).sort();
  const invalidDates = !!filters.from && !!filters.to && filters.from > filters.to;

  useEffect(() => { setPage(0); }, [filters]);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const users = await adminService.getUsers();
      dispatch({ type: 'SET_USERS', payload: users });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch users' });
      setAlert({ type: 'error', message: 'Failed to fetch users' });
    } finally {
      setLoading(false);
    }
  }, [dispatch]);
  useEffect(() => { void fetchUsers(); }, [fetchUsers]);

  const handleEdit = (user: AdminUser) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      gender: user.gender || '',
      role: user.role || '',
    });
    setOpenDialog(true);
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminService.deleteUser(userId);
        dispatch({ type: 'DELETE_USER', payload: userId });
        setAlert({ type: 'success', message: 'User deleted successfully' });
      } catch (error) {
        setAlert({ type: 'error', message: 'Failed to delete user' });
      }
    }
  };

  const handleSubmit = async () => {
    if (!editingUser) return;

    try {
      const updatedUser = await adminService.updateUser(editingUser.id, formData);
      dispatch({ type: 'UPDATE_USER', payload: updatedUser });
      setOpenDialog(false);
      setEditingUser(null);
      setAlert({ type: 'success', message: 'User updated successfully' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to update user' });
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      gender: '',
      role: '',
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <AdminPageHeader title="Users" description="Manage accounts, subscriptions, and access.">
        <Button variant="outlined" startIcon={<RefreshRounded />} onClick={fetchUsers}>Refresh users</Button>
      </AdminPageHeader>
      <AdminStats items={[
        { label: 'Total users', value: state.users.length, detail: 'Accounts in your workspace', icon: <PeopleOutlineRounded /> },
        { label: 'Verified accounts', value: state.users.filter((user) => user.isVerified).length, detail: 'Email verification completed', icon: <VerifiedUserOutlined /> },
        { label: 'Subscribers', value: state.users.filter((user) => user.isSubscribed).length, detail: 'Users with a subscription', icon: <CreditCardRounded /> },
      ]} />

      {alert && (
        <Alert
          severity={alert.type}
          onClose={() => setAlert(null)}
          sx={{ mb: 2 }}
        >
          {alert.message}
        </Alert>
      )}

      <AdminFilters count={filterCount} onClear={clearFilters}>
        <Grid item xs={12} md={6}><TextField fullWidth size="small" label="Search users" placeholder="Name, email, phone, or ID" type="search" value={filters.search} onChange={(event) => updateFilter('search', event.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><SearchRounded fontSize="small" /></InputAdornment> }} /></Grid>
        <Grid item xs={6} md={3}><AdminSelect label="Role" value={filters.role} onChange={(value) => updateFilter('role', value)} options={[{ value: '', label: 'All roles' }, ...roles.map((role) => ({ value: role, label: filterLabel(role) }))]} /></Grid>
        <Grid item xs={6} md={3}><AdminSelect label="Gender" value={filters.gender} onChange={(value) => updateFilter('gender', value)} options={[{ value: '', label: 'All genders' }, { value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }, { value: 'other', label: 'Other' }, { value: 'unspecified', label: 'Not specified' }]} /></Grid>
        <Grid item xs={6} md={3}><AdminSelect label="Verification" value={filters.verified} onChange={(value) => updateFilter('verified', value)} options={[{ value: '', label: 'All accounts' }, { value: 'yes', label: 'Verified' }, { value: 'no', label: 'Unverified' }]} /></Grid>
        <Grid item xs={6} md={3}><AdminSelect label="Subscription" value={filters.subscription} onChange={(value) => updateFilter('subscription', value)} options={[{ value: '', label: 'All subscriptions' }, { value: 'yes', label: 'Subscribed' }, { value: 'no', label: 'Not subscribed' }]} /></Grid>
        <Grid item xs={6} md={3}><TextField fullWidth size="small" type="date" label="Joined from" InputLabelProps={{ shrink: true }} value={filters.from} onChange={(event) => updateFilter('from', event.target.value)} error={invalidDates} inputProps={{ max: filters.to || undefined }} /></Grid>
        <Grid item xs={6} md={3}><TextField fullWidth size="small" type="date" label="Joined until" InputLabelProps={{ shrink: true }} value={filters.to} onChange={(event) => updateFilter('to', event.target.value)} error={invalidDates} helperText={invalidDates ? 'Choose an end date after the start date.' : undefined} inputProps={{ min: filters.from || undefined }} /></Grid>
      </AdminFilters>

      <Paper sx={{ overflow: 'hidden' }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="space-between" spacing={2} sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary" role="status">{filteredUsers.length.toLocaleString()} of {state.users.length.toLocaleString()} users</Typography>
        <Box sx={{ width: { xs: '100%', sm: 180 } }}><AdminSelect label="Sort users" value={filters.sort} onChange={(value) => updateFilter('sort', value)} options={[{ value: 'newest', label: 'Newest first' }, { value: 'oldest', label: 'Oldest first' }, { value: 'name-asc', label: 'Name: A to Z' }, { value: 'name-desc', label: 'Name: Z to A' }]} /></Box>
      </Stack>
      <TableContainer sx={{ maxHeight: 620 }}>
        <Table stickyHeader aria-label="Users table" sx={{ minWidth: 870 }}>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.light', color: 'primary.main', fontSize: 12, fontWeight: 600 }}>{`${user.firstName?.[0] || user.email?.[0] || '?'}${user.lastName?.[0] || ''}`.toUpperCase()}</Avatar>
                    <Box sx={{ minWidth: 170 }}><Typography variant="body2" fontWeight={600}>{`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unnamed user'}</Typography><Typography variant="caption" color="text.secondary">{user.email || 'No email'}</Typography></Box>
                  </Stack>
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{user.phone || '—'}</TableCell>
                <TableCell>
                  <Chip
                    label={user.gender ? filterLabel(user.gender) : '—'}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={filterLabel(user.role || 'user')}
                    size="small"
                    sx={{ bgcolor: user.role === 'admin' ? '#edf0ff' : '#f1f5f9', color: user.role === 'admin' ? '#6260a8' : '#64748b' }}
                  />
                </TableCell>
                <TableCell>
                  <Stack spacing={.5} alignItems="flex-start">
                    {user.isVerified && (
                      <Chip label="Verified" size="small" sx={{ bgcolor: 'primary.light', color: 'primary.main' }} />
                    )}
                    {user.isSubscribed && (
                      <Chip label="Subscribed" size="small" sx={{ bgcolor: '#eaf1ff', color: '#4973b7' }} />
                    )}
                    {!user.isVerified && !user.isSubscribed && <Chip label="Unverified" size="small" variant="outlined" />}
                  </Stack>
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatDate(user.createdAt)}</TableCell>
                <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                  <Tooltip title="Edit user">
                  <IconButton
                    size="small"
                    onClick={() => handleEdit(user)}
                    color="primary"
                    aria-label={`Edit ${user.email || 'user'}`}
                  >
                    <EditIcon />
                  </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete user">
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(user.id)}
                    color="error"
                    aria-label={`Delete ${user.email || 'user'}`}
                  >
                    <DeleteIcon />
                  </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {filteredUsers.length === 0 && <TableRow><TableCell colSpan={7}><AdminEmptyState title={state.users.length ? 'No users match these filters' : 'No users yet'} description={state.users.length ? 'Try another search or clear your filters.' : 'New accounts will appear here.'} onClear={filterCount ? clearFilters : undefined} /></TableCell></TableRow>}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination component="div" count={filteredUsers.length} page={safePage} rowsPerPage={rowsPerPage} rowsPerPageOptions={[10,25,50]} onPageChange={(_, next) => setPage(next)} onRowsPerPageChange={(event) => { setRowsPerPage(Number(event.target.value)); setPage(0); }} />
      </Paper>

      {/* Edit User Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              fullWidth
            />
            <TextField
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              fullWidth
            />
            <TextField
              label="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              fullWidth
              type="email"
            />
            <TextField
              label="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                value={formData.gender}
                label="Gender"
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role}
                label="Role"
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
