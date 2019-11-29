import models from '../models';
import bcrypt from 'bcryptjs';
import token from '../services/token';

export default {
    add: async (req, res, next) => {
        try {
            req.body.password = await bcrypt.hash(req.body.password,10); // encriptado
            const reg = await models.Usuario.create(req.body);
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'ocurrio un error'
            });
            next(e);
        }
    },
    query: async (req, res, next) => {
        try {
            const reg = await models.Usuario.findOne({ _id: req.query._id });
            if (!reg) {
                res.status(404).send({
                    message: 'El registro no existe'
                });
            } else {
                res.status(200).json(reg);
            }
        } catch (e) {
            res.status(500).send({
                message: 'ocurrio un error'
            });
            next(e);
        }
    },
    list: async (req, res, next) => {
        try { //primer parametro de find es una busqueda y el siquiente un parametro
            let valor = req.query.valor;
            const reg = await models.Usuario.find({ $or: [{ 'nombre': new RegExp(valor, 'i') }, { 'email': new RegExp(valor, 'i') }] }, { createdAt: 0 }).
                sort({ 'createdAt': -1 }); //1 ordenar de forma acendente -1 decendente, los que se han creado recientemente aparecen primero 
            res.status(200).json(reg);

        } catch (e) {
            res.status(500).send({
                message: 'ocurrio un error'
            });
            next(e);
        }
    },
    udpdate: async (req, res, next) => {
        try {
            let pass = req.body.password;
            const reg0 = await models.Usuario.findOne({_id:req.body._id});
            if (pass != reg0.password) {
                req.body.password = await bcrypt.hash(req.body.password, 10); // encriptado
            }
            const reg = await models.Usuario.findByIdAndUpdate({ _id: req.body._id }, { rol: req.body.rol, nombre: req.body.nombre, 
                                                                                        tipo_documento: req.body.tipo_documento, 
                                                                                        num_documento: req.body.num_documento, 
                                                                                        direccion: req.body.direccion, telefono: req.body.telefono, 
                                                                                        email: req.body.email, password: req.body.password });
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'ocurrio un error'
            });
            next(e);
        }
    },
    remove: async (req, res, next) => {
        try {
            const reg = await models.Usuario.findByIdAndDelete({ _id: req.body._id });
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'ocurrio un error'
            });
            next(e);
        }
    },
    activate: async (req, res, next) => {
        try {
            const reg = await models.Usuario.findByIdAndUpdate({ _id: req.body._id }, { estado: 1 });
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'ocurrio un error'
            });
            next(e);
        }
    },
    deactivate: async (req, res, next) => {
        try {
            const reg = await models.Usuario.findByIdAndUpdate({ _id: req.body._id }, { estado: 0 });
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'ocurrio un error'
            });
            next(e);
        }
    },
    login: async (req, res, next) => {
        try {
            let user = await models.Usuario.findOne({email: req.body.email, estado:1});
            if (user) {
                //existe un usuario con ese email 
                let match = await bcrypt.compare(req.body.password, user.password);
                if (match) {
                    // res.json('password correcto'); aca vamos a generar el token
                    let tokenReturn = await token.encode(user._id, user.rol, user.email);
                    res.status(200).json({user, tokenReturn});

                } else {
                    res.status(404).send({
                        message: 'passwors incorrecto'
                    });
                }
            } else {
                res.status(404).send({
                    message:'No existe el usuario'
                });
            }
        } catch (e) {
            res.status(500).send({
                message:'Ocurrio un error'
            });
            next(e);
        }
    }
}
