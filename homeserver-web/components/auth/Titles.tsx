export function Titles({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="m-0 font-bold uppercase text-[#2563eb]">AMCloud Server</h1>

      <h2>{title}</h2>
    </div>
  );
}
