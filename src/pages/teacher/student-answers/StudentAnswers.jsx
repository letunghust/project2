import { Input, Space, Table } from "antd";
import Title from "antd/es/typography/Title.js";
import * as dayjs from "dayjs";
import { parse, stringify } from "qs";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { getStudentAnswers } from "../../../request/student-answers.request.js";
import { useSelector } from "react-redux";

export const StudentAnswers = ({ studentId }) => {
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

    const option = useSelector((state) => state.option);

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

            const data = await getStudentAnswers({ classId: option.classId, studentId: id, take, skip, search });
            const records = data.records.map((record, index) => ({
                ...record,
                num: index + 1,
            }));
            console.log(data);
            setQuiz(records);
            setSearchQuiz(records);
            setRecords(records);
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
            title: "Bài kiểm tra",
            dataIndex: "name",
            ellipsis: true,
            align: "center",
            render: (name, record) => <>{name}</>,
        },
        {
            title: "Thời gian nộp",
            dataIndex: "closeTime",
            ellipsis: true,
            align: "center",
            render: (closeTime, record) => (
                <>
                    {record.studentAnswers[0]
                        ? dayjs(record.studentAnswers[0].createAt).format("MMMM D, YYYY h:mm A")
                        : ""}
                </>
            ),
        },
        {
            title: "Điểm",
            dataIndex: "id",
            align: "center",
            render: (id, record) => <>{record.studentAnswers[0] ? record.studentAnswers[0].points : ""}</>,
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
