import { Provider } from 'react-redux';
import './assets/styles/index.scss';
import { store } from './redux/store/index.js';
import { ConfigProvider } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './pages/index.jsx';

function App() {
    return (
        <Provider store={store}>
            <ConfigProvider theme={{ hashed: false }}>
                <BrowserRouter basename={import.meta.env.VITE_BASE_PATH}>
                    <AppRoutes />
                </BrowserRouter>
            </ConfigProvider>
        </Provider>
    );
}

export default App;
