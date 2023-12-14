import SettingsForm from "@/components/settings-form";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface SettingsPageProps {
    params: { storeID: string };
}

async function SettingsPage(props: SettingsPageProps) {

    const { userId } = auth();
    
    if (!userId) {
        redirect("/sign-in");
    }

    const store = await prismadb.store.findFirst({
        where: {
            id: props.params.storeID,
            userId,
        },
    });

    if (!store) {
        redirect("/");
    }



    return ( 
    <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <SettingsForm initialData={store}/>
        </div>
    </div> 
    );
}

export default SettingsPage;