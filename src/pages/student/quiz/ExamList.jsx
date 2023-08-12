import { Table, Space, Input, Button, message } from "antd";
import { useLocation, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { getQuizByIdStudent, getQuizzesClassStudent } from "../../../request/quizz.request.js";
import { geolocationToDistance, getGeolocationPosition } from "../../../utils/geolocation.util.js";
import dayjs from "dayjs";
import Title from "antd/es/typography/Title.js";
import { parse, stringify } from "qs";

export const ExamList = ({ ClassId }) => {
    const [loading, setLoading] = useState(false);
    const [currentQuery, setCurrentQuery] = useState({
        page: 1,
        pageSize: 4,
        status: 0,
    });
    const [quiz, setQuiz] = useState([]);
    const [searchQuiz, setSearchQuiz] = useState();
    const [records, setRecords] = useState([]);
    const [total, setTotal] = useState(0);
    const { id } = useParams();
    const navigate = useNavigate();

    const fetchData = async () => {
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

            const data = await getQuizzesClassStudent({ classId: id });
            const records = data.records.map((record, index) => ({
                ...record,
                num: index + 1,
            }));
            console.log(data);
            setQuiz(records);
            setSearchQuiz(records);
            setRecords(records);
            setLoading(false);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const CheckQuizPoint = async (id) => {
        try {
            setLoading(true);
            const data = await getQuizByIdStudent(id);
            console.log(data);
            if (data.studentAnswers[0]) {
                navigate(`/student/quizzes/${id}`);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const doQuiz = async (id) => {
        try {
            setLoading(true);
            const data = await getQuizByIdStudent(id);
            console.log(data);

            const position = await getGeolocationPosition();
            console.log({ p1: data.position, p2: position });
            console.log(geolocationToDistance(data.position, position));
            if (!data.position) message.success("Bài kiểm tra chưa mở");
            else if (geolocationToDistance(data.position, position) >= 50) message.success("Quá xa");
            else navigate(`/student/quizzes/${id}`);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const location = useLocation();

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

    const handlePageChange = (page, pageSize) => {
        handleQueryChange({ page, pageSize });
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

    useEffect(() => {
        fetchData();
    }, [location.search]);

    let quizColumns = [
        {
            title: "STT",
            dataIndex: "num",
            width: "10%",
            align: "center",
            render: (index) => <a>{index}</a>,
        },
        {
            title: "Tên",
            dataIndex: "name",
            ellipsis: true,
            align: "center",
            render: (name, record) => <a onClick={() => CheckQuizPoint(record.id)}>{name}</a>,
        },
        {
            title: "Hạn",
            dataIndex: "closeTime",
            ellipsis: true,
            align: "center",
            render: (closeTime) => <>{closeTime ? dayjs(closeTime).format("MMMM D, YYYY h:mm A") : ""}</>,
        },
        {
            title: "Điểm",
            dataIndex: "id",
            align: "center",
            render: (id, record) => <>{record.studentAnswers[0] ? record.studentAnswers[0].points : ""}</>,
        },
        {
            title: "",
            dataIndex: "id",
            width: "20%",
            align: "center",
            render: (index, record) => (
                // href={`/student/quizzes/${index}`}
                <a>
                    <Button
                        onClick={() => doQuiz(index)}
                        disabled={record.status !== 1 || record.studentAnswers[0] ? true : false}
                    >
                        Làm bài
                    </Button>
                </a>
            ),
        },
    ];

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
                <div></div>
                <Space direction="vertical" align="end">
                    <Space>
                        <Input.Search
                            size="default"
                            placeholder="Tìm kiếm"
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
                loading={loading}
                columns={quizColumns}
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
