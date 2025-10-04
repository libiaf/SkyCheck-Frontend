import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Principal from "../pages/principal";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
        {
            path: "/principal",
            element: <Principal />
        }
    ]
  },
]);

export default router;