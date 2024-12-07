
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Products from '../Pages/Products';
import { darkTheme, lightTheme } from '../utils/theme';

const App = () => {
    
    return (
        <ThemeProvider theme={lightTheme}>
            <CssBaseline />
            <Products />
        </ThemeProvider>
    );
};

export default App;
