const router = require('express').Router();
const conexion = require('../config/conexion');
const nodeMailer = require('nodemailer');

router.post('/envioCorreo',(req,res)=>{
    const{nombre,email,telefono,mensaje} = req.body;

    let config = nodeMailer.createTransport({
        host:'smtp.gmail.com',
        post:587,
        auth:{
            user:'gestionlegaloficial@gmail.com',
            pass:'ywidbtjuzyohajlj'
        }
    });

    const opciones ={
        from: 'Gestion Legal',
        subject:'Consulta para Gestion Legal',
        to: 'gestionlegaloficial@gmail.com',
        text:'Hola soy ' + nombre +' mis datos son:\n'
        +'telefono: '+telefono+'\n'
        +'correo: '+email+'\n'
        +'Les envio este mensaje:\n'+mensaje
    };

    config.sendMail(opciones,function(err,info){
        if(err) throw err;
        else{
            res.json({status: 'correo enviado'});
        }
    });


});

module.exports=router;