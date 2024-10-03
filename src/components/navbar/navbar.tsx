interface INavbarProps {
    handleLevelSelect: (level: number) => void,
}

function Navbar(props: INavbarProps)
{
    const {handleLevelSelect} = props;
return(
    <div id="banner" className="h-12 border-b-2 w-full ">
        <div className="max-w-screen-xl mx-auto flex gap-1 py-4 px-1 w-full h-full">
        <div className="grow items-center flex gap-1">
        <img src="/asvs-serviteur.svg" className="h-14" style={{color: "red"}} />
        <h1>OWASP ASVS Serviteur</h1>
        </div>
        
        <select
          onChange={(e) => {
            handleLevelSelect(parseInt(e.target.value))
          }}
          className="grow-0 h-max"
          defaultValue="1"
        >
          <option value="1">Level 1</option>
          <option value="2">Level 2</option>
          <option value="3">Level 3</option>
        </select>
        </div>
        
      </div>
)
}

export default Navbar;