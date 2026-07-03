import { useEffect } from "react";

import PageHeader from "../components/PageHeader";
import ActionButton from "../components/ActionButton";
import ResponsiveTable from "../components/ResponsiveTable";
import WaterMeterTable from "../components/WaterMeterTable";
import ApartmentWaterCard
  from "../components/ApartmentWaterCard";

import groupMetersByApartment
  from "../utils/groupMetersByApartment";

import useWater from "../hooks/useWater";

export default function WaterMetersPage() {

  const {
    adminWaterMeters,
    loadAdminWaterMeters,
  } = useWater();

  useEffect(() => {
    loadAdminWaterMeters();
  }, []);

  const apartments =
    groupMetersByApartment(
      adminWaterMeters
    );
  
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

      <ResponsiveTable

        desktop={

          <WaterMeterTable
            meters={adminWaterMeters}
          />

        }

        mobile={

          <div>
          
            {apartments.map((apartment) => (
          
              <ApartmentWaterCard
          
                key={apartment.number}
          
                apartment={apartment}
          
              />
          
            ))}
          
          </div>

        }

      />

    </div>

  );

}
