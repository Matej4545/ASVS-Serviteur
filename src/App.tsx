import Audit from "./Audit";
import Navbar from "./components/navbar/navbar";
import Report2 from "./components/report/report2";
import { useLocalStorage } from "./lib/localStorageProvider";
import Projects from "./Projects";
const reportParam = "report";

function App() {
  const { data } = useLocalStorage();
  const params = new URLSearchParams(window.location.search);
  const showReport = params.get(reportParam) === "true";

  return (
    <div className="min-h-screen  bg-slate-50 text-slate-900 font-sans">
      <div className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute -top-24 right-12 h-72 w-72 rounded-full bg-gradient-to-br from-orange-200 via-amber-100 to-transparent opacity-80 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-10 h-64 w-64 rounded-full bg-gradient-to-tr from-slate-200 via-white to-transparent opacity-70 blur-3xl" />
        <div className="absolute inset-0 bg-grid opacity-40" />
        <Navbar />

        <main className="relative">
          {showReport ? <Report2 /> : data ? <Audit /> : <Projects />}
        </main>
      </div>
    </div>
  );
}

export default App;
