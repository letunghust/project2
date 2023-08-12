import { Tabs, Table } from "antd";
import { Teacher } from "./Teacher.jsx";
import { Student } from "./Student.jsx";

export const ClassMembers = () => {
    const items = [
        {
            key: "teacher",
            label: "Teacher",
            children: <Teacher />,
        },
        {
            key: "student",
            label: "Student",
            children: <Student />,
        },
    ];

    return (
        <div className="relative">
            <Tabs items={items}></Tabs>
        </div>
    );
};
