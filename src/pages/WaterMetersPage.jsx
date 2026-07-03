import {
  useEffect,
  useState,
} from "react";

import SearchBox
  from "../components/SearchBox";

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

  const [search, setSearch] =
    useState("");

  const filteredApartments =
    apartments.filter((apartment) => {
  
      const text =
        search.toLowerCase();
  
      if (
        apartment.number
          .toString()
          .includes(text)
      ) {
  
        return true;
  
      }
  
      if (
        apartment.owner
          ?.toLowerCase()
          .includes(text)
      ) {
  
        return true;
  
      }
  
      return apartment.risers.some(
        (riser) =>
  
          riser.meters.some(
            (meter) =>
  
              meter.serial_number
                ?.toLowerCase()
                .includes(text)
  
          )
  
      );
  
    });

  
  return (

    <div>

      <PageHeader
        title="Water Meter Management"
      >

        <ActionButton
          text="Refresh"
          onClick={loadAdminWaterMeters}
        />

      <SearchBox
      
        value={search}
      
        onChange={setSearch}
      
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
          
            {filteredApartments.map((apartment) => (
          
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
