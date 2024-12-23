import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="grid place-items-center">
      <div className="mt-16">
        <SignIn path={process.env.NEXT_PUBLIC_SIGN_IN_URL} />
      </div>
    </div>
  );
}

// signUpUrl="/sign-up"
