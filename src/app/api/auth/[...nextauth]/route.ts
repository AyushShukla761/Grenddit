import { authOptions } from "@/lib/auth"
import NextAuth from "next-auth"

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

// import NextAuth from "next-auth";
// import Providers from "next-auth/providers";
// import GoogleProvider from 'next-auth/providers/google'

// export default NextAuth({
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//   ],
//   pages: {
//     signIn: '/auth/signin',
//     error: '/auth/error', // Error page is set correctly
//   },
// });