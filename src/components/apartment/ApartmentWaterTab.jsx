export default function ApartmentWaterTab({
  apartment,
}) {

  return (

    <div>

      {apartment.risers?.map(
        (riser) => (

          <div
            key={riser.name}
            style={{
              marginBottom: 20,
            }}
          >

            <h4>
              {riser.name}
            </h4>

            {riser.meters.map(
              (meter) => (

                <div
                  key={meter.id}
                >

                  {meter.type === "hot"
                    ? "🔴"
                    : "🔵"}

                  {" "}

                  {meter.serial_number}

                </div>

              )
            )}

          </div>

        )
      )}

    </div>

  );

}
