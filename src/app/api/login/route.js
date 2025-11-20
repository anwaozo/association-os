import { fakeUsers } from '@/lib/fakeUsers';

export async function POST(request) {
   const body = await request.json();
   const { username, password } = body;

   const user = fakeUsers.find(
      (u) => u.username === username && u.password === password
   );

   if (!user) {
      return new Response(
         JSON.stringify({ message: 'Invalid username or password' }),
         { status: 401 }
      );
   }

   // Simulate JWT token
   const fakeToken = `token_${user.id}_${Date.now()}`;

   return Response.json({
      token: fakeToken,
      user: {
         id: user.id,
         name: user.name,
         username: user.username,
         role: user.role,
      },
   });
}
