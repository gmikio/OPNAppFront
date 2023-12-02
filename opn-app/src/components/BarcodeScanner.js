// import React, { useState } from 'react';
// import BarcodeScannerComponent from "react-webcam-barcode-scanner";

// const BarcodeScanner = ({ onBarcodeDetected }) => {
//   const [data, setData] = useState('No barcode detected');

//   const handleUpdate = (err, result) => {
//     if (result) {
//       setData(result.text);
//       onBarcodeDetected(result.text);
//     } else {
//       setData('No barcode detected');
//     }
//   };

//   return (
//     <div>
//       <BarcodeScannerComponent
//         onUpdate={handleUpdate}
//         width={500}
//         height={500}
//       />
//       <p>{data}</p>
//     </div>
//   );
// };

// export default BarcodeScanner;
