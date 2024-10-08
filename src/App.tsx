import Audit from "./Audit";
import Navbar from "./components/navbar/navbar";
import { useLocalStorage } from "./lib/localStorageProvider";
import Projects from "./Projects";

function App() {
  const { data } = useLocalStorage();

  return (
    <>
      <Navbar />
      <main>
        {data ? <Audit /> : <Projects />}
      </main>
    </>
  );
}


export default App;


