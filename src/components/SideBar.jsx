import { DataUsageRounded, Settings } from "@mui/icons-material"
import { useEffect } from "react"
import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

export function SideBar() {
    var loc = useLocation()
    var nav = useNavigate()
    var [current_location_pathname, set_current_location_pathname] = useState(loc.pathname)
    useEffect(() => {
        set_current_location_pathname(loc.pathname)
    }, [loc])
    var routes = [
        {
            name: "charts",
            is_enable: () => current_location_pathname.match(/(\/charts)|(\/)$/),
            path: "/charts",
            icon : <DataUsageRounded />
        },
        {
            name: "settings",
            is_enable: () => current_location_pathname.match(/\/settings/),
            path: "/settings",
            icon : <Settings />
        }
    ]
    return (
        <div className="flex flex-col space-y-1">
            {routes.map(route => {
                return (
                    <div
                        key={route.name}
                        className={['duration-300 cursor-pointer p-2 flex space-x-1 flex-row', (route.is_enable() ? "text-white bg-blue-600" : "text-black hover:bg-blue-500")].join(" ")}
                        onClick={ ()=>nav(route.path)}
                    >
                        <div>{route.icon}</div>
                        <span>{route.name}</span>
                    </div>
                )
            })}
        </div>
    )
}