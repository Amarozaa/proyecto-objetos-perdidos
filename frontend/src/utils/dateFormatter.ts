export const formatearFechaPersonalizada = (fechaString: string): string => {
  const fecha = new Date(fechaString);
  const hoy = new Date();
  const ayer = new Date(hoy);
  ayer.setDate(hoy.getDate() - 1);

  const soloFechaHoy = new Date(
    hoy.getFullYear(),
    hoy.getMonth(),
    hoy.getDate()
  );
  const soloFechaAyer = new Date(
    ayer.getFullYear(),
    ayer.getMonth(),
    ayer.getDate()
  );
  const soloFecha = new Date(
    fecha.getFullYear(),
    fecha.getMonth(),
    fecha.getDate()
  );

  const diasSemana = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  const meses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];

  const diaSemana = diasSemana[fecha.getDay()];
  const dia = fecha.getDate();
  const mes = meses[fecha.getMonth()];

  if (soloFecha.getTime() === soloFechaHoy.getTime()) {
    return `Hoy, ${dia} de ${mes}`;
  } else if (soloFecha.getTime() === soloFechaAyer.getTime()) {
    return `Ayer, ${dia} de ${mes}`;
  } else {
    return `${diaSemana} ${dia} de ${mes}`;
  }
};
