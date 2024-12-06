import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="grid place-items-center">
      <div className="mt-16">
        <SignUp signInUrl="/sign-in" />
      </div>
    </div>
  );
}
