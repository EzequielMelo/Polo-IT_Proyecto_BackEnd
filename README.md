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

### 🔹 `GET /api/posts/get-posts`

- 📄 **Descripción:** Lista todas las mascotas publicadas que *no están adoptadas*.
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
https://<tu-proyecto>.onrender.com/api/posts
```

---

## 🛠 Stack

- **Backend:** Node.js + Express
- **Auth:** Supabase Auth (Bearer Token)
- **Base de Datos:** Supabase (PostgreSQL)
- **Storage:** Supabase Buckets
- **Deploy:** Render