-- CreateEnum
CREATE TYPE "estado_venta" AS ENUM ('COMPLETADA', 'PENDIENTE', 'ANULADA');

-- CreateEnum
CREATE TYPE "frecuencia_gasto" AS ENUM ('SEMANAL', 'QUINCENAL', 'MENSUAL', 'TRIMESTRAL', 'SEMESTRAL', 'ANUAL');

-- CreateEnum
CREATE TYPE "tipo_metodo_pago" AS ENUM ('EFECTIVO', 'TARJETA');

-- CreateEnum
CREATE TYPE "tipo_viaje_opcion" AS ENUM ('SOLO_IDA', 'IDA_Y_VUELTA');

-- CreateTable
CREATE TABLE "aerolineas" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "esta_activo" BOOLEAN DEFAULT true,

    CONSTRAINT "aerolineas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias_gasto" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "categorias_gasto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id" BIGSERIAL NOT NULL,
    "primer_nombre" VARCHAR(100) NOT NULL,
    "segundo_nombre" VARCHAR(100),
    "primer_apellido" VARCHAR(100) NOT NULL,
    "segundo_apellido" VARCHAR(100),
    "nit" VARCHAR(20),
    "documento_identidad" VARCHAR(30),
    "direccion" TEXT,
    "telefono" VARCHAR(20),
    "correo_electronico" VARCHAR(255),
    "departamento_id" INTEGER,
    "deleted_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departamentos" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "departamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detalles_venta" (
    "id" BIGSERIAL NOT NULL,
    "venta_id" BIGINT NOT NULL,
    "servicio_id" INTEGER,
    "tipo_viaje" "tipo_viaje_opcion",
    "origen_pais_id" INTEGER,
    "destino_pais_id" INTEGER,
    "cantidad_pasajeros" INTEGER NOT NULL DEFAULT 1,
    "precio_boletos" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    "proveedor_id" INTEGER,
    "aerolinea_id" INTEGER,
    "detalles_especificos" TEXT,

    CONSTRAINT "detalles_venta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facturas" (
    "id" BIGSERIAL NOT NULL,
    "venta_id" BIGINT,
    "cliente_id" BIGINT,
    "fecha_factura" DATE NOT NULL DEFAULT CURRENT_DATE,
    "total_factura" DECIMAL(12,2) NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "facturas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gastos_fijos" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "monto" DECIMAL(12,2) NOT NULL,
    "frecuencia" "frecuencia_gasto" NOT NULL DEFAULT 'MENSUAL',
    "tipo_gasto_id" INTEGER,
    "esta_activo" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gastos_fijos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gastos_variables" (
    "id" BIGSERIAL NOT NULL,
    "fecha" DATE NOT NULL DEFAULT CURRENT_DATE,
    "descripcion" TEXT,
    "monto" DECIMAL(12,2) NOT NULL,
    "tipo_gasto_id" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gastos_variables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operadores_proveedores" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "esta_activo" BOOLEAN DEFAULT true,

    CONSTRAINT "operadores_proveedores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paises" (
    "id" SERIAL NOT NULL,
    "iso" VARCHAR(10) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "paises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "servicios" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "esta_activo" BOOLEAN DEFAULT true,

    CONSTRAINT "servicios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipos_gasto" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "categoria_gasto_id" INTEGER,

    CONSTRAINT "tipos_gasto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ventas" (
    "id" BIGSERIAL NOT NULL,
    "numero_recibo" VARCHAR(50) NOT NULL,
    "fecha_venta" DATE NOT NULL DEFAULT CURRENT_DATE,
    "cliente_id" BIGINT NOT NULL,
    "monto_recibo" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    "monto_neto" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    "comision_operador" DECIMAL(12,2) DEFAULT 0.00,
    "metodo_pago" "tipo_metodo_pago" NOT NULL DEFAULT 'EFECTIVO',
    "estado" "estado_venta" NOT NULL DEFAULT 'COMPLETADA',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ventas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clientes_documento_identidad_key" ON "clientes"("documento_identidad");

-- CreateIndex
CREATE UNIQUE INDEX "ventas_numero_recibo_key" ON "ventas"("numero_recibo");

-- AddForeignKey
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_departamento_id_fkey" FOREIGN KEY ("departamento_id") REFERENCES "departamentos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "detalles_venta" ADD CONSTRAINT "detalles_venta_aerolinea_id_fkey" FOREIGN KEY ("aerolinea_id") REFERENCES "aerolineas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "detalles_venta" ADD CONSTRAINT "detalles_venta_destino_pais_id_fkey" FOREIGN KEY ("destino_pais_id") REFERENCES "paises"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "detalles_venta" ADD CONSTRAINT "detalles_venta_origen_pais_id_fkey" FOREIGN KEY ("origen_pais_id") REFERENCES "paises"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "detalles_venta" ADD CONSTRAINT "detalles_venta_proveedor_id_fkey" FOREIGN KEY ("proveedor_id") REFERENCES "operadores_proveedores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "detalles_venta" ADD CONSTRAINT "detalles_venta_servicio_id_fkey" FOREIGN KEY ("servicio_id") REFERENCES "servicios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "detalles_venta" ADD CONSTRAINT "detalles_venta_venta_id_fkey" FOREIGN KEY ("venta_id") REFERENCES "ventas"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "facturas" ADD CONSTRAINT "facturas_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "facturas" ADD CONSTRAINT "facturas_venta_id_fkey" FOREIGN KEY ("venta_id") REFERENCES "ventas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "gastos_fijos" ADD CONSTRAINT "gastos_fijos_tipo_gasto_id_fkey" FOREIGN KEY ("tipo_gasto_id") REFERENCES "tipos_gasto"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "gastos_variables" ADD CONSTRAINT "gastos_variables_tipo_gasto_id_fkey" FOREIGN KEY ("tipo_gasto_id") REFERENCES "tipos_gasto"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tipos_gasto" ADD CONSTRAINT "tipos_gasto_categoria_gasto_id_fkey" FOREIGN KEY ("categoria_gasto_id") REFERENCES "categorias_gasto"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
