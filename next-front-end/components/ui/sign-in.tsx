import MicrosoftSignIn from "./MicrosoftSignIn";

export default function SignIn() {
  return (
    <form action={MicrosoftSignIn}>
      <button type="submit">Signin with Microsoft Entra ID</button>
    </form>
  );
}
