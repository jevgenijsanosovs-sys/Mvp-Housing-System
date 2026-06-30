import { useEffect } from "react";

import PageHeader from "../components/PageHeader";
import ActionButton from "../components/ActionButton";

import useWater from "../hooks/useWater";

export default function WaterMetersPage() {

  const {

    adminWaterMeters,

    loadAdminWaterMeters,

  } = useWater();

  useEffect(() => {

    loadAdminWaterMeters();

  }, []);

  return (

    <div>

      <PageHeader
        title="Water Meter Management"
      >
      
        <ActionButton
          text="Refresh"
          onClick={loadAdminWaterMeters}
        />
      
        <ActionButton

          text="Add Meter"
        />
      
        <ActionButton

          text="Deactivate"
          variant="danger"
        />
      
      </PageHeader>

      <pre>
      
      {JSON.stringify(
      
        adminWaterMeters,
      
        null,
      
        2
      
      )}
      
      </pre>
    </div>

  );

}
