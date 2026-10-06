import React, { useState, useEffect, useCallback } from 'react';
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
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useAdmin } from '../../context/adminContext';
import { adminService, AdminCategory, CreateCategoryData } from '../../services/admin.service';
import { AdminPageHeader } from './AdminUI';

const CategoryManagement: React.FC = () => {
  const { state, dispatch } = useAdmin();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const [formData, setFormData] = useState<CreateCategoryData>({
    name: '',
    description: '',
    type: '',
  });
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const categories = await adminService.getCategories();
      dispatch({ type: 'SET_CATEGORIES', payload: categories });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch categories' });
      setAlert({ type: 'error', message: 'Failed to fetch categories' });
    } finally {
      setLoading(false);
    }
  }, [dispatch]);
  useEffect(() => { void fetchCategories(); }, [fetchCategories]);

  const handleAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      type: '',
    });
    setOpenDialog(true);
  };

  const handleEdit = (category: AdminCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || '',
      description: category.description || '',
      type: category.type || '',
    });
    setOpenDialog(true);
  };

  const handleDelete = async (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await adminService.deleteCategory(categoryId);
        dispatch({ type: 'DELETE_CATEGORY', payload: categoryId });
        setAlert({ type: 'success', message: 'Category deleted successfully' });
      } catch (error) {
        setAlert({ type: 'error', message: 'Failed to delete category' });
      }
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingCategory) {
        const updatedCategory = await adminService.updateCategory(editingCategory.id, formData);
        dispatch({ type: 'UPDATE_CATEGORY', payload: updatedCategory });
        setAlert({ type: 'success', message: 'Category updated successfully' });
      } else {
        const newCategory = await adminService.createCategory(formData);
        dispatch({ type: 'ADD_CATEGORY', payload: newCategory });
        setAlert({ type: 'success', message: 'Category created successfully' });
      }
      setOpenDialog(false);
      setEditingCategory(null);
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to save category' });
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      type: '',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
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
      <AdminPageHeader title="Categories" description="Organize products into clear, easy-to-browse collections.">
          <Button
            variant={viewMode === 'table' ? 'contained' : 'outlined'}
            onClick={() => setViewMode('table')}
            size="small"
          >
            Table View
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'contained' : 'outlined'}
            onClick={() => setViewMode('grid')}
            size="small"
          >
            Grid View
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
          >
            Add Category
          </Button>
      </AdminPageHeader>

      {alert && (
        <Alert
          severity={alert.type}
          onClose={() => setAlert(null)}
          sx={{ mb: 2 }}
        >
          {alert.message}
        </Alert>
      )}

      {viewMode === 'table' ? (
        <TableContainer component={Paper} sx={{ maxHeight: 720 }}>
          <Table stickyHeader aria-label="Categories table" sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Modified</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {state.categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {category.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {category.description || 'No description'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={category.type}
                      size="small"
                      color="primary"
                      aria-label={`Edit ${category.name}`}
                    />
                  </TableCell>
                  <TableCell>{formatDate(category.createdAt)}</TableCell>
                  <TableCell>{formatDate(category.modifiedAt)}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(category)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(category.id)}
                      color="error"
                      aria-label={`Delete ${category.name}`}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Grid container spacing={3}>
          {state.categories.map((category) => (
            <Grid item xs={12} sm={6} md={4} key={category.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {category.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {category.description || 'No description available'}
                  </Typography>
                  <Box display="flex" gap={1} mb={2}>
                    <Chip
                      label={category.type}
                      size="small"
                      color="primary"
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Created: {formatDate(category.createdAt)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Modified: {formatDate(category.modifiedAt)}
                  </Typography>
                  <Box display="flex" justifyContent="space-between" mt={2}>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleEdit(category)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(category.id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Category Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCategory ? 'Edit Category' : 'Add New Category'}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Category Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
              multiline
              rows={3}
            />
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={formData.type}
                label="Type"
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
              >
                <MenuItem value="apparel">Apparel</MenuItem>
                <MenuItem value="cosmetics">Cosmetics</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingCategory ? 'Update Category' : 'Create Category'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoryManagement;
