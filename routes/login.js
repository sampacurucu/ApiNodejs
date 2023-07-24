const router = require("express").Router();
const conexion = require("../config/conexion");

// check login for abogado
router.post("/", function (req, res) {
  let sql = `
    SELECT * FROM public.abogado
    WHERE email = '${req.body.email}' AND password = '${req.body.password}'
  `;
  conexion.query(sql, (err, result) => {
    if (err) {
      res.json({ status: "Error al iniciar sesión" + err });
      throw err;
    } else {
      if (result.rows.length > 0) {
        res.json({ status: 200, data: result.rows});
      } else {
        res.json({ status: "Usuario o contraseña incorrectos" });
      }
    }
  });
});

// Abogado routes
// router.get("/abogados", function (req, res) {
//   let sql = `
//         SELECT * FROM public.abogado
//         ORDER BY id_abogado ASC 
//       `;

//   conexion.query(sql, (err, result) => {
//     if (err) throw err;
//     else {
//       res.json(result.rows);
//     }
//   });
// });

// router.get("/abogado/:id", function (req, res) {
//   // code to retrieve a specific abogado by ID
//   let sql = `
//         SELECT * FROM public.abogado
//         WHERE id_abogado = ${req.params.id}
//       `;
//   conexion.query(sql, (err, result) => {
//     if (err) throw err;
//     else {
//       res.json(result.rows);
//     }
//   });
// });

// router.post("/abogado", function (req, res) {
//   // code to create a new abogado
//   let sql = `
//     INSERT INTO public.abogado(
//         nombres, apellidos, email, password)
//         VALUES ('${req.body.nombres}', '${req.body.apellidos}', '${req.body.email}', '${req.body.password}');
//     `;

//   conexion.query(sql, (err, result) => {
//     if (err) {
//       res.json({ status: "Error al agregar abogado" + err });
//       throw err;
//     } else {
//       res.json({ status: "Abogado agregado" });
//     }
//   });
// });

// router.put("/abogado/:id", function (req, res) {
//   // code to update an existing abogado by ID
//   let sql = `
//     UPDATE public.abogado
//     SET nombres='${req.body.nombres}', apellidos='${req.body.apellidos}', email='${req.body.email}', password='${req.body.password}'
//     WHERE id_abogado=${req.params.id};
//     `;
//   conexion.query(sql, (err, result) => {
//     if (err) {
//       res.json({ status: "Error al actualizar abogado" + err });
//       throw err;
//     } else {
//       res.json({ status: "Abogado actualizado" });
//     }
//   });
// });

// router.delete("/abogado/:id", function (req, res) {
//   // code to delete a specific abogado by ID
//   let sql = `
//     DELETE FROM public.abogado
//     WHERE id_abogado=${req.params.id};
//     `;
//   conexion.query(sql, (err, result) => {
//     if (err) {
//       res.json({ status: "Error al eliminar abogado" + err });
//       throw err;
//     } else {
//       res.json({ status: "Abogado eliminado" });
//     }
//   });
// });

///////////////////////////////

// check login for cliente
// router.post("/cliente", function (req, res) {

// Cliente routes
// router.get("/clientes", function (req, res) {
//   // code to retrieve all clientes
// });

// router.get("/cliente/:id", function (req, res) {
//   // code to retrieve a specific cliente by ID
// });

// router.post("/cliente", function (req, res) {
//   // code to create a new cliente
// });

// router.put("/cliente/:id", function (req, res) {
//   // code to update an existing cliente by ID
// });

// router.delete("/cliente/:id", function (req, res) {
//   // code to delete a specific cliente by ID
// });

module.exports = router;
