import { Blog } from '../types'; // Importa tu tipo



export const BLOGS: Blog[] = [
  {
    id: "b1",
    titulo: "Beneficios de entrenar 3 veces por semana",
    autor: "Equipo GymTastic",
    fecha: "2025-02-10",
    resumen: "Descubre cómo tres sesiones semanales pueden mejorar tu salud y rendimiento.",
    contenido: `
      Entrenar 3 veces por semana es suficiente para mantener un estilo de vida activo,
      mejorar la resistencia cardiovascular y fortalecer la musculatura. 
      Además, permite una buena recuperación entre sesiones y se adapta a la mayoría de los horarios.
    `,
    img: "../assets/logo.svg"
  },
  {
    id: "b2",
    titulo: "Nutrición básica para un mejor rendimiento",
    autor: "Nutricionista María López",
    fecha: "2025-02-18",
    resumen: "La alimentación es clave para aprovechar al máximo tu entrenamiento.",
    contenido: `
      Una dieta balanceada con proteínas, carbohidratos complejos y grasas saludables 
      es esencial para rendir mejor en el gimnasio. 
      No olvides la hidratación, que juega un papel fundamental en el rendimiento.
    `,
    img: "../assets/logo.svg"
  },
  {
    id: "b3",
    titulo: "Entrenamiento funcional en casa",
    autor: "Coach Juan Pérez",
    fecha: "2025-03-01",
    resumen: "¿No puedes ir al gimnasio? Te contamos cómo entrenar en tu hogar.",
    contenido: `
      Con poco espacio y equipamiento básico como bandas elásticas o tu propio peso corporal, 
      puedes realizar rutinas funcionales efectivas que trabajan fuerza, equilibrio y resistencia.
    `,
    img: "../assets/logo.svg"
  }
];
