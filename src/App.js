import { HashRouter, Route, Routes } from "react-router-dom";
import Simple from './components/infiniteScroll/Simple'
import Virtualized from './components/infiniteScroll/Virtualized'
function App() {
  return (
      <HashRouter>
        <Routes>
          <Route path="/" element={<Simple/>} Dashboard />
          <Route path="/virtualized" element={<Virtualized/>} OneGame />
        </Routes>
      </HashRouter>
  );
}

export default App;
