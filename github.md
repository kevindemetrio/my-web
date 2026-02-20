# 🚀 Guía rápida de Git para mi proyecto

Repositorio conectado a GitHub y Cloudflare Pages.

---

# 📌 Conceptos básicos

## 🔹 ¿Qué es una rama (branch)?

Una rama es una versión paralela de tu proyecto.

- `main` → versión oficial / producción
- `dev` → desarrollo
- `feature-x` → nueva funcionalidad

Piensa en ramas como líneas de trabajo separadas.

---

# 📍 Ver en qué rama estoy

```bash
git branch
```

La que tiene `*` es la actual.

---

# 🌿 Crear una nueva rama

```bash
git checkout -b nombre-rama
```

Ejemplo:

```bash
git checkout -b nueva-seccion
```

Esto:
- Crea la rama
- Cambia automáticamente a ella

---

# 🔄 Cambiar de rama

```bash
git checkout main
```

O:

```bash
git checkout nombre-rama
```

---

# 💾 Guardar cambios (flujo normal)

Después de modificar archivos:

```bash
git add .
git commit -m "Descripción del cambio"
```

Ejemplo:

```bash
git add .
git commit -m "Cambio texto del formulario"
```

---

# 🚀 Subir cambios a GitHub

Si estás en `main`:

```bash
git push
```

Si estás en una nueva rama la primera vez:

```bash
git push -u origin nombre-rama
```

Después de la primera vez solo:

```bash
git push
```

---

# 🔀 Pasar cambios de una rama a main

1️⃣ Cambiar a main:

```bash
git checkout main
```

2️⃣ Traer cambios:

```bash
git merge nombre-rama
```

3️⃣ Subir a GitHub:

```bash
git push
```

---

# 🔄 Flujo recomendado para trabajar seguro

1. Crear rama nueva:
   ```bash
   git checkout -b nueva-feature
   ```

2. Hacer cambios
3. Guardar:
   ```bash
   git add .
   git commit -m "Nueva feature"
   ```

4. Subir rama:
   ```bash
   git push -u origin nueva-feature
   ```

5. Cuando todo esté OK:
   ```bash
   git checkout main
   git merge nueva-feature
   git push
   ```

Cloudflare actualizará automáticamente al hacer push a `main`.

---

# 🧹 Borrar una rama cuando ya no la necesitas

```bash
git branch -d nombre-rama
```

---

# 📥 Traer cambios si trabajas desde otro ordenador

```bash
git pull
```

---

# 🔥 Flujo más simple (si trabajas tú solo)

Modificar → Guardar → Subir:

```bash
git add .
git commit -m "Cambio"
git push
```

Y listo.

---

# 🧠 Resumen mental

- main = versión pública
- ramas = experimentos seguros
- push = subir cambios
- pull = bajar cambios
- merge = unir ramas
