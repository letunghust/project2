import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Button, Input, Space, Table, Typography } from "antd";
import { parse } from "qs";
import { stringify } from "qs";
import { useDispatch, useSelector } from "react-redux";
import { getListClassesOfStudent } from "../../../request/class.request.js";
import { JoinClassModal } from "./JoinClassModal.jsx";
import { rememberClass } from "../../../redux/slice/option.slice.js";

const { Title } = Typography;

export const ListClass = () => {
    const [loading, setLoading] = useState(true);
    const [currentQuery, setCurrentQuery] = useState({
        page: 1,
        pageSize: 10,
        status: 0,
    });
    const [total, setTotal] = useState(0);
    const [records, setRecords] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [searchClass, setSearchClass] = useState();
    const [allClasses, setAllClasses] = useState([]);

    const [isJoinClass, setIsJoinClass] = useState();

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const user = useSelector((state) => state.user);

    const getData = async () => {
        try {
            setLoading(true);

            const query = parse(location.search.slice(1));
            query.page = Number(query.page) || 1;
            query.pageSize = Number(query.pageSize) || 10;
            query.status = query.status ? Number(query.status) : undefined;
            setCurrentQuery(query);

            const page = query.page;
            const take = query.pageSize;
            const skip = (page - 1) * take;
            const search = query.search || "";

            const data = await getListClassesOfStudent({ search, take, skip });
            const _class = data.records.map((record, index) => ({
                ...record,
                num: index,
            }));
            console.log(data);
            setTotal(data.total);
            setRecords(data.records);
            setSearchClass(_class);
            setAllClasses(_class);
            setSelectedRowKeys([]);
        } catch (err) {
            console.log(err);
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

    const handleSearch = async (value) => {
        if (!value) {
            setSearchClass(allClasses);
        }
        const searchClasses = allClasses.filter((record) =>
            `${record.class.name}:${record.class.classNumber}`.toUpperCase().includes(value.toUpperCase())
        );
        console.log(searchClasses);
        setSearchClass(searchClasses);
        return;
    };

    const handlePageChange = (page, pageSize) => {
        handleQueryChange({ page, pageSize });
    };

    const handleJoinClass = (_class) => {
        // setRecords((prev) => [...prev, _class]);
        getData();
    };
    const closeModalJoinClass = () => {
        setIsJoinClass(false);
    };

    const columns = [
        {
            title: "STT",
            dataIndex: "num",
            render: (index) => index + 1,
        },
        {
            title: "Tên",
            dataIndex: "class",
            render: (item) => (
                <a href={`/student/classes/${item.id}/quizzes`}>
                    <div
                        onClick={() => {
                            dispatch(rememberClass({ classId: item.id }));
                        }}
                    >
                        {item.name}
                    </div>
                </a>
            ),
        },
        {
            title: "Description",
            dataIndex: "class",
            render: (item) => `${item.description}`,
        },
        {
            title: "Mã lớp",
            dataIndex: "class",
            render: (item) => `${item.classNumber}`,
        },
        {
            title: "Join Code",
            dataIndex: "class",
            render: (item) => `${item.joinCode}`,
        },
        {
            title: "Trạng thái",
            dataIndex: "waiting",
            render: (waiting) => (waiting ? "Chờ phê duyệt" : "Đã tham gia"),
        },
        {
            title: "",
            dataIndex: "waiting",
            align: "center",
            render: (item, record) => (
                <a>
                    <Button
                        disabled={item}
                        onClick={() => {
                            dispatch(rememberClass({ classId: record.classId }));
                            navigate(`/student/classes/${record.classId}/quizzes`);
                        }}
                    >
                        Điểm danh
                    </Button>
                </a>
            ),
        },
    ];

    useEffect(() => {
        getData();
    }, [location]);

    if (!user) {
        return;
    }

    return (
        <div className="list-page">
            <Title className="title" level={2}>
                Danh sách lớp học
            </Title>
            <JoinClassModal
                isJoinClass={isJoinClass}
                handleJoinClass={handleJoinClass}
                closeModalJoinClass={closeModalJoinClass}
            />
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <Button
                    style={{
                        color: "white",
                        backgroundColor: "green",
                    }}
                    onClick={() => setIsJoinClass(true)}
                >
                    Tham gia lớp
                </Button>
                <Space direction="vertical" align="end">
                    <Space>
                        <Input.Search
                            size="default"
                            placeholder="Tìm kiếm mã lớp/tên lớp"
                            enterButton
                            onSearch={(value) => handleSearch(value)}
                            allowClear
                        />
                    </Space>
                    <div></div>
                </Space>
            </div>
            <Table
                size="middle"
                className="mt-24"
                rowKey={(record) => record.id}
                rowSelection={{
                    selectedRowKeys,
                    onChange: (keys) => {
                        setSelectedRowKeys(keys);
                    },
                }}
                loading={loading}
                columns={columns}
                dataSource={searchClass}
                pagination={{
                    current: currentQuery.page,
                    pageSize: currentQuery.pageSize,
                    total: total,
                    onChange: handlePageChange,
                }}
            />
        </div>
    );
};
