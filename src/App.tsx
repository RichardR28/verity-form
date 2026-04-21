import { useState, useCallback } from "react"
import { Card } from "@/components"
import { PersonalData, AddressData, ProfessionalData, Summary } from "./views"
import Logo from "./assets/logoVRT.png"

function App() {
  const [page, setPage] = useState<number>(0);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, [])

  return (
    <main className="p-[8px] h-full w-full flex flex-col gap-4 justify-center items-center">
      <img id="verityLogo" src={Logo} alt="Logo" />
      <h1 className="font-bold text-gray-600">Formulário</h1>
      <Card>
        <div className={page === 0 ? "block" : "hidden"}>
          <PersonalData onPageChange={handlePageChange} />
        </div>
        <div className={page === 1 ? "block" : "hidden"}>
          <AddressData onPageChange={handlePageChange} />
        </div>
        <div className={page === 2 ? "block" : "hidden"}>
          <ProfessionalData onPageChange={handlePageChange} />
        </div>
        <div className={page === 3 ? "block" : "hidden"}>
          <Summary onPageChange={handlePageChange} />
        </div>
      </Card>
    </main>
  )
}

export default App
