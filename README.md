# 🐶 API REST - Plataforma de Adopción de Mascotas

Esta API permite que los usuarios publiquen mascotas para adopción, vean publicaciones, eliminen sus propios posts y más.

---

## 🧩 Autenticación

- Algunos endpoints requieren autenticación mediante **Bearer Token** (usando el token de Supabase).
- El token debe enviarse en los headers:

```http
Authorization: Bearer <token>
```

---

## 📚 Endpoints

### 🔹 `POST /api/auth/register`

- 📄 **Descripción:** Registro de nuevos usuarios.
- 🔐 **Auth:** No
- 📥 **Tipo de body:** `multipart/form-data`
- 📥 **Campos requeridos:**

  - `name`: string
  - `last_name`: string
  - `password`: string
  - `email`: string
  - `phone_number`: number
  - `age`: number
  - `location`: string
  - `gender_id`: string
  - `avatar`: file (imagen de perfil)

- 📤 **Respuesta:**

```json
{
  "message": "Usuario creado exitosamente."
}
```

---

### 🔹 `POST /api/auth/login`

- 📄 **Descripción:** Inicia sesión un usuario existente.
- 🔐 **Auth:** No
- 📥 **Tipo de body:** `application/json`
- 📥 **Campos requeridos:**

  - `email`: string
  - `password`: string

- 📤 **Respuesta:**

```json
{
  "message": "Login exitoso",
  "token": "JWT_TOKEN_AQUÍ",
  "refreshToken": "REFRESH_TOKEN_AQUÍ",
  "user": {
    "id": "UUID",
    "email": "usuario@example.com",
    "name": "Nombre",
    "last_name": "Apellido",
    "photo_url": "https://url.com/avatar.jpg",
    "phone_number": "1234567890"
  }
}
```

---

### 🔹 `GET /api/users/me`

- 📄 **Descripción:** Devuelve los datos del usuario autenticado.
- 🔐 **Auth:** Si
- 📥 **Headers requeridos:** Authorization: Bearer TOKEN
- 📤 **Respuesta:**

```json
{
  "id": "86db7593-d9d8-414e-acfd-************",
  "email": "rodrygo@example.com",
  "name": "Rodrygo",
  "lastName": "Goes",
  "avatar": "https://url.com/avatar.jpg",
  "age": 24,
  "gender": "Masculino",
  "location": "Calle Brasil"
}
```

---

### 🔹 `POST /api/posts/create`

- 📄 **Descripción:** Crear un post para dar una mascota en adopcion.
- 🔐 **Auth:** Si
- 📥 **Tipo de body:** `multipart/form-data`
- 📥 **Campos requeridos:**

  - `name`: string
  - `breed`: string
  - `description`: string
  - `age`: number
  - `gender_id`: number
  - `size_id`: number
  - `specie_id`: number
  - `status_id`: number
  - `photo`: file (imagen de la mascota)

- 📤 **Respuesta:**

```json
{
  "message": "Mascota publicada exitosamente",
  "result": {
    "message": "Mascota publicada exitosamente",
    "pet": {
      "user_id": "86db7593-d9d8-414e-acfd-************",
      "age": "3",
      "breed": "Mestizo",
      "description": "Es una gran perrita la doy en adopcion, ya que no es mia la encontre afuera de mi casa y le di un hogar temporal",
      "gender_id": "2",
      "name": "Sara",
      "size_id": "3",
      "specie_id": "1",
      "status_id": 1,
      "photo_url": "https://url.com/photo.jpg"
    }
  }
}
```

---

### 🔹 `GET /api/posts/get-posts`

- 📄 **Descripción:** Lista todas las mascotas publicadas que _no están adoptadas_.
- 🔐 **Auth:** No
- 📤 **Respuesta:**

```json
[
  {
    "id": "6574...",
    "name": "Tobi",
    "age": 2,
    "breed": "Salchicha",
    "gender": "Macho",
    "size": "Pequeño",
    "specie": "Perro",
    "status": "Publicado",
    "photo_url": "https://...",
    "user": {
      "user_id": "uuid...",
      "name": "Tobias",
      "last_name": "Beto",
      "location": "Flores",
      "photo_url": "https://..."
    }
  }
]
```

---

### 🔹 `GET /api/posts/get-post/:id`

- 📄 **Descripción:** Devuelve todos los datos de una mascota específica por ID.
- 🔐 **Auth:** No
- 📤 **Respuesta:**

```json
{
  "id": "6574...",
  "name": "Tobi",
  "age": 2,
  "gender": "Macho",
  "specie": "Perro",
  ...
}
```

---

### 🔹 `POST /api/posts/create-post`

- 📄 **Descripción:** Permite a un usuario logueado publicar una mascota.
- 🔐 **Auth:** Sí
- 📥 **Tipo de body:** `multipart/form-data`
- 📥 **Campos requeridos:**

  - `name`: string
  - `age`: number
  - `breed`: string
  - `description`: string
  - `gender_id`: number
  - `size_id`: number
  - `specie_id`: number
  - `status_id`: number
  - `file`: imagen de la mascota

- 📤 **Respuesta:**

```json
{
  "message": "Post creado correctamente"
}
```

---

### 🔹 `DELETE /api/posts/delete/:id`

- 📄 **Descripción:** Elimina un post propio (solo si el usuario logueado es el creador).
- 🔐 **Auth:** Sí
- 📤 **Respuesta:**

```json
{
  "message": "Post eliminado correctamente"
}
```

---

## 📦 Bucket de imágenes

- 📤 Las imágenes de mascotas se suben a Supabase Storage, bucket `pet-images`.
- 🗂️ Cada imagen se guarda bajo una carpeta con el ID del usuario: `userId/imagen.jpg`.

---

## 🧪 Test con Postman

- Podés testear los endpoints en Postman usando la URL base:

```
https://proyecto-adopcion-de-mascotas.onrender.com
```

---

## 🛠 Stack

- **Backend:** Node.js + Express
- **Auth:** Supabase Auth (Bearer Token)
- **Base de Datos:** Supabase (PostgreSQL)
- **Storage:** Supabase Buckets
- **Deploy:** Render
