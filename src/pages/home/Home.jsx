import React, { useEffect } from "react";

import "react-slideshow-image/dist/styles.css";

import "../../assets/styles/styles.css";
import { Content } from "antd/es/layout/layout.js";

const spanStyle = {
    padding: "20px",
    background: "#efefef",
    color: "#000000",
};

const divStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundSize: "cover",
    height: "450px",
};
const slideImages = [
    {
        url: "https://reviewedu.net/wp-content/uploads/2021/08/dai-hoc-bach-khoa-ha-noi-hust-1-1-1.jpg",
    },
    {
        url: "https://dlcorp.com.vn/wp-content/uploads/2021/09/Ba%CC%81ch-Khoa-600x301.png",
    },
    {
        url: "https://ts.hust.edu.vn/public/uploads/p6il-banne-01.jpg",
    },
];

export const Home = () => {
    return <div className="home-content"></div>;
};
