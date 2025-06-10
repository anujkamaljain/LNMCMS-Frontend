import { useEffect } from "react";
import { useSelector } from "react-redux";
import Navbar from "./components/Navbar";

function App() {
  const theme = useSelector((state) => state.theme.theme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <>
      <Navbar />
    </>
  );
}

export default App;
