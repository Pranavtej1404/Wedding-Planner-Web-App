import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";


export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: '1038342948777-sesjs7v54t47lnt3bq7592d5r6gr9gea.apps.googleusercontent.com',
      clientSecret: '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',
    }),
    
  ],
  secret: process.env.NEXTAUTH_SECRET,
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
