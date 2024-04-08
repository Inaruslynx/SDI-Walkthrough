export default function UsersPage({
  params,
}: {
  params: { department: string };
}) {
  return <div className="p-8">Admin - {params.department} Users</div>;
}
