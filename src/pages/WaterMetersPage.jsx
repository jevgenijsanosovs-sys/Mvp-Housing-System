import Drawer
  from "../components/Drawer";

import ApartmentPreview
  from "../components/ApartmentPreview";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import PageHeader from "../components/PageHeader";
import ActionButton from "../components/ActionButton";
import SearchBox from "../components/SearchBox";
import ResponsiveTable from "../components/ResponsiveTable";
import WaterMeterTable from "../components/WaterMeterTable";
import ApartmentWaterCard from "../components/ApartmentWaterCard";

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

  const [filter, setFilter] = useState({
    search: "",
    type: "all",
    status: "all",
    riser: "all",
  });

  // =====================================
  // Normalize data
  // =====================================

  const enrichedMeters = useMemo(() => {

    return adminWaterMeters.map((meter) => ({

      ...meter,

      riser:
        meter.riser || "Unknown",

      status:
        meter.active
          ? "active"
          : "inactive",

    }));

  }, [adminWaterMeters]);

  // =====================================
  // Filtering
  // =====================================

  const filteredMeters = useMemo(() => {

    return enrichedMeters.filter((meter) => {

      const search =
        filter.search
          .trim()
          .toLowerCase();

      if (search) {

        const apartment =
          String(
            meter.apartment_number ?? ""
          ).toLowerCase();

        const serial =
          String(
            meter.serial_number ?? ""
          ).toLowerCase();

        const owner =
          String(
            meter.owner ?? ""
          ).toLowerCase();

        const resident =
          String(
            meter.resident ?? ""
          ).toLowerCase();

        const riser =
          String(
            meter.riser ?? ""
          ).toLowerCase();

        if (

          !apartment.includes(search) &&
          !serial.includes(search) &&
          !owner.includes(search) &&
          !resident.includes(search) &&
          !riser.includes(search)

        ) {

          return false;

        }

      }

      if (

        filter.type !== "all" &&
        meter.type !== filter.type

      ) {

        return false;

      }

      if (

        filter.status !== "all" &&
        meter.status !== filter.status

      ) {

        return false;

      }

      if (

        filter.riser !== "all" &&
        meter.riser !== filter.riser

      ) {

        return false;

      }

      return true;

    });

  }, [enrichedMeters, filter]);


const [

  selectedApartment,

  setSelectedApartment,

] = useState(null);

  
  // =====================================
  // Apartments
  // =====================================

  const apartments =
    useMemo(() => {

      return groupMetersByApartment(
        filteredMeters
      );

    }, [filteredMeters]);

  return (

    <div>

      <PageHeader
        title="Water Meter Management"
      >

        <SearchBox

          value={filter.search}

          onChange={(value) =>

            setFilter((prev) => ({

              ...prev,

              search: value,

            }))

          }

        />

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

      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >

        <select
          value={filter.type}
          onChange={(e) =>
            setFilter((prev) => ({
              ...prev,
              type: e.target.value,
            }))
          }
        >
          <option value="all">
            All Types
          </option>

          <option value="hot">
            Hot
          </option>

          <option value="cold">
            Cold
          </option>

        </select>

        <select
          value={filter.status}
          onChange={(e) =>
            setFilter((prev) => ({
              ...prev,
              status: e.target.value,
            }))
          }
        >
          <option value="all">
            All Status
          </option>

          <option value="active">
            Active
          </option>

          <option value="inactive">
            Inactive
          </option>

        </select>

      </div>

      <ResponsiveTable

        desktop={

          <WaterMeterTable
            meters={filteredMeters}
          />

        }

        mobile={

          <div>

            {apartments.map(

              (apartment) => (

                <ApartmentWaterCard
                
                  key={apartment.number}
                
                  apartment={apartment}
                
                  onOpen={()=>
                
                    setSelectedApartment(
                
                      apartment
                
                    )
                
                  }
                
                />

              )

            )}

          </div>

        }

      />

    </div>

  );

}
