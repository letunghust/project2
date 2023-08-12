import { Table, Space, Modal, Button, Input } from "antd";
import { useLocation, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { AddMemberModal } from "./AddMemberModal.jsx";
import { deleteMember, getMembersTeacher } from "../../../../request/class-members.request.js";
import { parse, stringify } from "qs";
import { AcceptMembers } from "./AcceptMember.jsx";

export const Teacher = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [currentQuery, setCurrentQuery] = useState({
        page: 1,
        pageSize: 5,
    });
    const [total, setTotal] = useState();
    const { id } = useParams();
    const location = useLocation();

    const [loading, setLoading] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [allTeachers, setAllTeachers] = useState([]);
    const [isAddingMember, setIsAddingMember] = useState(false);
    const [allMembers, setAllMembers] = useState([]);

    const navigate = useNavigate();

    const getData = async () => {
        try {
            setLoading(true);

            const query = parse(location.search.slice(1));
            console.log(query);
            query.page = Number(query.page) || 1;
            query.pageSize = Number(query.pageSize) || 5;
            setCurrentQuery(query);

            const page = query.page;
            const take = query.pageSize;
            const skip = (page - 1) * take;
            const search = query.search || "";

            const data = await getMembersTeacher({ classId: parseInt(id) });

            const teachers = data.teachers.records.map((record, index) => ({
                ...record.user,
                fullName: `${record.user.firstName} ${record.user.lastName}`,
                num: index,
            }));
            console.log(teachers);
            setTeachers(teachers);
            setAllTeachers(teachers);
            setSelectedRowKeys([]);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const handleQueryChange = (newQuery) => {
        const query = {
            ...currentQuery,
            ...newQuery,
        };
        const queryString = stringify(query);

        navigate({
            search: queryString,
        });
    };

    const handlePageChange = (page) => {
        handleQueryChange({ page });
    };

    //search member
    const handleSearchMember = (value) => {
        if (!value) {
            setTeachers(allTeachers);
            return;
        }
        let searchMembers = teachers.filter((member) => {
            if (member.role === 1) return `${member.fullName}`.toUpperCase().includes(value.toUpperCase());
            return `${member.studentNumber}: ${member.fullName}`.toUpperCase().includes(value.toUpperCase());
        });
        return setTeachers(searchMembers);
    };

    const handleDeleteTeacher = (ids) => {
        Modal.confirm({
            title: "Xoá thành viên",
            content: "Bạn muốn chắc chắn xoá thành viên này",
            onOk: async () => {
                await deleteMember(id, ids);
                await getData();
            },
        });
    };

    const addNewMember = (user) => {
        setAllMembers((prevState) => [...prevState, user]);
    };

    const closeAddMemberModal = () => {
        setIsAddingMember(false);
    };

    useEffect(() => {
        getData();
    }, [location.search]);

    let teacherColumns = [
        {
            title: "STT",
            dataIndex: "number",
            key: "number",
            width: "10%",
            align: "center",
            render: (text, record, index) => <>{index + 1}</>,
        },
        {
            title: "Mã số Giảng viên",
            dataIndex: "number",
            key: "number",
            ellipsis: true,
            width: "20%",
            align: "center",
        },
        {
            title: "Họ và tên",
            dataIndex: "fullName",
            key: "fullName",
            ellipsis: true,
            align: "center",
        },
        {
            title: "Email",
            dataIndex: "email",
            width: "40%",
            align: "center",
            render: (_, record) => <>{record.email}</>,
        },
    ];

    return (
        <section>
            <div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        // direction: "row",
                    }}
                >
                    <Button
                        onClick={() => setIsAddingMember(true)}
                        style={{
                            backgroundColor: "green",
                            color: "white",
                        }}
                    >
                        Thêm thành viên
                    </Button>
                    <Space>
                        <Input.Search
                            allowClear
                            size="default"
                            placeholder="Tìm kiếm thành viên"
                            enterButton
                            onSearch={(value) => handleSearchMember(value)}
                        />
                        <Button
                            style={{
                                backgroundColor: "red",
                                color: "white",
                            }}
                            onClick={() => handleDeleteTeacher(selectedRowKeys)}
                        >
                            Xoá
                        </Button>
                    </Space>
                </div>
            </div>
            <Space direction="vertical">
                <Table
                    size="middle"
                    columns={teacherColumns}
                    dataSource={teachers}
                    rowKey={(record) => record.id}
                    rowSelection={{
                        selectedRowKeys,
                        onChange: (keys) => {
                            setSelectedRowKeys(keys);
                        },
                    }}
                    loading={loading}
                    // bordered
                    className="mt-24"
                    pagination={{
                        current: currentQuery.page,
                        pageSize: currentQuery.pageSize,
                        total: total,
                        onChange: handlePageChange,
                    }}
                />
            </Space>
            <AddMemberModal
                isAddingMember={isAddingMember}
                closeAddMemberModal={closeAddMemberModal}
                id={id}
                addNewMember={async () => {
                    addNewMember();
                    await getData();
                }}
            />
        </section>
    );
};
