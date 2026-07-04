import {
  useEffect,
  useState,
} from "react";

import { useState, useMemo } from "react";

const [filter, setFilter] = useState({
  search: "",
  type: "all",
  status: "all",
  riser: "all",
});

const filteredMeters = useMemo(() => {
  return enrichedMeters.filter(meter => {

    if (filter.type !== "all" && meter.type !== filter.type)
      return false;

    if (filter.status !== "all" && meter.status !== filter.status)
      return false;

    if (filter.riser !== "all" && meter.riser !== filter.riser)
      return false;

    return true;
  });
}, [enrichedMeters, filter]);

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

    const enrichedMeters = filteredMeters.map(meter => ({
      ...meter,
    
      riser: meter.riser || "Unknown",
    
      status: meter.active ? "active" : "inactive",
    }));
  
  
  return (

    <div>

      <PageHeader
        title="Water Meter Management"
      >

        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        
          <select
            value={filter.type}
            onChange={(e) =>
              setFilter(prev => ({
                ...prev,
                type: e.target.value
              }))
            }
          >
            <option value="all">All Types</option>
            <option value="hot">Hot</option>
            <option value="cold">Cold</option>
          </select>
        
          <select
            value={filter.status}
            onChange={(e) =>
              setFilter(prev => ({
                ...prev,
                status: e.target.value
              }))
            }
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        
        </div>
        
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
