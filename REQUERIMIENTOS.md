# Requerimientos del proyecto  

## Sesión 1 — 12/05/2026  
### Briefing inicial 
- El objetivo principal es permitir a los estudiantes consultar disponibilidad en tiempo real, 
reservar salas de estudio y cancelar reservas fácilmente, 
mientras que los administradores podrán supervisar el uso de las salas y gestionar incidentes.

- Durante la reunión se discutieron aspectos relacionados con la experiencia de usuario, 
la facilidad operativa para administradores y mecanismos básicos para evitar el mal uso del sistema.
Se decidió mantener una primera versión sencilla, funcional y fácil de utilizar tanto para estudiantes como para personal administrativo.

### Requerimientos acordados 
REQ-01: El sistema debe permitir a los estudiantes consultar la disponibilidad de salas en tiempo real.
REQ-02: El sistema debe permitir realizar reservas de salas de estudio.
REQ-03: El sistema debe permitir la cancelación fácil de reservas por parte del estudiante.
REQ-04: El sistema debe manejar un tiempo límite de cancelación sin penalización antes del inicio de la reserva.
REQ-05: El sistema debe aplicar restricciones o penalizaciones a estudiantes que cancelen repetidamente tarde o no asistan a sus reservas.
REQ-06: El sistema debe enviar notificaciones o recordatorios de reservas a los estudiantes antes de la hora programada.
REQ-07: El sistema debe contar con roles diferenciados para estudiantes y administradores.
REQ-08: El administrador debe poder visualizar las reservas del día organizadas por horario y sala.
REQ-09: El administrador debe poder registrar manualmente el estado de una reserva:
Asistió
No asistió
Cancelada
Incidente reportado
REQ-10: El sistema debe permitir al administrador registrar observaciones o incidentes relacionados con las salas o reservas.
REQ-11: El sistema debe permitir consultar el historial de reservas realizadas por cada estudiante.
REQ-12: El sistema debe incluir filtros de búsqueda para facilitar la consulta de salas y horarios.
REQ-13: El sistema no debe permitir reservas en horarios superpuestos para un mismo estudiante.
REQ-14: El sistema debe limitar la cantidad de reservas activas que puede tener un estudiante.
