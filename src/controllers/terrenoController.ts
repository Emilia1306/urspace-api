import { Request, Response, RequestHandler  } from 'express';
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
    const { nombre, ubicacion, latitud, longitud, capacidad, precio, tipo_terreno, descripcion, usuario_id, etiquetas } = req.body;
    const files = req.files as Express.Multer.File[];

    try {
      const imagenes = files.map(file => `/uploads/${file.filename}`);

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
        imagenes,   
        etiquetas,  
      });

      res.status(201).json(nuevoTerreno);
    } catch (error) {
      res.status(500).json({ message: 'Error al crear el terreno con imágenes y etiquetas', error });
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

  static async getByEtiquetas(req: Request, res: Response): Promise<Response | void> {
    const etiquetas = req.query.etiquetas as string | string[] | undefined;

    if (!etiquetas) {
      return res.status(400).json({ message: 'Debe proporcionar al menos una etiqueta' });
    }

    try {
      const etiquetasArray = Array.isArray(etiquetas) ? etiquetas : etiquetas.split(',');

      if (etiquetasArray.length === 0) {
        return res.status(400).json({ message: 'Debe proporcionar al menos una etiqueta válida' });
      }

      const terrenos = await Terreno.getTerrenosByEtiquetas(etiquetasArray);
      return res.status(200).json(terrenos);
    } catch (error) {
      console.error('Error detallado al obtener terrenos por etiquetas:', error);
      return res.status(500).json({ message: 'Error al obtener terrenos por etiquetas', error: error instanceof Error ? error.message : error });
    }
  }

  static async getTerrenosPublicados(req: Request, res: Response) {
    console.log("Llamando a getTerrenosPublicados en el controlador");
    try {
      const terrenos = await Terreno.getTerrenosPublicados();
      console.log("Datos obtenidos de terrenos:", terrenos);
      res.status(200).json(terrenos);
    } catch (error) {
      console.error('Error detallado al obtener terrenos publicados:', error);
      res.status(500).json({ message: 'Error al obtener el terreno', error: error instanceof Error ? error.stack : error });
    }
  }

  static async getTerrenosNoPublicados(req: Request, res: Response) {
    try {
      const terrenos = await Terreno.getTerrenosNoPublicados();
      res.status(200).json(terrenos);
    } catch (error) {
      console.error('Error detallado al obtener terrenos publicados:', error);
      res.status(500).json({ message: 'Error al obtener terrenos no publicados', error: error });
    }
  }

  static async getImagenesByTerrenoId(req: Request, res: Response): Promise<Response | void> {
    const { id } = req.params;

    try {
      const imagenes = await Terreno.getImagenesByTerrenoId(Number(id));

      if (imagenes.length === 0) {
        return res.status(404).json({ message: 'No se encontraron imágenes para el terreno especificado' });
      }

      return res.status(200).json(imagenes);
    } catch (error) {
      console.error('Error detallado al obtener imágenes por id de terreno:', error);
      return res.status(500).json({ message: 'Error al obtener las imágenes del terreno', error: error instanceof Error ? error.message : error });
    }
  }

  static async getUbicacionByTerrenoId(req: Request, res: Response): Promise<Response | void> {
    const { id } = req.params;

    try {
      const terreno = await Terreno.getUbicacionByTerrenoId(Number(id));

      if (!terreno) {
        return res.status(404).json({ message: 'Terreno no encontrado' });
      }

      return res.status(200).json({ ubicacion: terreno.ubicacion });
    } catch (error) {
      console.error('Error detallado al obtener la ubicación del terreno:', error);
      return res.status(500).json({ message: 'Error al obtener la ubicación del terreno', error: error instanceof Error ? error.message : error });
    }
  }

  static deshabilitar: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      // Lógica para deshabilitar el terreno
      const terreno = await Terreno.deshabilitarTerreno(Number(id), { publicado: false });
      res.status(200).json({ message: 'Terreno deshabilitado', terreno });
    } catch (error) {
      res.status(500).json({ message: 'Error al deshabilitar el terreno', error });
    }
  };
  
}
