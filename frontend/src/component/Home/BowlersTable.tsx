/* eslint-disable react/style-prop-object */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bowler } from '../../types/Bowler';

function BowlersTable(props: any) {
  const navigate = useNavigate();
  const [bowlerData, setBowlerData] = useState<Bowler[]>([]);
  const [search, setSearch] = useState('');

  // HandleTeam
  var handleTeam = (ID: number) => {
    console.log('Team', ID);
    navigate(`team/${ID}`);
  };
  // HandleEdit
  var handleEdit = (ID: number) => {
    console.log('EDIT', ID);
    navigate(`edit/${ID}`);
  };

  // HandleDelete
  var handleDelete = (ID: number) => {
    console.log('DELETE', ID);
    navigate(`delete/${ID}`);
  };
  // handleCreate
  var handleCreate = (type: string) => {
    navigate(`${type}/`);
  };

  // Updated to handle errors thrown when the backend isn't running (generated w/ help from ChatGPT)
  useEffect(() => {
    const fetchBowlerData = async () => {
      try {
        const rsp = await fetch('http://localhost:5231/api/BowlingLeague');
        if (!rsp.ok) {
          throw new Error('Failed to fetch data');
        }
        const b = await rsp.json();
        const allBowlers = b || [];
        setBowlerData(allBowlers);
      } catch (error) {
        console.error('Error fetching data:', error);
        setBowlerData([]); // Set empty array in case of error
      }
    };

    fetchBowlerData();
  }, []);

  let filteredBowlers = bowlerData.filter((e) => !e.IsDelete);

  // Lọc theo Teams được truyền từ props
  // if (props.displayTeams && props.displayTeams.length > 0) {
  //   filteredBowlers = filteredBowlers.filter((b) =>
  //     props.displayTeams.includes(b.team?.teamName || ''),
  //   );
  // }

  // Lọc theo ô tìm kiếm (search input)
  if (search) {
    const lowerCaseSearch = search.toLowerCase();
    filteredBowlers = filteredBowlers.filter(
      (b) =>
        b.bowlerLastName.toLowerCase().includes(lowerCaseSearch) ||
        b.team?.teamName.toLowerCase().includes(lowerCaseSearch) ||
        b.bowlerFirstName.toLowerCase().includes(lowerCaseSearch),
    );
  }

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen font-inter">
      <div className="max-w-7xl mx-auto">
        {/* CONTROL PANEL (Search, Create, Teams) */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
          {/* Create Button */}
          <button
            type="button"
            onClick={() => handleCreate('create')}
            className="w-full sm:w-auto bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            + Add New Bowler
          </button>

          {/* Search Input */}
          <div className="w-full sm:w-96">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Name or Team..."
              className="block w-full p-2.5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Teams Button */}
          <button
            type="button"
            onClick={() => handleCreate('create-team')}
            className="w-full sm:w-auto bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-gray-700 transition duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Create Teams
          </button>
        </div>

        {/* BOWLER DATA TABLE */}
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
                  className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider text-center"
                >
                  Team
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
              {filteredBowlers.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No bowler data available.
                  </td>
                </tr>
              ) : (
                filteredBowlers.map((b) => (
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
                        onClick={() => handleTeam(b.teamId)}
                        className="text-yellow-600 hover:text-indigo-900 transition duration-150"
                      >
                        {b?.team?.teamName}
                      </button>
                    </td>
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
    </div>
  );
}

export default BowlersTable;
