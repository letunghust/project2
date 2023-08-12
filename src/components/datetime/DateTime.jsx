import { DatePicker, Space } from "antd";
const onChange = (value, dateString) => {
    console.log("Selected Time: ", value);
    console.log("Formatted Selected Time: ", dateString);
};
const onOk = (value) => {
    console.log("onOk: ", value);
};
export const DateTime = () => (
    <Space direction="vertical" size={12}>
        <DatePicker showTime onChange={onChange} onOk={onOk} />
    </Space>
);
