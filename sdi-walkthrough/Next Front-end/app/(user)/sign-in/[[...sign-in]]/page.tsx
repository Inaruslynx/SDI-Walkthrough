import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="grid place-items-center">
      <div className="mt-16">
        <SignIn signUpUrl="/sign-up" />
      </div>
    </div>
  );
}
