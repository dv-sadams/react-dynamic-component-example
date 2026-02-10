import { Button } from "../components/resolved/Button";
import { useExample } from "../hooks/useExample";
import { Layout } from "../layouts/resolved/Layout";
import "./App.css";

function App() {
  const { test } = useExample();

  return (
    <Layout>
      <h1>{test}</h1>
      <Button>Test</Button>
    </Layout>
  );
}

export default App;
