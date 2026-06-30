import PageHeader from "../components/PageHeader";
import ActionButton from "../components/ActionButton";

export default function WaterMetersPage() {

  return (

    <div>

      <PageHeader
        title="Water Meter Management"
      >
      
        <ActionButton

          text="Refresh"
        />
      
        <ActionButton

          text="Add Meter"
        />
      
        <ActionButton

          text="Deactivate"
          variant="danger"
        />
      
      </PageHeader>

      <p>
        Coming soon...
      </p>

    </div>

  );

}
