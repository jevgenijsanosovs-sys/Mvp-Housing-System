import {

  pageHeader,

  pageHeaderRow,

  pageHeaderButtons,

} from "../styles/theme";

export default function PageHeader({

  title,

  subtitle,

  children,

}) {

  return (

        <div style={pageHeader}>
        
        <div style={pageHeaderRow}>

        <div>

          <h1
            style={{
              margin: 0,
            }}
          >
            {title}
          </h1>

          {subtitle && (

            <div
              style={{
                marginTop: 4,
                fontSize: "0.9rem",
                color: "#666",
              }}
            >
              {subtitle}
            </div>

          )}

        </div>

        <div style={pageHeaderButtons}>
          {children}
        </div>

      </div>

    </div>

  );

}
