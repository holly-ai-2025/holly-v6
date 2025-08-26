import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { MessageSquare, Undo, Flame, Award } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Holly AI v6</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Welcome to Holly AI v6 frontend.</p>
          <Button variant="outline" size="sm" onClick={() => setCount(count + 1)}>
            Count is {count}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
