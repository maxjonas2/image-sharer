import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

type Credential = Record<"username" | "password", string> | undefined;

function createRequestInit<T>(credentials: T) {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  };
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async function (credentials, req) {
        const response = await fetch(
          "string_here",
          createRequestInit<Credential>(credentials)
        );

        const user = await response.json();

        if (response.ok && user) {
          return Promise.resolve(user);
        }

        return null;
      },
    }),
  ],
});

export { handler as POST, handler as GET };
