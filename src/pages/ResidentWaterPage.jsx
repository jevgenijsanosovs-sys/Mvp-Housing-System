import { useEffect } from "react";

import WaterCard from "../components/WaterCard";
import useWater from "../hooks/useWater";

export default function ResidentWaterPage() {

  const {
    waterMeters,
    loadMyWater,
    submitReading,
  } = useWater();

  useEffect(() => {
    loadMyWater();
  }, []);

  return (
    <div>

      <h1>
        Water Meters
      </h1>

      {waterMeters.map((m) => (

        <WaterCard
          key={m.id}
          meter={m}
          onSubmit={submitReading}
        />

      ))}

    </div>
  );
}