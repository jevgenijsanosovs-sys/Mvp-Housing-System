export default function ApartmentPreview({

  apartment,

}) {

  if (!apartment) {

    return null;

  }

  return (

    <div>

      <h2>

        Apartment {apartment.number}

      </h2>

      <hr />

      <p>

        <strong>Owner</strong>

        <br />

        {apartment.owner || "-"}

      </p>

      <p>

        <strong>Resident</strong>

        <br />

        {apartment.resident || "-"}

      </p>

      <p>

        <strong>Meters</strong>

      </p>

      <ul>

        {apartment.risers.flatMap(

          riser =>

            riser.meters

        ).map(meter=>(

          <li key={meter.id}>

            {meter.type}

            {" · "}

            {meter.serial_number}

          </li>

        ))}

      </ul>

    </div>

  );

}
