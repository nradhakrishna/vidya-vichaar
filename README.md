Vidya vichaar is a classroom doubt platform, every doubt appears as a sticky note.
Students can post doubts, teacher of a particular can see all the doubts of that class, and change their tag as answered, important or can also delete.
Teaching assistant can be added by the teacher, teaching assistant can only see the doubts of the class.

HOW TO RUN:
==========
1) Add .env to backend directory file that contains "MONGO_URI", "JWT_SECRET", "PORT">
   mongo_uri is your mongodb uri.
   JWT_SECRET is the "master key" that ensures only your application can create and validate authentication tokens, making your user sessions secure and preventing unauthorized access.
   PORT is the server running port of backend.
2) cd backend-> npm start
3) cd frontend-> npm start
