export default function groupMetersByApartment(meters) {

  const apartments = {};

  meters.forEach((meter) => {

    const apartment = meter.apartment_number;

    if (!apartments[apartment]) {

      apartments[apartment] = {

        number: apartment,

        owner: "",

        risers: [

          {

            name: "General",

            meters: [],

          },

        ],

      };

    }

    apartments[apartment].risers[0].meters.push(meter);

  });

  return Object.values(apartments);

}
