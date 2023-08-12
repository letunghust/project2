import "./App.css";
import { Provider } from "react-redux";
import { store } from "./redux/store/index.js";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./pages/index.js";

function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </Provider>
    );
}

export default App;
