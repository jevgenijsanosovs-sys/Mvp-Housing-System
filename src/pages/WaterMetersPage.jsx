import PageHeader from "../components/PageHeader";
import ActionButton from "../components/ActionButton";

export default function WaterMetersPage() {

  return (

    <div>

      <PageHeader
        title="Water Meter Management"
      >
      
        <ActionButton
          icon="🔄"
          text="Refresh"
        />
      
        <ActionButton
          icon="➕"
          text="Add Meter"
        />
      
        <ActionButton
          icon="🚫"
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
