import "../../assets/styles/register.css";

export const RegisterLayout = ({ children }) => {
    return (
        <div
            className="register-layout"
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
            }}
        >
            <img
                src="https://soict.hust.edu.vn/wp-content/uploads/logo-soict-hust-1.png"
                alt=""
                className="register-img"
            />
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                }}
            >
                {children}
            </div>
        </div>
    );
};
