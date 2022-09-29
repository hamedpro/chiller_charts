export function Section({title,className,children}) {
    return (
        <div className={["border border-blue-400 rounded",className].join(' ')}>
            <div className="px-2 flex items-center min-h-fit w-full border-b border-stone-400">
                <h1 className="text-lg">{title}</h1>
            </div>
            <div className="p-1">
                {children}
            </div>
        </div>
    )
}