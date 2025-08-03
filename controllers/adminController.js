// import Setting from "../models/settingModel.js"; // ensure Setting model is imported

// // ✅ Already existing function
// export const updateCOD = async (req, res) => {
//   const { codAvailable } = req.body;
//   let setting = await Setting.findOne();

//   if (!setting) {
//     setting = new Setting({ codAvailable });
//   } else {
//     setting.codAvailable = codAvailable;
//   }

//   await setting.save();
//   res.send({ success: true, codAvailable });
// };

// // ✅ NEW FUNCTION to fix the error
// // export const getCODStatus = async (req, res) => {
// //   let setting = await Setting.findOne();

// //   if (!setting) {
// //     setting = new Setting({ codAvailable: false });
// //     await setting.save();
// //   }

// //   res.send({ codAvailable: setting.codAvailable });
// // };

// export const getCODStatus = async (req, res) => {
//   try {
//     const codAvailable = true; // or fetch from DB
//     res.status(200).json({ codAvailable });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching COD status' });
//   }
// };


