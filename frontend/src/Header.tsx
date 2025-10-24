// import { CSSProperties } from 'react';
// import logo from './BLE-logo.png';

// function Header(props: any) {
//   const bg = {
//     backgroundColor: '#02002a',
//   };

//   const alignLeft: CSSProperties = {
//     textAlign: 'left',
//   };

//   return (
//     <header className="row navbar navbar-dark" style={bg}>
//       <div className="col-4">
//         <a href="http://localhost:3000/">
//           <img src={logo} className="logo" alt="logo" />
//         </a>
//       </div>
//       <div className="col subtitle" style={alignLeft}>
//         <h1 className="text-white">{props.title}</h1>
//         <p className="text-white">{props.description}</p>
//       </div>
//     </header>
//   );
// }

// export default Header;

import React from 'react';
import logo from './BLE-logo.png';

interface HeaderProps {
  title: string;
  description: string;
}

function Header(props: HeaderProps) {
  return (
    <header className="flex items-center justify-between bg-[#02002a] text-white p-4 shadow-2xl">
      {/* --- Phần Logo và Link --- */}
      <div className="flex-shrink-0">
        <a
          href="http://localhost:3000/"
          className="focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded"
        >
          <img
            src={logo}
            className="w-20 object-cover transition duration-300 hover:opacity-80"
            alt="logo"
          />
        </a>
      </div>
      <div className="flex-grow ml-6">
        <h1 className="text-3xl font-extrabold text-cyan-400 tracking-wider">
          {props.title}
        </h1>
        <p className="text-sm text-gray-300 mt-1 tracking-wide">
          {props.description}
        </p>
      </div>
    </header>
  );
}

export default Header;
