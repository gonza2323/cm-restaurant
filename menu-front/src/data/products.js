const menu = {
  id: 1,
  secciones: [
    {
      id: 1,
      nombre: "Platos Principales",
      items: [
        {
          id: 1,
          nombre: "Milanesa con Papas",
          descripcion: "Milanesa de carne acompañada con papas fritas",
          precio: 14500.0,
          imageUrl: "/img/milanesa.jpg"
        },
        {
          id: 2,
          nombre: "Lomo Completo",
          descripcion: "Lomo con lechuga, tomate, jamón y queso",
          precio: 16500.0,
          imageUrl: "/img/lomo.jpg"
        },
        {
          id: 3,
          nombre: "Ravioles con Salsa Mixta",
          descripcion: "Ravioles caseros con salsa fileto y crema",
          precio: 13000.0,
          imageUrl: "/img/ravioles.jpg"
        }
      ]
    },
    {
      id: 2,
      nombre: "Bebidas",
      items: [
        {
          id: 4,
          nombre: "Coca-Cola 500ml",
          descripcion: "Gaseosa Coca-Cola",
          precio: 3500.0,
          imageUrl: "/img/coca.jpg"
        },
        {
          id: 5,
          nombre: "Agua Mineral",
          descripcion: "Agua mineral sin gas",
          precio: 2500.0,
          imageUrl: "/img/agua.jpg"
        },
        {
          id: 6,
          nombre: "Limonada",
          descripcion: "Limonada natural con menta",
          precio: 4000.0,
          imageUrl: "/img/limonada.jpg"
        }
      ]
    },
    {
      id: 3,
      nombre: "Postres",
      items: [
        {
          id: 7,
          nombre: "Flan Casero",
          descripcion: "Flan con dulce de leche y crema",
          precio: 4500.0,
          imageUrl: "/img/flan.jpg"
        },
        {
          id: 8,
          nombre: "Helado",
          descripcion: "Tres bochas a elección",
          precio: 5000.0,
          imageUrl: "/img/helado.jpg"
        },
        {
          id: 9,
          nombre: "Brownie con Helado",
          descripcion: "Brownie tibio acompañado con helado de vainilla",
          precio: 6000.0,
          imageUrl: "/img/brownie.jpg"
        }
      ]
    }
  ]
};

export default menu;