import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';

export const Error404 = () => (
    <Result
        status="404"
        title="Page not found"
        extra={
            <Link to="/">
                <Button type="primary">Back Home</Button>
            </Link>
        }
    />
);
