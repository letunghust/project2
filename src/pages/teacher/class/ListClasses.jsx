import { useLocation, useNavigate, useParams } from "react-router";
import { deleteClasses, getClassOfTeacherById, getListClassesOfTeacher } from "../../../request/class.request.js";
import { useEffect, useState } from "react";
import { Button, Input, Modal, Space, Table, Typography } from "antd";
import { parse } from "qs";
import { stringify } from "qs";
import { useDispatch, useSelector } from "react-redux";
import { AiFillEdit } from "react-icons/ai";
import { rememberClass } from "../../../redux/slice/option.slice.js";
import { GiNotebook } from "react-icons/gi";
import { CreateClass } from "./CreateClass.jsx";
import { ClassSetting } from "./ClassSetting.jsx";

const { Title } = Typography;

export const ListClasses = () => {
    const [loading, setLoading] = useState(true);
    const [currentQuery, setCurrentQuery] = useState({
        page: 1,
        pageSize: 4,
        status: 0,
    });
    const [total, setTotal] = useState(0);
    const [records, setRecords] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [searchClass, setSearchClass] = useState([]);
    const [isAddingClass, setIsAddingClass] = useState(false);
    const [isSettingClass, setIsSettingClass] = useState(false);
    const [_class, setClass] = useState();

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();
    const option = useSelector((state) => state.option);

    const [allClasses, setAllClasses] = useState([]);

    const user = useSelector((state) => state.user);

    const getData = async () => {
        try {
            setLoading(true);

            const query = parse(location.search.slice(1));
            console.log(query);
            query.page = Number(query.page) || 1;
            query.pageSize = Number(query.pageSize) || 4;
            query.status = query.status ? Number(query.status) : undefined;
            setCurrentQuery(query);

            const page = query.page;
            const take = query.pageSize;
            const skip = (page - 1) * take;
            const search = query.search || "";

            const data = await getListClassesOfTeacher({});
            setTotal(data.total);
            setRecords(data.records);
            setSearchClass(data.records);
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

    const handleSearch = (value) => {
        const searchClasses = records.filter((record) =>
            `${record.class.name}:${record.class.classNumber}`.toUpperCase().includes(value.toUpperCase())
        );
        console.log(searchClasses);
        setSearchClass(searchClasses);
        return;
    };

    const handleDeleteClass = (ids) => {
        Modal.confirm({
            title: "Xoá lớp học",
            content: "Bạn chắc chắn muốn xoá lớp học này",
            onOk: async () => {
                await deleteClasses(ids);
                await getData();
            },
        });
    };

    const handlePageChange = (page, pageSize) => {
        handleQueryChange({ page, pageSize });
    };

    const columns = [
        {
            title: "Mã lớp",
            dataIndex: "class",
            render: (item) => `${item.classNumber}`,
        },
        {
            title: "Tên",
            dataIndex: "class",
            width: "20%",
            render: (item) => (
                <a href={`/teacher/classes/${item.id}/members`}>
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
            width: "30%",
            render: (item) => `${item.description}`,
        },
        {
            title: "Join Code",
            dataIndex: "class",
            render: (item) => `${item.joinCode}`,
        },
        {
            title: "Trạng thái",
            width: "10%",
            dataIndex: "class",
            render: (item) => (item.requirePermission === true ? "Required" : "Not Required"),
        },
        {
            title: "",
            dataIndex: "class",
            align: "center",
            render: (item) => (
                <a>
                    <AiFillEdit
                        onClick={async () => {
                            const data = await getClassOfTeacherById(item.id);
                            setClass(data);
                            setIsSettingClass(true);
                            dispatch(rememberClass({ classId: item.id }));
                        }}
                    />
                </a>
            ),
        },
        {
            title: "",
            dataIndex: "class",
            align: "center",
            render: (item) => (
                //     <a>
                //         <GiNotebook
                //             onClick={() => {
                //                 dispatch(rememberClass({ classId: item.id }));
                //                 navigate(`/teacher/classes/${item.id}/quizzes`);
                //             }}
                //         />
                //     </a>
                // ),

                <Button
                    onClick={() => {
                        dispatch(rememberClass({ classId: item.id }));
                        navigate(`/teacher/classes/${item.id}/quizzes`);
                    }}
                >
                    Quiz
                </Button>
            ),
        },
    ];

    const handleAddNewClass = (classes) => {
        setAllClasses((prev) => [...prev, classes]);
    };

    const handleSettingClass = () => {
        setClass((prev) => [...prev, _class]);
    };

    const handleCancelModel = () => {
        setIsAddingClass(false);
        setIsSettingClass(false);
    };

    const onUpdate = () => {
        getData();
    };

    useEffect(() => {
        getData();
    }, [location]);

    if (!user) {
        return;
    }
    return (
        <div className="list-page">
            <CreateClass isOpen={isAddingClass} onOk={handleAddNewClass} onCancel={handleCancelModel} />
            <ClassSetting
                isOpen={isSettingClass}
                onOk={handleAddNewClass}
                onCancel={handleCancelModel}
                _class={_class}
                onUpdate={onUpdate}
            />
            <Title className="title" level={2}>
                Danh sách lớp học
            </Title>
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
                    onClick={() => setIsAddingClass(true)}
                >
                    Thêm lớp
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
                        <Button
                            onClick={() => handleDeleteClass(selectedRowKeys)}
                            style={{
                                backgroundColor: "red",
                                color: "white",
                            }}
                        >
                            Xoá
                        </Button>
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
