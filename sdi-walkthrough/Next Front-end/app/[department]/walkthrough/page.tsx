export default function WalkthroughPage({
  params,
}: {
  params: { department: string };
}) {
  return <div className="p-16">{params.department} Walkthrough</div>;
}
