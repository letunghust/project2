import "../../assets/styles/login.css";

export const LoginLayout = ({ children }) => {
    return (
        <div
            className="login-layout"
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div
                className="login-img"
                style={{
                    flex: 2,
                }}
            ></div>
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    flexDirection: "column",
                }}
                className="login-container"
            >
                {children}
            </div>
        </div>
    );
};
