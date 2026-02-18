import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import MainPage from './pages/MainPage';
import { Toaster } from '@/components/ui/sonner';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
                <MainPage />
                <Toaster />
            </ThemeProvider>
        </QueryClientProvider>
    );
}

export default App;
