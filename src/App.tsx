import Audit from "./Audit";
import Navbar from "./components/navbar/navbar";
import Report from "./components/report/report";
import { useLocalStorage } from "./lib/localStorageProvider";
import Projects from "./Projects";
const reportPath = "report"

function App() {
  const { data } = useLocalStorage();
  const location = window.location.pathname;
  return (
    <>
      <Navbar />
      <main>
        {location.includes(reportPath) ? <Report /> :
        data ? <Audit /> : <Projects />}
      </main>
    </>
  );
}


export default App;


