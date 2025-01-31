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
            paper: '#0a0a0b',
        },
        text: {
            primary: '#ffffff',
            secondary: '#b0b0b0',
        },
    },
    components: {
        MuiAccordionSummary: {
            styleOverrides: {
                root: {
                    backgroundColor: '#121212',
                },
                content: {
                    color: '#ffffff',
                },

            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: '#080808',
                    borderRadius: '15px',
                },
                content: {
                    color: '#ffffff',
                }
            }
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    color: '#ffffff',
                    backgroundColor: '#121212',

                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                notchedOutline: {
                    borderWidth: '2px',
                    borderColor: '#8a8a8a5a',
                },
            },
        },
    }
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
            default: '#f3f3f3',
            paper: '#ffffff',
        },
        text: {
            primary: '#000000',
            secondary: '#666666',
        },
    },
    components: {
        MuiAccordionSummary: {
            styleOverrides: {
                root: {                    
                    backgroundColor: '#f1f1f1f1',                    
                },
                content: {
                    color: '#000000',

                },



            }
        },
        MuiOutlinedInput: {
            styleOverrides: {                
                    notchedOutline: {
                        borderWidth: '2px',
                        borderColor: '#8a8a8a5a',
                    },
            },
        },
    },
});

export { darkTheme, lightTheme };
