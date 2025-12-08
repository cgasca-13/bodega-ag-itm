# Configuración de Cloudinary para Subida de Imágenes

## Pasos para Configurar Cloudinary

1. **Crear una cuenta en Cloudinary**
   - Ve a [https://cloudinary.com](https://cloudinary.com)
   - Regístrate o inicia sesión

2. **Obtener tus credenciales**
   - En el Dashboard, encontrarás:
     - **Cloud Name** (nombre de tu cloud)
     - **API Key**
     - **API Secret**

3. **Crear un Upload Preset**
   - Ve a Settings → Upload
   - Scroll hasta "Upload presets"
   - Clic en "Add upload preset"
   - Configura:
     - **Preset name**: `bodega_preset` (o el nombre que prefieras)
     - **Signing Mode**: `Unsigned` (para subir desde el cliente)
     - **Folder**: `bodega-itm` (opcional, para organizar imágenes)
   - Guarda los cambios

4. **Actualizar el código**
   - Abre `app/Components/Inventory/InventoryModal.tsx`
   - En la línea que dice `YOUR_CLOUD_NAME`, reemplázalo con tu Cloud Name:
   ```typescript
   const response = await fetch('https://api.cloudinary.com/v1_1/TU_CLOUD_NAME/image/upload', {
   ```
   - Si cambiaste el nombre del preset, actualízalo también:
   ```typescript
   formData.append('upload_preset', 'tu_preset_name');
   ```

## Configuración para Next.js Image

Para que Next.js pueda cargar imágenes desde Cloudinary, agrega esto en `next.config.ts`:

```typescript
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
};
```

## Ejemplo de Uso

1. El usuario selecciona una imagen usando el input de tipo file
2. La imagen se sube automáticamente a Cloudinary
3. Cloudinary devuelve la URL segura (`secure_url`)
4. Esa URL se guarda en la base de datos
5. Para mostrar la imagen, se usa el componente `Image` de Next.js con la URL de Cloudinary

## Beneficios

- ✅ Imágenes optimizadas automáticamente
- ✅ CDN global para carga rápida
- ✅ Transformaciones de imagen on-the-fly
- ✅ Almacenamiento seguro en la nube
- ✅ No ocupas espacio en tu servidor
