import { createTheme } from '@mui/material/styles';

export const adminTheme = createTheme({
  palette: {
    primary: { main: '#167a69', dark: '#105d50', light: '#e8f4f0' },
    secondary: { main: '#64748b' },
    background: { default: '#f5f7fa', paper: '#ffffff' },
    text: { primary: '#1c2b3a', secondary: '#738091' },
    divider: '#e8edf2',
  },
  typography: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h4: { fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.6px' },
    h5: { fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.4px' },
    h6: { fontSize: '1.1rem', fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: { defaultProps: { disableElevation: true }, styleOverrides: { root: { borderRadius: 8, padding: '9px 16px' } } },
    MuiPaper: { defaultProps: { elevation: 0 }, styleOverrides: { root: { border: '1px solid #e8edf2', backgroundImage: 'none' } } },
    MuiCard: { styleOverrides: { root: { boxShadow: 'none' } } },
    MuiTableCell: { styleOverrides: {
      root: { borderBottom: '1px solid #edf1f5', padding: '14px 16px', fontSize: '0.82rem' },
      head: { background: '#f8fafc', color: '#738091', fontWeight: 600, whiteSpace: 'nowrap', fontSize: '0.75rem' },
    } },
    MuiTableRow: { styleOverrides: { root: { '&:last-child td': { borderBottom: 0 }, '&:hover td': { backgroundColor: '#f8fbfa' } } } },
    MuiChip: { styleOverrides: { root: { borderRadius: 6, fontWeight: 500, fontSize: '0.72rem' } } },
    MuiOutlinedInput: { styleOverrides: { root: { borderRadius: 8, backgroundColor: '#fff' }, notchedOutline: { borderColor: '#dfe5eb' } } },
    MuiDialog: { styleOverrides: { paper: { borderRadius: 16 } } },
    MuiDialogTitle: { styleOverrides: { root: { padding: '24px 24px 16px', fontWeight: 700 } } },
    MuiDialogActions: { styleOverrides: { root: { padding: '16px 24px', borderTop: '1px solid #e8edf2' } } },
    MuiTablePagination: { styleOverrides: { toolbar: { flexWrap: 'wrap', padding: '8px 16px' } } },
  },
});
