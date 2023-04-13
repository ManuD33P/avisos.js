/* La idea basicamente es de soberbio77 pero quedo obsoleto asi que hice uno nuevo. */

/* Links de sonidos obtenidos de sonidosmp3gratis.com 

http://www.sonidosmp3gratis.com/sounds/messenger-tono-mensaje-.mp3  Tono Messenger.
http://www.sonidosmp3gratis.com/sounds/nudge-nudge-msn.mp3      Para enviar nudge.

para evitar que queden obsoletos los link's, voy agregar una función para que puedan agregar mas sonidos. ver la lista y editarla.

Mejoras: * Nuevo sistema, de registro: Ahora si el usuario desactiva el sonido por mas que salga de la sala, no volvera a escuchar.
         * Links Editables.
         * Sin molestos Scribbles. ( No cuenta como mejora).
         * Codigo mejor optimizado.
         * Se registra el usuario para saber si tiene desactivado o activado el sonido, para que cuando salga de la sala no vuelva a escuhar.
        
*/

Users.local(function(u){
    if(Registry.getValue(u.name)==null){
        Registry.setValue(u.name,"si");
        print(u,u.name+" Se activo la alerta de actividad de la sala para desactivarlo ----> #sinSonido");
    }
})
function onLoad(){
    print("X------- Comandos del script avisos.js by Manu16  -------X");
    print("");
    print("#conSonido ----> Para activar las alerta de actividad de la sala.");
    print("#sinSonido ----> Para desactivar las alerta de actividad de la sala");
    print("#verLista  ----> Para ver la lista de links de los sonidos");
    print("#addLink +link   ----> Para agregar un nuevo sonido ");
    print("#remLink +id   ----> Para quitar un link de la lista,para ver los ids #verLista");
    print("#enviarSonido +idLink,+userID or #enviarSonido +idLink ----> Para enviar un sonido a toda la sala o de forma personalizada.");
    print("#addevent +evento,+idLink  -----> para agregar los sonidos a los eventos los id los obtienes de #verLista");
    print("");
    data.addTemp();
}
var data = {
sonidos : [], //0- msn 1-nudge
obtenerLink: function(id,u){
    if(id<this.sonidos.length){
    return this.sonidos[id];
    } else {
        return print(u,u.name+" El id que pusiste como argumento, no es correcto, verifica la lista y vuelve a intentar.");
    }
},
addTemp: function(){
    if(File.exists("enlaces.txt")){
    var archivosTemporales=JSON.parse(File.load("enlaces.txt"));
    if(archivosTemporales.length>0){
    for(var i in archivosTemporales){
        this.sonidos.push(archivosTemporales[i]);
    } 
}   
} else {
    return print("Error al cargar los enlaces de los sonidos, Verificar si el archivo se encuentra en la carpeta data del script.")
    }
},
guardarTemp: function(){
    if(this.sonidos.length>0){
        File.save("enlaces.txt",JSON.stringify(this.sonidos));
    }
},
listaLink: function(u){
    if(this.sonidos[0]==null||this.sonidos[0]==undefined){
     return print(u,u.name+"No hay ningun link en la lista");
    } else {
        for(var i in this.sonidos){
            print(u, i+":  "+this.sonidos[i]);
        }
    }
},
add:function(string,u){
    if(string.substr(0,7)=='http://' || string.substr(0,8)=='https://'){
    this.sonidos.push(string);
    this.guardarTemp();
     return print(u,u.name+" El link ha sido agregado con éxito");  
} else{ return print(u,u.name+" Asegurate de que el link sea correcto y empiece con https:// o http://")}
},
rem:function(id,u){
if(this.sonidos[id]==null||this.sonidos[0]==undefined){
    return print(u,u.name+" Asegurate que el id sea el correcto con el comando #soundlist");
} else {

    this.sonidos.splice(id,1);
    this.guardarTemp();
}
},
enviarSonido(u,t,sonidoID){
/*
u = usuario emisor
t = usuario receptor, si es string, se los envia a todos.
sonidoID= id del sonido.

*/
if(typeof(t)=='string'){
    link = this.obtenerLink(sonidoID,u);
    Users.local(function(usuario){
        if(Registry.getValue(usuario.name)=="si"){
        usuario.sendHTML('<div id="topiccont"><embed height="0.0000000000001" width="0.0000000000001" autostart="true" src="'+link+'"></div>');
        }    
    })
} else {
    link = this.obtenerLink(sonidoID,u);
    if(Registry.getValue(t.name)=="si"){
    t.sendHTML('<div id="topiccont"><embed height="0.0000000000001" width="0.0000000000001" autostart="true" src="'+link+'"></div>')
    }
}
}
}
var usuarioAnterior;
function onTextBefore(u,text){
   if(u.name!=usuarioAnterior || usuarioAnterior==undefined||usuarioAnterior==null){
    usuarioAnterior=u.name
    Room.setUrl("https://github.com/ManuD33P?tab=repositories",u.name+" ah enviado el ultimo mensaje.");
    if(Registry.getValue('onText')!=null){
     var id = Registry.getValue('onText');
        data.enviarSonido(u,"all",id);
    }
    return text;
   } else {
    return text;
   }
}
function onIdled(u){
    if(Registry.getValue('onIdled')!=null){
        var id = Registry.getValue('onIdled');
        data.enviarSonido(u,u,id);
    }
}
function onUnidled(u){
    if(Registry.getValue('onUnidled')!=null){
        var id = Registry.getValue('onUnidled');
        data.enviarSonido(u,u,id);
    }
}

