import axios from 'axios';

export interface ErrorResponse {
  status?: number;
  message: string;
  field?: string;
}

/**
 * Maneja errores de API y devuelve un mensaje amigable al usuario
 * @param error - El error capturado en un catch block
 * @param defaultMessage - Mensaje por defecto si no se puede determinar el error
 * @returns Objeto con status, message y field (si aplica)
 */
export const handleApiError = (error: unknown, defaultMessage: string = "Error al procesar la solicitud"): ErrorResponse => {
  // Error de Axios con respuesta del servidor
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data as { error?: string; campo?: string } | undefined;

    switch (status) {
      case 400:
        return {
          status: 400,
          message: data?.error || "Datos inválidos. Verifica los campos.",
          field: data?.campo,
        };
      case 401:
        return {
          status: 401,
          message: "No estás autenticado. Por favor inicia sesión.",
        };
      case 403:
        return {
          status: 403,
          message: "No tienes permiso para realizar esta acción.",
        };
      case 404:
        return {
          status: 404,
          message: "El recurso solicitado no fue encontrado.",
        };
      case 409:
        return {
          status: 409,
          message: data?.error || `Este ${data?.campo || "recurso"} ya está registrado.`,
          field: data?.campo,
        };
      case 500:
        return {
          status: 500,
          message: "Error interno del servidor. Por favor intenta más tarde.",
        };
      default:
        return {
          status,
          message: data?.error || defaultMessage,
          field: data?.campo,
        };
    }
  }

  // Error de red u otro tipo de error
  if (error instanceof Error) {
    return {
      message: error.message || defaultMessage,
    };
  }

  return {
    message: defaultMessage,
  };
};

/**
 * Valida que los campos requeridos no estén vacíos
 * @param data - Objeto con datos a validar
 * @param requiredFields - Array de campos requeridos
 * @returns Objeto con validaciones { isValid: boolean, errors: { [field]: string } }
 */
export const validateForm = (
  data: Record<string, unknown>,
  requiredFields: string[]
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  for (const field of requiredFields) {
    const value = data[field];
    if (!value || (typeof value === 'string' && !value.trim())) {
      errors[field] = `El campo ${field} es requerido.`;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
