export default function AdminAssignmentUIV1() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold">Admin Assignment UI v1</h1>
        <p className="text-gray-600 mt-2">
          Управление привязкой пользователей к квартирам.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* USERS */}
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Пользователи</h2>

            <input
              className="border rounded-xl px-3 py-2 w-56"
              placeholder="Поиск пользователя"
            />
          </div>

          <div className="border rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-3">Email</th>
                  <th className="text-left p-3">Имя</th>
                  <th className="text-left p-3">Статус</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-t hover:bg-gray-50 cursor-pointer">
                  <td className="p-3">admin@test.lv</td>
                  <td className="p-3">Admin User</td>
                  <td className="p-3">Active</td>
                </tr>

                <tr className="border-t hover:bg-gray-50 cursor-pointer">
                  <td className="p-3">resident@test.lv</td>
                  <td className="p-3">Resident User</td>
                  <td className="p-3">Active</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ASSIGNMENTS */}
        <div className="bg-white rounded-2xl shadow p-4 space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Назначения квартир</h2>
            <p className="text-sm text-gray-500 mt-1">
              Owner / Resident assignments
            </p>
          </div>

          {/* ADD FORM */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

            <select className="border rounded-xl px-3 py-2">
              <option>Выберите квартиру</option>
              <option>Apartment 1</option>
              <option>Apartment 2</option>
            </select>

            <select className="border rounded-xl px-3 py-2">
              <option>owner</option>
              <option>resident</option>
            </select>

            <button className="bg-black text-white rounded-xl px-4 py-2">
              Добавить
            </button>
          </div>

          {/* CURRENT ASSIGNMENTS */}
          <div className="border rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-3">Квартира</th>
                  <th className="text-left p-3">Тип</th>
                  <th className="text-left p-3">Действие</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-t">
                  <td className="p-3">Apartment 12</td>
                  <td className="p-3">owner</td>
                  <td className="p-3">
                    <button className="border rounded-lg px-3 py-1 hover:bg-gray-100">
                      Удалить
                    </button>
                  </td>
                </tr>

                <tr className="border-t">
                  <td className="p-3">Apartment 15</td>
                  <td className="p-3">resident</td>
                  <td className="p-3">
                    <button className="border rounded-lg px-3 py-1 hover:bg-gray-100">
                      Удалить
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* API MAP */}
      <div className="bg-white rounded-2xl shadow p-4 space-y-3">
        <h2 className="text-xl font-semibold">API endpoints</h2>

        <div className="text-sm space-y-2 font-mono">
          <div>GET /api/admin/users</div>
          <div>GET /api/admin/apartments</div>
          <div>GET /api/admin/user-apartments?user_id=1</div>
          <div>POST /api/admin/add-user-apartment</div>
          <div>POST /api/admin/remove-user-apartment</div>
        </div>
      </div>
    </div>
  );
}