var pmAnterior={usuario:"",target:""}
function onPM(u,target){
    if(Registry.getValue('onPM')!=null){
        if(pmAnterior.usuario!=u.name && pmAnterior.target!=target.name){
    var id =Registry.getValue('onPM');
        data.enviarSonido(u,target,id);
        pmAnterior.usuario=u.name;
        pmAnterior.target=target.name;
    }
    }
}

function onPart(u){
    if(Registry.getValue('onPart')!=null){
        var id =Registry.getValue('onPart');
            data.enviarSonido(u,"all",id);
        }
}
function onJoin(user){
   if(Registry.getValue(user.name)==null){
    Registry.setValue(user.name,"si");
    print(user,"");
    return print(user,user.name+" se te ah activado el aviso por sonido, cuando hay actividad en la sala. Puedes desactivarlo con el comando --> #sinSonido");
   } else if(Registry.getValue(user.name)=="no"){
    print(user,"");
    return print(user,user.name+" se detecto que tienes silenciado la alerta de actividad de la sala. Puedes activarlo con el comando #conSonido");
   }
   if(Registry.getValue('onJoin')!=null){
    var id = Registry.getValue('onJoin');
    data.enviarSonido(user,user,id);
   }
}



function onCommand(u,cmd,target,arg){
    if(cmd=='conSonido'){
        if(Registry.getValue(u.name)=='no'){
            Registry.setValue(u.name,"si");
            print(u,u.name+" Se ha activado la alerta de actividad de la sala");
        } else {
            print(u.name," Ya lo tienes activado");
        }
    }
    if(cmd=='sinSonido'){
        if(Registry.getValue(u.name)=='si'){
            Registry.setValue(u.name,"no");
            print(u,u.name+" Se ha desactivado la alerta de actividad de la sala");
        } else {
            print(u,u.name+" Ya tienes desactivado los sonidos, si lo que quieres es activarlo prueba con el comando #conSonido");
        }
    }
    if(cmd=='verLista'){
        data.listaLink(u);
    }
    if(cmd.substr(0,8)=='addLink ' && u.level==3){
      var temp = cmd.substr(8);
      data.add(temp,u);
    }
    if(cmd.substr(0,8)=='remLink' && u.level==3){
        var temp = cmd.substr(8);
        data.rem(temp,u);
    }
    if(cmd.substr(0,9)=='addevent ' && u.level==3){
       var temp = cmd.substr(9).split(",");
       var string = temp[0];
       var id = temp[1];
       var condicion =/[0-9]/
       if(condicion.test(id)==true){
       if(data.sonidos.length>id){
        evento_id(string,id)
       } 
       } else {
        print(u,u.name+" El id tiene que ser un numero");
       }   
    }
    if(cmd.substr(0,13)=='enviarSonido '){ // #enviarSonido +idSonido,+target(default=all);
        
        var temp = cmd.substr(13).split(",");
       var id = temp[0];
       var target= temp[1];
       var condicion = /[0-9]/g
              
       if(condicion.test(id)==true && id < data.sonidos.length){
        if(user(target)!=null){
            data.enviarSonido(u,user(target),id);
        }else{
            data.enviarSonido(u,"all",id);
        }
       }
    }
}
function evento_id(string,id){
    switch(string){
        case "onJoin":  // para la bienvenida
            Registry.setValue("onJoin",id);
            print("Se establecio sonido para el evento "+string)
            break;
        case "onPart": // para la salida
            Registry.setValue("onPart",id);
            print("Se establecio sonido para el evento "+string)
            break;
        case "onText": // para la sala
            Registry.setValue("onText",id);
            print("Se establecio sonido para el evento "+string)
            break;
        case "onPM": // para el mensaje privado.
            Registry.setValue("onPM",id);
            print("Se establecio sonido para el evento "+string)
            break;
        case "onIdled": //para cuando se idlea
            Registry.setValue("onIdled",+id);
            print("Se establecio sonido para el evento "+string)
            break;
        case "onUnidled": //para cuando vuelve
            Registry.setValue("onUnidled",+id);
            print("Se establecio sonido para el evento "+string)
            break;
        default:
            print("no has ingresado un evento valido "+string);
    }
}

function onHelp(u){
    print(u,"X------- Comandos del script avisos.js by Manu16 -------X");
    print(u,"");
    print(u,"#conSonido ----> Para activar las alerta de actividad de la sala.");
    print(u,"#sinSonido ----> Para desactivar las alerta de actividad de la sala");
    print(u,"#verLista  ----> Para ver la lista de links de los sonidos");
    print(u,"#addLink +link   ----> Para agregar un nuevo sonido ");
    print(u,"#remLink +id   ----> Para quitar un link de la lista,para ver los ids #verLista");
    print(u,"#enviarSonido +idLink,+userID or #enviarSonido +idLink ----> Para enviar un sonido a toda la sala o de forma personalizada.");
    print(u,"#addevent +evento,+idLink  -----> para agregar los sonidos a los eventos los id los obtienes de #verLista");
    print(u,"");
}