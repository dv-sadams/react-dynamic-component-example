import { Button } from "@/components";
import { useExample } from "@/hooks/useExample";

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
