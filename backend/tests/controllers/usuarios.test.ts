import { test, describe, after, beforeEach } from "node:test";
import assert from "node:assert";
import mongoose from "mongoose";
import supertest from "supertest";
import app from "../../src/app";
import UsuarioModel from "../../src/models/users";
import helper from "./test_helper";

const api = supertest(app);

describe("when there are initially some users saved", () => {
  beforeEach(async () => {
    await UsuarioModel.deleteMany({});
    
    // Crear usuarios uno por uno para evitar problemas con hash de passwords
    for (const usuario of helper.initialUsuarios) {
      const usuarioObject = new UsuarioModel(usuario);
      await usuarioObject.save();
    }
  });

  test("users are returned as json", async () => {
    await api
      .get("/api/usuarios")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all users are returned", async () => {
    const response = await api.get("/api/usuarios");
    assert(response.body.length >= helper.initialUsuarios.length);
  });

  test("a specific user is within the returned users", async () => {
    const response = await api.get("/api/usuarios");
    const nombres = response.body.map((u: { nombre: string }) => u.nombre);
    assert(nombres.includes("Juan Pérez"));
  });

  test("users do not contain password field", async () => {
    const response = await api.get("/api/usuarios");
    assert(response.body.length > 0);
    const usuario = response.body[0];
    assert(!usuario.hasOwnProperty("password"));
  });

  describe("viewing a specific user", () => {
    test("succeeds with a valid id", async () => {
      const usuariosAtStart = await helper.usuariosInDb();
      const usuarioToView = usuariosAtStart[0];

      const resultUsuario = await api
        .get(`/api/usuarios/${usuarioToView.id}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      assert.strictEqual(resultUsuario.body.nombre, usuarioToView.nombre);
      assert.strictEqual(resultUsuario.body.email, usuarioToView.email);
      assert(!resultUsuario.body.hasOwnProperty("password"));
    });

    test("fails with statuscode 404 if user does not exist", async () => {
      const validNonexistingId = await helper.nonExistingUserId();

      await api
        .get(`/api/usuarios/${validNonexistingId}`)
        .expect(404);
    });

    test("fails with statuscode 400 if id is invalid", async () => {
      const invalidId = "5a3d5da59070081a82a3445";

      await api
        .get(`/api/usuarios/${invalidId}`)
        .expect(400);
    });
  });

  describe("addition of a new user", () => {
    test("succeeds with valid data", async () => {
      const usuariosAtStart = await helper.usuariosInDb();

      // Usar timestamp para garantizar unicidad
      const timestamp = Date.now();
      const newUsuario = {
        nombre: "Ana López",
        email: `ana${timestamp}@test.com`, 
        password: "password789",
        telefono: `+569${timestamp.toString().slice(-8)}` // Teléfono único
      };

      const response = await api
        .post("/api/usuarios")
        .send(newUsuario)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      // Verificar que la respuesta NO incluye password
      assert(!response.body.hasOwnProperty("password"));
      assert.strictEqual(response.body.nombre, newUsuario.nombre);
      assert.strictEqual(response.body.email, newUsuario.email);

      const usuariosAtEnd = await helper.usuariosInDb();
      assert.strictEqual(usuariosAtEnd.length, usuariosAtStart.length + 1);

      const nombres = usuariosAtEnd.map(u => u.nombre);
      assert(nombres.includes(newUsuario.nombre));
    });

    test("fails with status code 409 if email already exists", async () => {
      const usuariosAtStart = await helper.usuariosInDb();

      const newUsuario = {
        nombre: "Usuario Duplicado",
        email: "juan@test.com", // Email que ya existe
        password: "password123"
      };

      const result = await api
        .post("/api/usuarios")
        .send(newUsuario)
        .expect(409)
        .expect("Content-Type", /application\/json/);

      assert(result.body.error.includes("email"));

      const usuariosAtEnd = await helper.usuariosInDb();
      assert.strictEqual(usuariosAtEnd.length, usuariosAtStart.length);
    });

    test("fails with status code 400 if data invalid", async () => {
      const usuariosAtStart = await helper.usuariosInDb();

      const newUsuario = {
        nombre: "", // Nombre vacío
        email: "email-invalido", // Email inválido
        password: "123" // Password muy corto
      };

      const result = await api
        .post("/api/usuarios")
        .send(newUsuario)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      assert(result.body.error);
      assert(result.body.detalles);

      const usuariosAtEnd = await helper.usuariosInDb();
      assert.strictEqual(usuariosAtEnd.length, usuariosAtStart.length);
    });

    test("fails without content", async () => {
      const usuariosAtStart = await helper.usuariosInDb();

      const newUsuario = {};

      await api
        .post("/api/usuarios")
        .send(newUsuario)
        .expect(400);

      const usuariosAtEnd = await helper.usuariosInDb();
      assert.strictEqual(usuariosAtEnd.length, usuariosAtStart.length);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});