import { Navbar } from "./_components/navbar"

const DashboardLayout = ({
    children
}:{
    children: React.ReactNode;
})=>{
    return (
        <div className="h-full"> 
            <div className="fixed z-0">
                <Navbar/>
            </div>
                
            {children}
        </div>
    )
    
}
export default DashboardLayout; 