export default function ReportPage({
    params,
  }: {
    params: { department: string };
  }) {
    return <div className="p-16">{params.department} Report</div>;
  }
  