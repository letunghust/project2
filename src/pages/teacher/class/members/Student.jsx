import { Table, Space, Modal, Button, Input } from "antd";
import { useLocation, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { AddMemberModal } from "./AddMemberModal.jsx";
import { checkAttendance, deleteMember, getMembersTeacher } from "../../../../request/class-members.request.js";
import { parse, stringify } from "qs";
import { AcceptMembers } from "./AcceptMember.jsx";

export const Student = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [currentQuery, setCurrentQuery] = useState({
        page: 1,
        pageSize: 5,
    });
    const [total, setTotal] = useState();
    const { id } = useParams();
    const location = useLocation();

    const [loading, setLoading] = useState(false);
    const [students, setStudents] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    const [isAddingMember, setIsAddingMember] = useState(false);
    const [allMembers, setAllMembers] = useState([]);

    const [isAccept, setIsAccept] = useState(false);
    const handelAccept = () => {
        getData();
    };
    const handleCancelAccept = () => {
        setIsAccept(false);
    };

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
            const insideStudents = data.students.records.filter((record) => record.waiting === false);
            const students = insideStudents.map((record, index) => ({
                ...record.user,
                fullName: `${record.user.firstName} ${record.user.lastName}`,
                num: index,
            }));

            for (const student of students) {
                // console.log(student);
                const total = await checkAttendance({ classId: id, userId: student.id });

                student.off = total.quizTotal - total.answerTotal;
            }
            console.log(students);
            setStudents(students);
            setAllStudents(students);
            setTotal(data.students.total);
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
            setStudents(allStudents);
            return;
        }
        let searchMembers = students.filter((member) =>
            `${member.fullName}: ${member.number}`.toUpperCase().includes(value.toUpperCase())
        );
        console.log(students);
        setStudents(searchMembers);
        console.log(searchMembers);
        return;
    };

    const handleDeleteStudent = (ids) => {
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
        // fetchData();
        getData();
    }, [location.search]);

    let studentColumns = [
        {
            title: "STT",
            dataIndex: "num",
            ellipsis: true,
            align: "center",
            width: "10%",
            render: (text, record, index) => <>{index + 1}</>,
        },
        {
            title: "Mã số Sinh viên",
            dataIndex: "number",
            key: "number",
            width: "20%",
            ellipsis: true,
            align: "center",
        },
        {
            title: "Họ và tên",
            dataIndex: "fullName",
            key: "fullName",
            ellipsis: true,
            align: "center",
            render: (name, record) => <>{name}</>,
        },
        {
            title: "Email",
            dataIndex: "email",
            width: "40%",
            align: "center",
            render: (_, record) => <>{record.email}</>,
        },
        {
            title: "Số buổi vắng",
            dataIndex: "off",
            align: "center",
            render: (off) => <>{off}</>,
        },
        {
            title: "",
            dataIndex: "id",
            align: "center",
            render: (id, record) => <a href={`/teacher/student-answers/${record.id}`}>Bài nộp</a>,
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
                    <Button
                        onClick={() => setIsAccept(true)}
                        style={{
                            color: "white",
                            backgroundColor: "#225ebe",
                        }}
                    >
                        Phê duyệt
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
                            onClick={() => handleDeleteStudent(selectedRowKeys)}
                        >
                            Xoá
                        </Button>
                    </Space>
                </div>
            </div>
            <Space direction="vertical">
                <Table
                    size="middle"
                    columns={studentColumns}
                    dataSource={students}
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
            <AcceptMembers isOpen={isAccept} onOK={handelAccept} onCancel={handleCancelAccept} id={id} />
        </section>
    );
};
