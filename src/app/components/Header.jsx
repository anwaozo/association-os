
export default function Header({ title, subTitle  }) {
   return (
      <header className="mb-8 dashboard-header-bg">
         <h1 className="text-2xl font-semibold text-black">{ title }</h1>
         <p className="text-gray-400">{subTitle}</p>
      </header>
   );
}
