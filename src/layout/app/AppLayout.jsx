import { AppHeader } from './AppHeader.jsx';

export const AppLayout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <AppHeader />
            <main className="px-6 pt-6 flex-1 flex flex-col">{children}</main>
        </div>
    );
};
