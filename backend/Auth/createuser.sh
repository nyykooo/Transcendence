curl -s -X POST http://localhost:3000/register -H 'Content-Type: application/json' -d '{"email":"a@a.com","password":"pass123","name":"Ada"}'

curl -s -X POST http://localhost:3000/login -H 'Content-Type: application/json' -d '{"email":"a@a.com","password":"pass123"}'

curl -s http://localhost:3000/profile -H "Authorization: Bearer YOUR_TOKEN_HERE"
