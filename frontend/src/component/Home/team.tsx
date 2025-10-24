import { useEffect, useState } from 'react';
import { Bowler } from '../../types/Bowler';
import { useNavigate, useParams } from 'react-router-dom';

function Team() {
  const [bowlerData, setBowlerData] = useState<Bowler[]>([]);
  const [nameTeam, setNameTeam] = useState('');
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();
  useEffect(() => {
    const fetchBowler = async () => {
      try {
        const res = await fetch(
          `http://localhost:5231/api/BowlingLeague/teams/${id}/bowlers`,
        );

        if (!res.ok) {
          throw new Error('Failed get teamId');
        }
        const data = await res.json();
        if (data) {
          setNameTeam(data[0].team.teamName);
        }
        setBowlerData(data || []);
      } catch (ex) {
        console.error(ex);
      }
    };
    fetchBowler();
  }, [id]);
  // HandleEdit
  var handleEdit = (ID: number) => {
    console.log('EDIT', ID);
    navigate(`../edit/${ID}`);
  };

  // HandleDelete
  var handleDelete = (ID: number) => {
    console.log('DELETE', ID);
    navigate(`../delete/${ID}`);
  };

  console.log('data team:', bowlerData);
  return (
    <div className="full">
      <h1>Danh sách Team:{nameTeam}</h1>
      <div className="overflow-x-auto shadow-xl rounded-xl">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          {/* Table Header (<thead>) */}
          <thead className="bg-gray-800">
            <tr>
              {/* Áp dụng padding và text color cho TH */}
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider rounded-tl-xl text-center"
              >
                Last Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider text-center"
              >
                First Names
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider text-center"
              >
                Address
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider text-center"
              >
                Phone
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider"
                colSpan={2}
              >
                Actions
              </th>
            </tr>
          </thead>

          {/* Table Body (<tbody>) */}
          <tbody className="divide-y divide-gray-200">
            {bowlerData.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No bowler data available.
                </td>
              </tr>
            ) : (
              bowlerData.map((b) => (
                // Lớp TR đã được sửa:
                // 1. even:bg-gray-50 tạo kiểu xen kẽ (Zebra Striping)
                // 2. hover:bg-indigo-50/70: Hiệu ứng hover mượt mà hơn và ít xung đột hơn
                <tr
                  key={b.bowlerId}
                  className="even:bg-gray-50 hover:bg-indigo-50/70 transition duration-150 ease-in-out"
                >
                  {/* Áp dụng padding, text size, và whitespace cho TD */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {b.bowlerLastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {b.bowlerFirstName}{' '}
                    {b.bowlerMiddleInit ? b.bowlerMiddleInit + '.' : ''}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {b.bowlerAddress}, {b.bowlerCity}, {b.bowlerState}{' '}
                    {b.bowlerZip}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {b.bowlerPhoneNumber}
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-yellow-600">
                    </td> */}

                  {/* Edit Button */}
                  <td className="px-2 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <button
                      type="button"
                      onClick={() => handleEdit(b.bowlerId)}
                      className="text-indigo-600 hover:text-indigo-900 transition duration-150"
                    >
                      Edit
                    </button>
                  </td>

                  {/* Delete Button */}
                  <td className="px-2 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <button
                      type="button"
                      onClick={() => handleDelete(b.bowlerId)}
                      className="text-red-600 hover:text-red-900 transition duration-150"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default Team;
