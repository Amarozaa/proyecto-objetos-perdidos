import { test, describe, after, beforeEach } from "node:test";
import assert from "node:assert";
import mongoose from "mongoose";
import supertest from "supertest";
import app from "../../src/app";
import PublicacionModel from "../../src/models/posts";
import UsuarioModel from "../../src/models/users";
import helper from "./test_helper";

const api = supertest(app);

describe("when there are initially some publicaciones saved", () => {
  let usuarioId: string;

  beforeEach(async () => {
    await PublicacionModel.deleteMany({});
    await UsuarioModel.deleteMany({});

    const timestamp = Date.now();
    const usuario = new UsuarioModel({
      nombre: "Test User",
      email: `testuser${timestamp}@test.com`,
      password: "password123",
    });
    const savedUsuario = await usuario.save();
    usuarioId = savedUsuario._id.toString();

    const publicacionesWithUserId = helper.initialPublicaciones.map((pub) => ({
      ...pub,
      usuario_id: usuarioId,
    }));

    await PublicacionModel.insertMany(publicacionesWithUserId);
  });

  test("publicaciones are returned as json", async () => {
    await api
      .get("/api/publicaciones")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all publicaciones are returned with pagination", async () => {
    const response = await api.get("/api/publicaciones");

    assert.strictEqual(
      response.body.publicaciones.length,
      helper.initialPublicaciones.length
    );
    assert(response.body.pagination);
    assert.strictEqual(
      response.body.pagination.total,
      helper.initialPublicaciones.length
    );
  });

  test("a specific publicacion is within the returned publicaciones", async () => {
    const response = await api.get("/api/publicaciones");
    const titulos = response.body.publicaciones.map(
      (p: { titulo: string }) => p.titulo
    );
    assert(titulos.includes("iPhone perdido"));
  });

  test("publicaciones include populated usuario data", async () => {
    const response = await api.get("/api/publicaciones");

    assert(response.body.publicaciones.length > 0);
    const publicacion = response.body.publicaciones[0];

    assert(publicacion.usuario_id);
    assert(typeof publicacion.usuario_id === "object");
    assert(publicacion.usuario_id.nombre, "Usuario should have nombre");
    assert(publicacion.usuario_id.email, "Usuario should have email");
    assert(
      !publicacion.usuario_id.password,
      "Usuario should not have password"
    );
  });

  describe("filtering publicaciones", () => {
    test("can filter by tipo", async () => {
      const response = await api
        .get("/api/publicaciones?tipo=Perdido")
        .expect(200);

      const perdidas = response.body.publicaciones.filter(
        (p: { tipo: string }) => p.tipo === "Perdido"
      );
      assert.strictEqual(perdidas.length, response.body.publicaciones.length);
    });

    test("can filter by categoria", async () => {
      const response = await api
        .get("/api/publicaciones?categoria=Electrónicos")
        .expect(200);

      const electronicas = response.body.publicaciones.filter(
        (p: { categoria: string }) => p.categoria === "Electrónicos"
      );
      assert.strictEqual(
        electronicas.length,
        response.body.publicaciones.length
      );
    });

    test("can filter by estado", async () => {
      const response = await api
        .get("/api/publicaciones?estado=No resuelto")
        .expect(200);

      const noResueltas = response.body.publicaciones.filter(
        (p: { estado: string }) => p.estado === "No resuelto"
      );
      assert.strictEqual(
        noResueltas.length,
        response.body.publicaciones.length
      );
    });
  });

  describe("viewing a specific publicacion", () => {
    test("succeeds with a valid id", async () => {
      const publicacionesAtStart = await helper.publicacionesInDb();
      const publicacionToView = publicacionesAtStart[0];

      const resultPublicacion = await api
        .get(`/api/publicaciones/${publicacionToView.id}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      assert.strictEqual(
        resultPublicacion.body.titulo,
        publicacionToView.titulo
      );
      assert.strictEqual(
        resultPublicacion.body.descripcion,
        publicacionToView.descripcion
      );

      assert(resultPublicacion.body.usuario_id);
      assert(typeof resultPublicacion.body.usuario_id === "object");
      if (
        resultPublicacion.body.usuario_id &&
        typeof resultPublicacion.body.usuario_id === "object"
      ) {
        assert(resultPublicacion.body.usuario_id.nombre);
      }
    });

    test("fails with statuscode 404 if publicacion does not exist", async () => {
      const validNonexistingId = await helper.nonExistingPublicacionId();

      await api.get(`/api/publicaciones/${validNonexistingId}`).expect(404);
    });

    test("fails with statuscode 400 if id is invalid", async () => {
      const invalidId = "5a3d5da59070081a82a3445";

      await api.get(`/api/publicaciones/${invalidId}`).expect(400);
    });
  });

  describe("addition of a new publicacion", () => {
    test("succeeds with valid data", async () => {
      const publicacionesAtStart = await helper.publicacionesInDb();

      const newPublicacion = {
        titulo: "Billetera perdida",
        descripcion: "Billetera de cuero marrón perdida con documentos",
        lugar: "Plaza de Armas",
        fecha: "2024-01-20",
        tipo: "Perdido",
        categoria: "Documentos",
        usuario_id: usuarioId,
      };

      const savedPublicacion = await api
        .post("/api/publicaciones")
        .send(newPublicacion)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      assert.strictEqual(savedPublicacion.body.titulo, newPublicacion.titulo);
      assert.strictEqual(savedPublicacion.body.estado, "No resuelto");

      const publicacionesAtEnd = await helper.publicacionesInDb();
      assert.strictEqual(
        publicacionesAtEnd.length,
        publicacionesAtStart.length + 1
      );

      const titulos = publicacionesAtEnd.map((p) => p.titulo);
      assert(titulos.includes(newPublicacion.titulo));
    });

    test("fails with status code 404 if usuario does not exist", async () => {
      const publicacionesAtStart = await helper.publicacionesInDb();
      const nonExistingUserId = await helper.nonExistingUserId();

      const newPublicacion = {
        titulo: "Test publicacion",
        descripcion: "Descripción de prueba para usuario inexistente",
        lugar: "Lugar de prueba",
        fecha: "2024-01-20",
        tipo: "Perdido",
        categoria: "Otros",
        usuario_id: nonExistingUserId,
      };

      await api.post("/api/publicaciones").send(newPublicacion).expect(404);

      const publicacionesAtEnd = await helper.publicacionesInDb();
      assert.strictEqual(
        publicacionesAtEnd.length,
        publicacionesAtStart.length
      );
    });

    test("fails with status code 400 if data invalid", async () => {
      const publicacionesAtStart = await helper.publicacionesInDb();

      const newPublicacion = {
        titulo: "AB",
        descripcion: "Corta",
        lugar: "",
        fecha: "fecha-invalida",
        tipo: "TipoInvalido",
        categoria: "CategoriaInvalida",
        usuario_id: "id-invalido",
      };

      const result = await api
        .post("/api/publicaciones")
        .send(newPublicacion)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      assert(result.body.error);
      assert(result.body.detalles);

      const publicacionesAtEnd = await helper.publicacionesInDb();
      assert.strictEqual(
        publicacionesAtEnd.length,
        publicacionesAtStart.length
      );
    });

    test("fails without content", async () => {
      const publicacionesAtStart = await helper.publicacionesInDb();

      const newPublicacion = {};

      await api.post("/api/publicaciones").send(newPublicacion).expect(400);

      const publicacionesAtEnd = await helper.publicacionesInDb();
      assert.strictEqual(
        publicacionesAtEnd.length,
        publicacionesAtStart.length
      );
    });

    test("rejects future dates", async () => {
      const publicacionesAtStart = await helper.publicacionesInDb();

      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      const futureDateString = futureDate.toISOString().split("T")[0];

      const newPublicacion = {
        titulo: "Publicación futura",
        descripcion: "Descripción de publicación con fecha futura",
        lugar: "Lugar futuro",
        fecha: futureDateString,
        tipo: "Perdido",
        categoria: "Otros",
        usuario_id: usuarioId,
      };

      await api.post("/api/publicaciones").send(newPublicacion).expect(400);

      const publicacionesAtEnd = await helper.publicacionesInDb();
      assert.strictEqual(
        publicacionesAtEnd.length,
        publicacionesAtStart.length
      );
    });
  });

  describe("updating a publicacion", () => {
    test("succeeds with valid data", async () => {
      const publicacionesAtStart = await helper.publicacionesInDb();
      const publicacionToUpdate = publicacionesAtStart[0];

      const updatedData = {
        estado: "Resuelto"
      };

      const result = await api
        .put(`/api/publicaciones/${publicacionToUpdate.id}`)
        .send(updatedData)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      assert.strictEqual(result.body.estado, "Resuelto");
      assert.strictEqual(result.body.titulo, publicacionToUpdate.titulo);
    });

    test("fails with statuscode 404 if publicacion does not exist", async () => {
      const validNonexistingId = await helper.nonExistingPublicacionId();

      const updatedData = {
        estado: "Resuelto"
      };

      await api
        .put(`/api/publicaciones/${validNonexistingId}`)
        .send(updatedData)
        .expect(404);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
