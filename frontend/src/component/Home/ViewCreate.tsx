import React from 'react';

function ViewCreate() {
  return (
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
      </table>
    </div>
  );
}

export default ViewCreate;
