import { Button } from "../components/resolved/Button";
import { useExample } from "../hooks/useExample";
import "./App.css";

function App() {
  const { test } = useExample();

  return (
    <>
      <h1>{test}</h1>
      <Button>Test</Button>
    </>
  );
}

export default App;
