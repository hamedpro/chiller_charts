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
            name: "compressors",
            is_enable: () => current_location_pathname.match(/\/compressors(.*)/),
            path : "/compressors"
        },
        {
            name: "common",
            is_enable: () => current_location_pathname.match(/\/common/),
            path : "/common"
        },
        {
            name: "settings",
            is_enable: () => current_location_pathname.match(/\/settings/),
            path : "/settings"
        }
    ]
    return (
        <>
            {routes.map(route => {
                return (
                    <p
                        key={route.name}
                        className={['text-black', route.is_enable() ? "text-white bg-blue-600" : ""].join(" ")}
                        onClick={ ()=>nav(route.path)}
                    >
                        { route.name}
                    </p>
                )
            })}
        </>
    )
}