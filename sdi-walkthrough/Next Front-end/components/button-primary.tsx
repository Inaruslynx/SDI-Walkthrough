

export default function ButtonPrimary({ children } : Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <>
      <button className="btn btn-primary">{children}</button>
    </>
  );
}
