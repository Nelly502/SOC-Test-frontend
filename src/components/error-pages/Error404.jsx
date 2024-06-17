import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';

export const Error404 = () => (
    <Result
        status="404"
        title="Không thấy trang"
        extra={
            <Link to="/">
                <Button type="primary">Trang chủ</Button>
            </Link>
        }
    />
);
