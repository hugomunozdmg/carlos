# BACK-END_Proyecto_RedSocialM2_LCSC

Rutas funcionales

Usuarios
///Registrar Usuario
- POST http://localhost:3000/usuarios/register
json{ "username": "", "email": "", "password": "" }

///Log in Usuario
- POST http://localhost:3000/usuarios/login
json{ "email": "", "password": "" }

////Editar datos usuario
- PUT http://localhost:3000/usuarios/edituser/userid
json{ "username": "", "email": "", "password": "" }

///Borar usuario
- DELETE http://localhost:3000/usuarios/deleteuser/userid

///Ver todos los usuarios
- GET http://localhost:3000/usuarios/seeusers

Posts
////Crear post
- POST http://localhost:3000/posts/addpost
json{ "userId": "", "username": "", "body": "" }

////Ver todo los posts
- GET http://localhost:3000/posts

///Ver todo los posts de un usuario
- GET http://localhost:3000/posts/user/userId

///Ingresa los ids de seguidores y muestra todos los posts de esos ids (por orden de date)
- POST http://localhost:3000/posts/feed
json{ "userIds": ["", ""] }

//Editar Post
- PUT http://localhost:3000/posts/editpost/postId
json{ "body": "" }

///Borrar post
DELETE http://localhost:3000/posts/deletepost/:postId

SEGUIDORES
///Usuario 1 sigue a usuario 2
- POST http://localhost:3000/seguidores/seguir
json{ "userId": "", "followId": "" }

///Usuario 1 deja de seguir a usuario 2
- POST http://localhost:3000/seguidores/dejar
json{ "userId": "", "followId": "" }

///Ve todos los seguidores de un usuario
- GET http://localhost:3000/seguidores/userId

MENSAJES
///Manda un mensaje de usuario 1 a usuario 2
- POST http://localhost:3000/mensajes
json{ "senderId": "", "receiverId": "", "text": "" }

///Ve todos los mensajes de un usuario
- GET http://localhost:3000/mensajes/userId

/// Ve todos los mensajes entre usuario 1 y usuario 2
- GET http://localhost:3000/mensajes/conversacion/userId1/userId2
