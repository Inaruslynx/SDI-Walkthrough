import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="grid place-items-center">
    <div className="mt-16">
      <SignUp path={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL} />
    </div>
    </div>
  );
}

// signInUrl="/sign-in"
