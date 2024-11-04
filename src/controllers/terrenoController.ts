import { Request, Response } from 'express';
import { ParsedQs } from 'qs';
import Terreno from '../models/Terreno';

export default class TerrenoController {
  static async getAll(req: Request, res: Response) {
    try {
      const terrenos = await Terreno.getAllTerrenos();
      res.status(200).json(terrenos);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener terrenos', error });
    }
  }

  static async getById(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const terreno = await Terreno.getTerrenoById(Number(id));
      if (terreno) {
        res.status(200).json(terreno);
      } else {
        res.status(404).json({ message: 'Terreno no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener el terreno', error });
    }
  }

  static async getByTipo(req: Request, res: Response) {
    const { tipo } = req.params;

    try {
      const terrenos = await Terreno.getTerrenosByTipo(tipo);
      res.status(200).json(terrenos);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener terrenos por tipo', error });
    }
  }

  static async getByUsuarioId(req: Request, res: Response) {
    const { usuario_id } = req.params;

    try {
      const terrenos = await Terreno.getTerrenosByUsuarioId(Number(usuario_id));
      res.status(200).json(terrenos);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener terrenos del usuario', error });
    }
  }

  static async getByUbicacion(req: Request, res: Response) {
    const { ubicacion } = req.params;

    try {
      const terrenos = await Terreno.getTerrenosByUbicacion(ubicacion);
      res.status(200).json(terrenos);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener terrenos por ubicación', error });
    }
  }

  static async create(req: Request, res: Response) {
    const { nombre, ubicacion, latitud, longitud, capacidad, precio, tipo_terreno, descripcion, usuario_id } = req.body;
    const files = req.files as Express.Multer.File[];

    try {
      // Extrae las URLs de las imágenes
      const imagenes = files.map(file => `/uploads/${file.filename}`);

      // Crea el terreno con las URLs de las imágenes
      const nuevoTerreno = await Terreno.createTerreno({
        nombre,
        ubicacion,
        latitud: latitud ? Number(latitud) : undefined,
        longitud: longitud ? Number(longitud) : undefined,
        capacidad: Number(capacidad),
        precio: Number(precio),
        tipo_terreno,
        descripcion,
        usuario_id: Number(usuario_id),
        imagenes, // Pasa las URLs de las imágenes al modelo
      });

      res.status(201).json(nuevoTerreno);
    } catch (error) {
      res.status(500).json({ message: 'Error al crear el terreno con imágenes', error });
    }
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const { precio, capacidad, publicado, tipo_terreno, descripcion, ubicacion, nombre, latitud, longitud } = req.body;

    try {
      const terrenoActualizado = await Terreno.updateTerreno(Number(id), {
        precio,
        capacidad,
        publicado,
        tipo_terreno,
        descripcion,
        ubicacion,
        nombre,
        latitud,
        longitud,
      });
      res.status(200).json(terrenoActualizado);
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar el terreno', error });
    }
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      await Terreno.deleteTerreno(Number(id));
      res.status(200).json({ message: 'Terreno eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar el terreno', error });
    }
  }

  static async getByEtiquetas(req: Request, res: Response) {
    const etiquetas = req.query.etiquetas as string | string[] | undefined;
  
    if (!etiquetas) {
      return res.status(400).json({ message: 'Debe proporcionar al menos una etiqueta' });
    }
  
    try {
      // Convierte etiquetas en un array de strings
      const etiquetasArray: string[] = Array.isArray(etiquetas)
        ? etiquetas
        : etiquetas.split(',');
  
      if (etiquetasArray.length === 0) {
        return res.status(400).json({ message: 'Debe proporcionar al menos una etiqueta válida' });
      }
  
      const terrenos = await Terreno.getTerrenosByEtiquetas(etiquetasArray);
      res.status(200).json(terrenos);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener terrenos por etiquetas', error });
    }
  }
  
}
