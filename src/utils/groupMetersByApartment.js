export default function groupMetersByApartment(meters) {

  const apartments = {};

  meters.forEach((meter) => {

    const apartmentNumber = meter.apartment_number;

    if (!apartments[apartmentNumber]) {

      apartments[apartmentNumber] = {

        number: apartmentNumber,

        owner:
          meter.owner_name ||
          meter.resident_name ||
          "",

        risers: {},

      };

    }

    const riserName =
      meter.riser_name ||
      "General";

    if (
      !apartments[apartmentNumber]
        .risers[riserName]
    ) {

      apartments[apartmentNumber]
        .risers[riserName] = [];

    }

    apartments[apartmentNumber]
      .risers[riserName]
      .push(meter);

  });

  return Object.values(apartments).map(
    apartment => ({

      ...apartment,

      risers: Object.entries(
        apartment.risers
      ).map(([name, meters]) => ({

        name,

        meters,

      })),

    })
  );

}
