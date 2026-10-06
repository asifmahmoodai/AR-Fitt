import React from 'react';
import { Box, Button, Chip, Grid, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import { FilterListRounded, RestartAltRounded } from '@mui/icons-material';

export const AdminPageHeader = ({ title, description, children }: { title: string; description: string; children?: React.ReactNode }) => (
  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} sx={{ mb: 3 }}>
    <Box><Typography variant="h4" component="h1">{title}</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: .75 }}>{description}</Typography></Box>
    {children && <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>{children}</Stack>}
  </Stack>
);

export const AdminStats = ({ items }: { items: { label: string; value: number; detail: string; icon: React.ReactNode }[] }) => (
  <Grid container spacing={2} sx={{ mb: 3 }}>
    {items.map((item) => <Grid item xs={4} key={item.label}>
      <Paper sx={{ p: { xs: 1.5, sm: 2.25 }, display: 'flex', gap: 2, alignItems: 'center', height: '100%' }}>
        <Box sx={{ width: 44, height: 44, flexShrink: 0, borderRadius: 2, display: { xs: 'none', sm: 'grid' }, placeItems: 'center', bgcolor: 'primary.light', color: 'primary.main' }}>{item.icon}</Box>
        <Box><Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: 12, sm: 14 }, minHeight: { xs: 34, sm: 'auto' } }}>{item.label}</Typography><Typography variant="h5" sx={{ lineHeight: 1.5 }}>{item.value.toLocaleString()}</Typography><Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>{item.detail}</Typography></Box>
      </Paper>
    </Grid>)}
  </Grid>
);

export const AdminFilters = ({ count, onClear, children }: { count: number; onClear: () => void; children: React.ReactNode }) => (
  <Paper sx={{ p: { xs: 2, md: 2.5 }, mb: 2.5 }}>
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
      <Stack direction="row" spacing={1} alignItems="center"><FilterListRounded fontSize="small" color="primary" /><Typography variant="subtitle2" fontWeight={600}>Filters</Typography>{count > 0 && <Chip size="small" label={`${count} active`} sx={{ bgcolor: 'primary.light', color: 'primary.main' }} />}</Stack>
      <Button size="small" startIcon={<RestartAltRounded />} onClick={onClear} disabled={count === 0}>Clear filters</Button>
    </Stack>
    <Grid container spacing={1.5}>{children}</Grid>
  </Paper>
);

export const AdminSelect = ({ label, value, onChange, options }: {
  label: string; value: string; onChange: (value: string) => void; options: { value: string; label: string }[];
}) => (
  <TextField select fullWidth size="small" label={label} value={value} onChange={(event) => onChange(event.target.value)}>
    {options.map((option) => <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>)}
  </TextField>
);

export const AdminEmptyState = ({ title, description, onClear }: { title: string; description: string; onClear?: () => void }) => (
  <Box sx={{ py: 6, px: 2, textAlign: 'center' }}>
    <Box sx={{ mb: 1.5, color: 'text.secondary' }}><FilterListRounded sx={{ fontSize: 32 }} /></Box>
    <Typography variant="h6">{title}</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: .5, mb: 2 }}>{description}</Typography>
    {onClear && <Button variant="outlined" onClick={onClear}>Clear filters</Button>}
  </Box>
);
