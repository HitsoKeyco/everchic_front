import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#90caf9',
        },
        secondary: {
            main: '#f48fb1',
        },
        background: {
            default: '#121212',
            paper: '#1e1e1e',
        },
        text: {
            primary: '#ffffff',
            secondary: '#b0b0b0',
        },
    },
    components: {
        MuiAutocomplete: {
            styleOverrides: {
                root: {
                    color: '#ffffff',
                    backgroundColor: '#1e1e1e',
                },
                paper: {
                    backgroundColor: '#2e2e2e',
                },
                listbox: {
                    backgroundColor: '#2e2e2e',
                },
                option: {
                    '&[aria-selected="true"]': {
                        backgroundColor: '#3e3e3e',
                    },
                    '&:hover': {
                        backgroundColor: '#3e3e3e',
                    },
                },
            },
        },
    },
});

const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
        background: {
            default: '#fafafa',
            paper: '#ffffff',
        },
        text: {
            primary: '#000000',
            secondary: '#666666',
        },
    },
    components: {
        MuiAutocomplete: {
            styleOverrides: {
                root: {
                    color: '#000000',
                    backgroundColor: '#ffffff',
                },
                paper: {
                    backgroundColor: '#ffffff',
                },
                listbox: {
                    backgroundColor: '#ffffff',
                },
                option: {
                    '&[aria-selected="true"]': {
                        backgroundColor: '#f0f0f0',
                    },
                    '&:hover': {
                        backgroundColor: '#f0f0f0',
                    },
                },
            },
        },
    },
});

export { darkTheme, lightTheme };
