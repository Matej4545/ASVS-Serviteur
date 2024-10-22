import Audit from "./Audit";
import Navbar from "./components/navbar/navbar";
import Report from "./components/report/report";
import { useLocalStorage } from "./lib/localStorageProvider";
import Projects from "./Projects";
const reportParam = "report";

function App() {
  const { data } = useLocalStorage();
  const showReport =
    new URLSearchParams(window.location.search).get(reportParam) === "true";
  return (
    <>
      <Navbar />
      <main>{showReport ? <Report /> : data ? <Audit /> : <Projects />}</main>
    </>
  );
}

export default App;
