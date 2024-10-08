import { useState } from "react";
import { useLocalStorage } from "./lib/localStorageProvider";

function Projects() {
    const [name, setName] = useState("");
    const [date, setDate] = useState(new Date())
    const [level, setLevel] = useState(2);
    const [data, setData] = useState("")
    const { createNewProject, loadExistingProject } = useLocalStorage();


    function handleSubmit(e: any): void {
        e.preventDefault();
        createNewProject(name, date, level)
    }


    function handleLoad(e: any): void {
        e.preventDefault();
        loadExistingProject(data)
    }

    return(<div className="">
    <form action="" className="border rounded-lg flex flex-col p-6 max-w-lg mx-auto gap-1">
    <h1 className="pb-8">Create new project</h1>
    <label htmlFor="name">What is the project called?</label>
        <input type="text" name="name" placeholder="Project name" value={name} onChange={(e) => setName(e.target.value)} className="border rounded-sm p-1 min-w-24"/>
        <label htmlFor="date">Date of audit</label>
        <input type="text" name="date" placeholder="Audit date" value={date.toLocaleDateString()} onChange={(e) => setDate(new Date(Date.parse(e.target.value)))} className="border rounded-sm p-1 min-w-24"/>
        <label htmlFor="level">Target level</label>
        <select
          onChange={(e) => {
            setLevel(parseInt(e.target.value))
          }}
          className="border rounded-sm p-1 min-w-24"
          defaultValue={level}
        >
          <option value="1">Level 1</option>
          <option value="2">Level 2</option>
          <option value="3">Level 3</option>
        </select>
          <button className="border rounded-md w-fit px-2 mt-6 py-1 hover:bg-orange-600 hover:text-white transition mx-auto" onClick={handleSubmit}>Start Auditing 🚀</button>
    </form>
    <div className="text-center font-bold py-5 text-xl">OR</div>
    <form action="" className="border rounded-lg flex flex-col p-6 max-w-lg mx-auto gap-1">
    <h1 className="pb-8">Load data from existing project</h1>
    <label htmlFor="content">Copy and paste progress down below</label>
        <textarea  name="content" placeholder="Project data..." value={data} onChange={(e) => setData(e.target.value)} className="border rounded-sm p-1 min-w-24 min-h-48"/>
        
          <button className="border rounded-md w-fit px-2 mt-6 py-1 hover:bg-orange-600 hover:text-white transition mx-auto" onClick={handleLoad}>Continue where I left off 🕐</button>
    </form>

    </div>)
}

export default Projects;