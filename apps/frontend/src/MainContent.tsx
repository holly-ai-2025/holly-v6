import React from "react";
import { Button } from "@/components/ui/Button";

export default function MainContent({ addReward }: { addReward: () => void }) {
  return (
    <div className="p-4">
      <Button variant="contained" onClick={addReward}>
        Add Reward
      </Button>
      <div className="mt-4">
        <Button variant="outline">Secondary Action</Button>
      </div>
    </div>
  );
}
