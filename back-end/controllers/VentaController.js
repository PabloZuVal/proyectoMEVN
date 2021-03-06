import models from '../models';

async function aumentarStock(idarticulo, cantidad) {
    let { stock } = await models.Articulo.findOne({ _id: idarticulo });
    let nStock = parseInt(stock) + parseInt(cantidad);
    const reg = await models.Articulo.findByIdAndUpdate({ _id: idarticulo }, { stock: nStock });
}
async function disminuirStock(idarticulo, cantidad) {
    let { stock } = await models.Articulo.findOne({ _id: idarticulo });
    let nStock = parseInt(stock) - parseInt(cantidad);
    const reg = await models.Articulo.findByIdAndUpdate({ _id: idarticulo }, { stock: nStock });
}

export default {
    add: async (req, res, next) => {
        try {
            const reg = await models.Venta.create(req.body);
            //actualizar el stock
            let detalles = req.body.detalles;
            detalles.map(function (x) {
                disminuirStock(x._id, x.cantidad)
            });
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
            const reg = await models.Venta.findOne({ _id: req.query._id })
                .populate('usuario', { nombre: 1 })
                .populate('persona', { nombre: 1 });
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
            let valor = req.query.valor; //1 ordenar de forma acendente -1 decendente, los que se han creado recientemente aparecen primero 
            const reg = await models.Venta.find({ $or: [{ 'num_comprobante': new RegExp(valor, 'i') }, { 'serie_comprobante': new RegExp(valor, 'i') }] })
                .populate('usuario', { nombre: 1 })
                .populate('persona', { nombre: 1 })
                .sort({ 'createdAt': -1 });
            res.status(200).json(reg);

        } catch (e) {
            res.status(500).send({
                message: 'ocurrio un error'
            });
            next(e);
        }
    },
    /*
    udpdate: async (req, res, next) => {
        try {
            const reg = await models.Categoria.findByIdAndUpdate({ _id: req.body._id }, { nombre: req.body.nombre, descripcion: req.body.descripcion });
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
            const reg = await models.Categoria.findByIdAndDelete({ _id: req.body._id });
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'ocurrio un error'
            });
            next(e);
        }
    },*/
    activate: async (req, res, next) => {
        try {
            const reg = await models.Venta.findByIdAndUpdate({ _id: req.body._id }, { estado: 1 });
            //actualizar el stock
            let detalles = reg.detalles;
            detalles.map(function (x) {
                disminuirStock(x._id, x.cantidad)
            });
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
            const reg = await models.Venta.findByIdAndUpdate({ _id: req.body._id }, { estado: 0 });
            //actualizar el stock
            let detalles = reg.detalles;
            detalles.map(function (x) {
                aumentarStock(x._id, x.cantidad)
            });
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'ocurrio un error'
            });
            next(e);
        }
    },
    grafico12meses: async (req, res, next) => {
        try {
            const reg = await models.Venta.aggregate(
                [
                    {
                        $group:{
                            _id:{
                                mes:{$month:"$createdAt"},
                                year:{$year:"$createdAt"}
                            },
                            total:{ $sum:"$total" },
                            numero:{$sum:1 }
                        }
                    },
                    {
                        $sort:{
                            "_id.year":-1,"_id-mes":-1
                        }
                    }
                ]
            ).limit(12);
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message:'Ocurrio un error'
            });
            next(e);
        }
    },
    consultaFechas: async (req, res, next) => {
        try { //primer parametro de find es una busqueda y el siquiente un parametro
            let start = req.query.start;
            let end = req.query.end;

            const reg = await models.Venta.find({ "createdAt": { "$gte": start, "$lt": end } })
                .populate('usuario', { nombre: 1 })
                .populate('persona', { nombre: 1 })
                .sort({ 'createdAt': -1 });
            res.status(200).json(reg);

        } catch (e) {
            res.status(500).send({
                message: 'ocurrio un error'
            });
            next(e);
        }
    }
}