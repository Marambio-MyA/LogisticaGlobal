import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import capitalizeFirst from '../../utils/utils';

const agregarPieDePagina = (doc, user) => {
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  const timestamp = new Date().toLocaleString();
  const footerText = `Generado por: ${user?.name || 'Usuario desconocido'} — ${timestamp}`;

  doc.setFontSize(8);
  doc.setTextColor(130);
  doc.text(footerText, pageWidth / 2, pageHeight - 10, { align: 'center' });
};


export const generarReportePDF = (incidentes, user) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;
  let incidentesEnPagina = 0;

  const getMaxPorPagina = (index) => (index < 2 ? 2 : 3);

  // Encabezado inicial
  doc.setFontSize(18);
  doc.text('Reporte de Incidentes Robóticos', pageWidth / 2, y, { align: 'center' });

  y += 12;

  doc.setFontSize(10);
  const userText = `Generado por: ${user?.name || 'Usuario desconocido'}`;
  const dateText = `Fecha de generación: ${new Date().toLocaleString()}`;

  doc.text(userText, pageWidth - 14, y, { align: 'right' });
  doc.text(dateText, pageWidth - 14, y + 6, { align: 'right' });
  y += 10;

   incidentes.forEach((incidente) => {
    const espacioMinimo = 70 + (incidente.detalle_robots?.length || 1) * 25;

    // Si no hay suficiente espacio en la página, saltar
    if (y + espacioMinimo > 270) {
      agregarPieDePagina(doc, user);
      doc.addPage();
      doc.setFont('helvetica'); // o la que estés usando
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0); // negro
      y = 20;
    }

    // Fondo según estado del incidente
    const estado = incidente.estado;
    if (estado === 'creado') doc.setFillColor(220, 230, 255);
    else if (estado === 'en_investigacion') doc.setFillColor(255, 245, 200);
    else if (estado === 'resuelto') doc.setFillColor(210, 255, 210);
    else doc.setFillColor(240, 240, 240);

    doc.rect(14, y, pageWidth - 28, 8, 'F');
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`Incidente: ${incidente.codigo}`, 16, y + 6);
    y += 12;

    // Tabla de atributos
    autoTable(doc, {
      startY: y,
      margin: { left: 14 },
      theme: 'grid',
      styles: { fontSize: 10, halign: 'left' },
      headStyles: { fillColor: [200, 200, 200] },
      body: [[
        new Date(incidente.fecha).toLocaleDateString(),
        incidente.hora || '-',
        incidente.ubicacion,
        capitalizeFirst(incidente.tipo_incidente),
        capitalizeFirst(incidente.estado)
      ]],
      head: [['Fecha', 'Hora', 'Ubicación', 'Tipo', 'Estado']]
    });
    y = doc.lastAutoTable.finalY + 4;

    // Descripción
    if (incidente.descripcion) {
      doc.setFont(undefined, 'bold');
      doc.setFontSize(10);
      doc.text('Descripción del incidente:', 14, y);
      doc.setFont(undefined, 'normal');
      y += 5;
      const descLines = doc.splitTextToSize(incidente.descripcion, pageWidth - 28);
      doc.text(descLines, 14, y);
      y += descLines.length * 5 + 4;
    }

    // Robots involucrados
    if (incidente.detalle_robots?.length > 0) {
      doc.setFont(undefined, 'bold');
      doc.text('Robots Involucrados:', 14, y);
      y += 6;

      incidente.detalle_robots.forEach((robot) => {
        if (y > 260) {
          agregarPieDePagina(doc, user);
          doc.addPage();
          doc.setFont('helvetica'); // o la que estés usando
          doc.setFontSize(12);
          doc.setTextColor(0, 0, 0); // negro
          y = 20;
        }

        const estadoFinal =
          robot.estado === 'operativo' ? 'Operativo' :
          robot.estado === 'en_reparacion' ? 'En reparación' :
          robot.estado === 'fuera_servicio' ? 'Fuera de servicio' :
          'Desconocido';

        // Colores del estado
        let colorEstado;
        if (robot.estado === 'operativo') colorEstado = [100, 200, 100];       // Verde
        else if (robot.estado === 'en_reparacion') colorEstado = [255, 215, 0]; // Amarillo
        else if (robot.estado === 'fuera_servicio') colorEstado = [255, 100, 100]; // Rojo
        else colorEstado = [180, 180, 180];

        doc.setFillColor(...colorEstado);
        doc.rect(14, y - 3, 4, 4, 'F');

        doc.setFontSize(9);
        doc.setFont(undefined, 'bold');
        doc.text(`ID: ${robot.id} - Estado: ${estadoFinal}`, 20, y);
        doc.setFont(undefined, 'normal');
        y += 5;

        if (robot.descripcion_trabajo) {
          const trabajoLines = doc.splitTextToSize(`Trabajo realizado: ${robot.descripcion_trabajo}`, pageWidth - 28);
          doc.text(trabajoLines, 20, y);
          y += trabajoLines.length * 5;
        }

        if (robot.tecnico) {
          doc.text(`Técnico asignado: ${robot.tecnico}`, 20, y);
          y += 5;
        }

        if (robot.gravedad) {
          doc.text(`Gravedad: ${capitalizeFirst(robot.gravedad)}`, 20, y);
          y += 5;
        }

        if (incidente.estado === 'resuelto') {
          doc.text('Firmado por supervisor: Sí', 20, y);
        } else {
          doc.text('Firmado por supervisor: No', 20, y);
        }

        y += 10;
      });
    }

    // Línea divisoria
    doc.setDrawColor(180);
    doc.line(14, y, pageWidth - 14, y);
    y += 10;
    incidentesEnPagina++;
  });

  doc.save('Reporte Incidentes.pdf');
};

