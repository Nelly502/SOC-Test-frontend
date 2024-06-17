import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';

export const Error403 = () => (
    <Result
        status="403"
        title="Không được phép"
        extra={
            <Link to="/">
                <Button type="primary">Trang chủ</Button>
            </Link>
        }
    />
);
