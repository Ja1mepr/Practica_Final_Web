import { useFormik } from "formik";
import * as Yup from "yup";

export default function ProjectFormik({
  clients,
  clienteId,
  onSubmit,
  onCancel,
  initialValues,
}) {
  const formik = useFormik({
    initialValues: initialValues || {
      name: "",
      code: "",
      creationDate: "",
      internalCode: "",
      clientId: clienteId || "", // Asocia el proyecto al cliente de forma automatica si recibe un clientId
    },
    validationSchema: Yup.object({
      name: Yup.string().required("El nombre del proyecto es obligatorio."),
      code: Yup.string().required("El código del proyecto es obligatorio."),
      creationDate: Yup.date().required("La fecha de creación es obligatoria."),
      internalCode: Yup.string().required("El código interno es obligatorio."),
      clientId: Yup.string().required("Debes seleccionar un cliente."),
    }),
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium">Nombre del Proyecto</label>
        <input
          type="text"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full border rounded px-2 py-1"
        />
        {formik.touched.name && formik.errors.name && (
          <p className="text-red-500 text-sm">{formik.errors.name}</p>
        )}
      </div>
      <div>
        <label className="block font-medium">Código del Proyecto</label>
        <input
          type="text"
          name="code"
          value={formik.values.code}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full border rounded px-2 py-1"
        />
        {formik.touched.code && formik.errors.code && (
          <p className="text-red-500 text-sm">{formik.errors.code}</p>
        )}
      </div>
      <div>
        <label className="block font-medium">Fecha de Creación</label>
        <input
          type="date"
          name="creationDate"
          value={formik.values.creationDate}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full border rounded px-2 py-1"
        />
        {formik.touched.creationDate && formik.errors.creationDate && (
          <p className="text-red-500 text-sm">{formik.errors.creationDate}</p>
        )}
      </div>
      <div>
        <label className="block font-medium">Código Interno</label>
        <input
          type="text"
          name="internalCode"
          value={formik.values.internalCode}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full border rounded px-2 py-1"
        />
        {formik.touched.internalCode && formik.errors.internalCode && (
          <p className="text-red-500 text-sm">{formik.errors.internalCode}</p>
        )}
      </div>
      {!clienteId && ( // Si no se proporciona clienteId, mostramos la selección de cliente
        <div>
          <label className="block font-medium">Cliente Asociado</label>
          <select
            name="clientId"
            value={formik.values.clientId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full border rounded px-2 py-1"
          >
            <option value="">Seleccione un cliente</option>
            {clients.map((client) => (
              <option key={client._id} value={client._id}>
                {client.name}
              </option>
            ))}
          </select>
          {formik.touched.clientId && formik.errors.clientId && (
            <p className="text-red-500 text-sm">{formik.errors.clientId}</p>
          )}
        </div>
      )}
      <div className="flex justify-end gap-2">
      <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Guardar
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}