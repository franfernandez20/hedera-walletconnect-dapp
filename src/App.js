import "./App.css";
import Dapp from "./connector/Dapp";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>Wallet connect dApp example</p>
        <Dapp />
      </header>
    </div>
  );
}

export default App;
