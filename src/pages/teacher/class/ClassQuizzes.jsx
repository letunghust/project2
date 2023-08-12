import { useLocation, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { Button, Input, Modal, Space, Switch, Table, Typography } from "antd";
import { parse } from "qs";
import { stringify } from "qs";
import { useSelector } from "react-redux";

import {
    deleteQuizzes,
    getQuizByIdTeacher,
    getQuizzesClassTeacher,
    updateQuiz,
} from "../../../request/quizz.request.js";
import { dayjs } from "../../../utils/dayjs.util.js";
import { getGeolocationPosition } from "../../../utils/geolocation.util.js";

const { Title } = Typography;

export const ClassQuizzes = () => {
    const [loading, setLoading] = useState(true);
    const [currentQuery, setCurrentQuery] = useState({
        page: 1,
        pageSize: 5,
        status: 0,
    });
    const [total, setTotal] = useState(0);
    const [records, setRecords] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [searchQuiz, setSearchQuiz] = useState([]);
    const [allQuiz, setAllQuizzes] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();

    const user = useSelector((state) => state.user);

    const getData = async () => {
        try {
            setLoading(true);

            const query = parse(location.search.slice(1));
            console.log(query);
            query.page = Number(query.page) || 1;
            query.pageSize = Number(query.pageSize) || 5;
            query.status = query.status ? Number(query.status) : undefined;
            setCurrentQuery(query);

            const page = query.page;
            const take = query.pageSize;
            const skip = (page - 1) * take;
            const search = query.search || "";

            const data = await getQuizzesClassTeacher({ classId: id });

            const quizzes = data.records.map((record, index) => ({
                ...record,
                num: index,
            }));
            setTotal(data.total);
            setRecords(quizzes);
            setSearchQuiz(quizzes);
            setAllQuizzes(quizzes);
            setSelectedRowKeys([]);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const handleQuizOpen = async (id, status) => {
        try {
            setLoading(true);
            status = status === true ? 1 : 0;
            const body = { status };
            if (status) {
                const position = await getGeolocationPosition();
                body.position = position;
            }
            console.log(body);
            await updateQuiz(id, body);
            getData();
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
        if (!value) {
            setSearchQuiz(records);
            return;
        }
        const searchQuiz = records.filter((record) => `${record.name}`.toUpperCase().includes(value.toUpperCase()));
        console.log(searchQuiz);
        setSearchQuiz(searchQuiz);
        return;
    };

    const handleDeleteClass = (ids) => {
        Modal.confirm({
            title: "Xoá bài kiểm tra",
            content: "Bạn chắc chắn muốn xoá bài kiểm tra này",
            onOk: async () => {
                await deleteQuizzes(ids);
                await getData();
            },
        });
    };

    const handlePageChange = (page, pageSize) => {
        handleQueryChange({ page, pageSize });
    };

    const getQuizDetails = async (id) => {
        try {
            setLoading(true);
            const data = await getQuizByIdTeacher(id);
            console.log(data);
            const currentUrl = location.pathname;
            navigate(`/teacher/quizzes/${id}/edit`);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: "STT",
            dataIndex: "num",
            render: (item) => `${item + 1}`,
        },
        {
            title: "Tên",
            dataIndex: "name",
            width: "20%",
            render: (item, record) => (
                <a onClick={() => getQuizDetails(record.id)}>
                    <div>{item}</div>
                </a>
            ),
        },
        {
            title: "Close Time",
            dataIndex: "closeTime",
            width: "30%",
            render: (item) => (item ? `${dayjs(item).format("MMMM D, YYYY h:mm A")}` : ""),
        },
        {
            title: "Status",
            dataIndex: "status",
            render: (status) => {
                if (status === 0) return "Chưa mở";
                else if (status === 1) return "Mở";
                else return "Đóng";
            },
        },
        {
            title: "",
            dataIndex: "status",
            align: "center",
            render: (status, record) => (
                <Switch
                    disabled={status === 2 ? true : false}
                    checked={status === 1 ? true : false}
                    onChange={(status) => handleQuizOpen(record.id, status)}
                />
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
                Danh sách Quiz
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
                    onClick={() => navigate("/teacher/create-quiz")}
                >
                    Thêm Quiz mới
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
                dataSource={searchQuiz}
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
