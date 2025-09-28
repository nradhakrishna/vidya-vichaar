Vidya vichara is a classroom doubt platform, every doubt appears as a sticky note.
Students can post doubts, teacher of the particular class can see all the doubts of that class, and change their tag as answered, important or can also delete. Duplicate doubts by same student are not allowed. 
A student can only see their doubts of that particular class.
Teaching assistant can be added and removed by the teacher, teaching assistant can only see the doubts of the class. Teaching assistant can only be binded to one class at a time.
Teacher can only create one class and share the code with students, students can join the class with code and then can leave the class to join another.

HOW TO RUN:
==========
1) Add .env to backend directory file that contains "MONGO_URI", "JWT_SECRET", "PORT"
   mongo_uri is your mongodb uri.
   JWT_SECRET is the "master key" that ensures only your application can create and validate authentication tokens, making your user sessions secure and preventing unauthorized access.
   PORT is the server running port of backend.
2) from vidya-vichaar cd backend-> npm install ->npm start
3) from vidya-vichaar cd frontend-> npm install ->npm start

Github link- https://github.com/nradhakrishna/vidya-vichaar
