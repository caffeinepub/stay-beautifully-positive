import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import MainPage from './pages/MainPage';
import { Toaster } from '@/components/ui/sonner';

function App() {
    return (
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            <MainPage />
            <Toaster />
        </ThemeProvider>
    );
}

export default App;
