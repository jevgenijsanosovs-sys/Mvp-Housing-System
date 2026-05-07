import { useEffect, useState } from "react";
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: 20,
              }}
            >

              {apartments.map((a) => (
                <div
                  key={a.id}
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: 12,
                    padding: 20,
                    background: "white",
                  }}
                >
                  <h3>
                    Apartment {a.number}
                  </h3>

                  <p>
                    Section: {a.section}
                  </p>

                  <p>
                    Floor: {a.floor}
                  </p>

                  <p>
                    Levels: {a.level_count}
                  </p>

                  <p>
                    Living Area: {a.living_area}
                  </p>

                  <p>
                    Heated Area: {a.heated_area}
                  </p>

                  <p>
                    Residents Count: {a.residents_count}
                  </p>

                  <p>
                    Notes: {a.notes || "-"}
                  </p>

                  <hr />

                  <strong>Owners:</strong>

                  {(a.owners || []).map((o) => (
                    <div key={o.id}>
                      {o.first_name} {o.last_name}
                    </div>
                  ))}

                  <br />

                  <strong>Residents:</strong>

                  {(a.residents || []).map((r) => (
                    <div key={r.id}>
                      {r.first_name} {r.last_name}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}